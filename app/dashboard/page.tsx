"use client"
import { Box, Typography, Paper, CircularProgress, Alert, TextField, Button, Stack, Chip, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import React from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface AggregatedProperties {
  source?: Array<{ source: string; datasets: string[] }>;
  access_type?: string[];
  data_quality_flags?: string[];
  name?: string[];
  region?: Array<{ id: string; name: string }>;
  scope?: string[][][];
  source_lca_activity?: string[];
  unit?: string[];
  unit_type?: string[];
  year?: number[];
}

interface ClimatiqResult {
  activity_id: string;
  aggregated_properties?: AggregatedProperties;
  category?: string;
  name?: string;
  possible_filters?: any;
  sector?: string;
  total_emission_factors?: number;
  total_filtered_factors?: number;
}

interface ClimatiqResponse {
  current_page?: number;
  last_page?: number;
  possible_filters?: any;
  results: ClimatiqResult[];
  total_emission_factors?: number;
  total_results?: number;
}

interface ConstituentGases {
  co2e_total?: number | null;
  co2e_other?: number | null;
  co2?: number | null;
  ch4?: number | null;
  n2o?: number | null;
}

interface FactorResult {
  id: string;
  activity_id: string;
  name: string;
  category?: string;
  sector?: string;
  region?: string;
  region_name?: string;
  year?: number;
  source?: string;
  source_dataset?: string;
  source_link?: string;
  unit?: string;
  unit_type?: string;
  factor?: number | null;
  scopes?: string[];
  access_type?: string;
  data_quality_flags?: string[];
  description?: string;
  constituent_gases?: ConstituentGases;
  uncertainty?: number | null;
  source_lca_activity?: string;
  supported_calculation_methods?: string[];
}

interface FactorsResponse {
  current_page?: number;
  last_page?: number;
  results: FactorResult[];
  total_results?: number;
}

export default function Dashboard() {
  const [data, setData] = useState<ClimatiqResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [dataVersion, setDataVersion] = useState('^28');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedFactorRows, setExpandedFactorRows] = useState<Set<string>>(new Set());
  const [factorsCache, setFactorsCache] = useState<Map<string, FactorResult[]>>(new Map());
  const [loadingFactors, setLoadingFactors] = useState<Set<string>>(new Set());

  const fetchClimatiqData = async () => {
    setLoading(true);
    setError(null);
    try {
      // URL encode the data_version if it contains ^
      const encodedDataVersion = encodeURIComponent(dataVersion);
      const params = new URLSearchParams({
        page: page.toString(),
        data_version: encodedDataVersion,
      });
      
      const response = await fetch(`/api/climatiq?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      // Reset expanded rows when data changes
      setExpandedRows(new Set());
      setFactorsCache(new Map());
    } catch (err) {
      console.error('Error fetching Climatiq data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch Climatiq data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFactors = async (activityId: string) => {
    // Check if already cached
    if (factorsCache.has(activityId)) {
      return;
    }

    setLoadingFactors(prev => new Set(prev).add(activityId));
    try {
      const encodedDataVersion = encodeURIComponent(dataVersion);
      const params = new URLSearchParams({
        activity_id: activityId,
        page: '1',
        data_version: encodedDataVersion,
      });
      
      const response = await fetch(`/api/climatiq/factors?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const result: FactorsResponse = await response.json();
      setFactorsCache(prev => new Map(prev).set(activityId, result.results || []));
    } catch (err) {
      console.error('Error fetching factors:', err);
      setFactorsCache(prev => new Map(prev).set(activityId, []));
    } finally {
      setLoadingFactors(prev => {
        const newSet = new Set(prev);
        newSet.delete(activityId);
        return newSet;
      });
    }
  };

  const handleExpandRow = async (activityId: string) => {
    const isExpanded = expandedRows.has(activityId);
    
    if (isExpanded) {
      // Collapse
      setExpandedRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(activityId);
        return newSet;
      });
      // Also collapse all its factor rows
      setExpandedFactorRows(prev => {
        const newSet = new Set(prev);
        const factors = factorsCache.get(activityId) || [];
        factors.forEach(factor => {
          newSet.delete(factor.id || '');
        });
        return newSet;
      });
    } else {
      // Expand - fetch factors if not cached
      setExpandedRows(prev => new Set(prev).add(activityId));
      await fetchFactors(activityId);
    }
  };

  const handleExpandFactorRow = (factorId: string) => {
    const isExpanded = expandedFactorRows.has(factorId);
    
    if (isExpanded) {
      setExpandedFactorRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(factorId);
        return newSet;
      });
    } else {
      setExpandedFactorRows(prev => new Set(prev).add(factorId));
    }
  };

  useEffect(() => {
    fetchClimatiqData();
  }, [page, dataVersion]);

  // Build hierarchical row structure with parent and children
  const buildHierarchicalRows = () => {
    if (!data?.results) return [];

    // First, create parent rows with nested children property
    const parentRows = data.results
      .map((item, index) => {
        const aggregatedProps = item.aggregated_properties || {};
        const regions = aggregatedProps.region || [];
        const years = aggregatedProps.year || [];
        const units = aggregatedProps.unit || [];
        const sources = aggregatedProps.source || [];
        
        const parentRow = {
          id: item.activity_id || `row-${index}`,
          activity_id: item.activity_id || 'N/A',
          name: item.name || aggregatedProps.name?.[0] || 'N/A',
          category: item.category || 'N/A',
          sector: item.sector || 'N/A',
          unit: units.join(', ') || 'N/A',
          regions: regions.map(r => r.name).join(', ') || 'N/A',
          region_count: regions.length,
          year: years.length > 0 ? years.join(', ') : 'N/A',
          source: sources.map(s => s.source).join(', ') || 'N/A',
          total_emission_factors: item.total_emission_factors || 0,
          total_filtered_factors: item.total_filtered_factors || 0,
          isParent: true,
          children: [] as any[], // Sub-rows are nested here
          ...item,
        };

        // Add children (sub-rows) if expanded
        if (expandedRows.has(parentRow.activity_id)) {
          const factors = factorsCache.get(parentRow.activity_id) || [];
          const isLoading = loadingFactors.has(parentRow.activity_id);

          if (isLoading) {
            parentRow.children.push({
              id: `${parentRow.activity_id}-loading`,
              name: 'Loading...',
              isChild: true,
              isLoading: true,
            });
          } else if (factors.length === 0) {
            parentRow.children.push({
              id: `${parentRow.activity_id}-empty`,
              name: 'No factors found',
              isChild: true,
            });
          } else {
            // Add factor rows as children (with their own children for details)
            factors.forEach((factor, idx) => {
              const factorRowId = `${parentRow.activity_id}-factor-${factor.id || idx}`;
              const factorRow = {
                id: factorRowId,
                factorId: factor.id,
                activity_id: parentRow.activity_id,
                parentId: parentRow.id,
                name: factor.name || 'N/A',
                category: factor.category || 'N/A',
                sector: factor.sector || 'N/A',
                unit: factor.unit || 'N/A',
                regions: factor.region_name || 'N/A',
                year: factor.year || 'N/A',
                source: factor.source || 'N/A',
                region: factor.region || 'N/A',
                factor: factor.factor || null,
                scopes: factor.scopes?.join(', ') || 'N/A',
                access_type: factor.access_type || 'N/A',
                data_quality_flags: factor.data_quality_flags?.join(', ') || '',
                description: factor.description || '',
                isChild: true,
                isFactorRow: true,
                children: [] as any[], // Detail rows will be nested here
                ...factor,
              };

              // Add detail rows if factor is expanded - two separate rows
              if (expandedFactorRows.has(factor.id || factorRowId)) {
                // Use parent and factor names for sorting to keep detail rows together
                const parentName = parentRow.name || '';
                const factorName = factorRow.name || '';
                
                // First detail row: Description
                factorRow.children.push({
                  id: `${factorRowId}-detail-info`,
                  parentId: factorRowId,
                  isDetailRow: true,
                  detailType: 'info',
                  description: factor.description || 'N/A',
                   activity_id: factor.activity_id || 'N/A',
                  source: factor.source || 'N/A',
                  source_dataset: factor.source_dataset || 'N/A',
                  source_link: factor.source_link || '',
                  year: factor.year || 'N/A',
                  year_released: (factor as any).year_released || 'N/A',
                  region: factor.region || 'N/A',
                  region_name: factor.region_name || 'N/A',
                  unit: factor.unit || 'N/A',
                  unit_type: factor.unit_type || 'N/A',
                  scopes: factor.scopes?.join(', ') || 'N/A',
                  source_lca_activity: factor.source_lca_activity || 'N/A',
                  uncertainty: factor.uncertainty,
                  supported_calculation_methods: factor.supported_calculation_methods?.join(', ') || 'N/A',
                  data_quality_flags: factor.data_quality_flags || [],
                  constituent_gases: factor.constituent_gases,
                  access_type: factor.access_type || 'N/A',
                  name: `${parentName}${factorName}__detail_info`, // Include parent/factor names for sorting
                });
                
                // Second detail row: Activity ID, Source, Year, etc.
                // factorRow.children.push({
                //   id: `${factorRowId}-detail-info`,
                //   parentId: factorRowId,
                //   isDetailRow: true,
                //   detailType: 'info',
                //   activity_id: factor.activity_id || 'N/A',
                //   source: factor.source || 'N/A',
                //   source_dataset: factor.source_dataset || 'N/A',
                //   source_link: factor.source_link || '',
                //   year: factor.year || 'N/A',
                //   year_released: (factor as any).year_released || 'N/A',
                //   region: factor.region || 'N/A',
                //   region_name: factor.region_name || 'N/A',
                //   unit: factor.unit || 'N/A',
                //   unit_type: factor.unit_type || 'N/A',
                //   scopes: factor.scopes?.join(', ') || 'N/A',
                //   source_lca_activity: factor.source_lca_activity || 'N/A',
                //   uncertainty: factor.uncertainty,
                //   supported_calculation_methods: factor.supported_calculation_methods?.join(', ') || 'N/A',
                //   data_quality_flags: factor.data_quality_flags || [],
                //   constituent_gases: factor.constituent_gases,
                //   access_type: factor.access_type || 'N/A',
                //   name: `${parentName}${factorName}__detail_info`, // Include parent/factor names for sorting
                // });
              }
              parentRow.children.push(factorRow);
            });
          }
        }

        return parentRow;
      });

    return parentRows;
  };

  // Flatten hierarchical structure for DataGrid (which requires flat array)
  const flattenRows = (parentRows: any[]): GridRowsProp => {
    const flattened: any[] = [];
    
    parentRows.forEach((parentRow) => {
      // Add parent row first
      flattened.push(parentRow);
      
      // Then add all its children (sub-rows) immediately after
      if (parentRow.children && parentRow.children.length > 0) {
        parentRow.children.forEach((child: any) => {
          // Add child row (factor row)
          flattened.push(child);
          
          // Add detail rows if factor row has children
          if (child.children && child.children.length > 0) {
            flattened.push(...child.children);
          }
        });
      }
    });

    return flattened as GridRowsProp;
  };

  // Prepare rows for DataGrid - Group by name with nested children structure
  const buildRows = (): GridRowsProp => {
    const hierarchicalRows = buildHierarchicalRows();
    return flattenRows(hierarchicalRows);
  };

  const rows = buildRows();

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 500, 
      flex: 1,
      editable: false,
      cellClassName: (params) => {
        return params.row.isDetailRow ? 'detail-cell' : '';
      },
      renderCell: (params) => {
        const isParent = params.row.isParent;
        const isChild = params.row.isChild;
        const isFactorRow = params.row.isFactorRow;
        const isDetailRow = params.row.isDetailRow;
        const isLoading = params.row.isLoading;
        const isParentExpanded = isParent && expandedRows.has(params.row.activity_id);
        const isFactorExpanded = isFactorRow && expandedFactorRows.has(params.row.factorId || params.row.id);

        if (isLoading) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 4 }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              <Typography variant="body2">Loading factors...</Typography>
            </Box>
          );
        }

        if (isDetailRow) {
          const detailType = params.row.detailType;
          // Second subsection: Activity ID, Source, Year, etc.
          if (detailType === 'info') {
            return (
              <Box sx={{ 
                pl: 8, 
                py: 1.5,
                width: '100%',
                minWidth: 0,
                display: "flex", flexDirection: "column", rowGap: 2
              }}>
                <Box>
                {params.row.description && (
                    <Box>
                      <Typography>
                        {params.row.description || 'N/A'}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box>
                  {params.row.activity_id && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Activity ID:
                      </Typography>
                      <Typography variant="body2">{params.row.activity_id}</Typography>
                    </Box>
                  )}
                  {params.row.source && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Source:
                      </Typography>
                      <Typography variant="body2">{params.row.source}</Typography>
                    </Box>
                  )}
                  {params.row.source_dataset && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Source Dataset:
                      </Typography>
                      <Typography variant="body2">{params.row.source_dataset}</Typography>
                    </Box>
                  )}
                  {params.row.year && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Year:
                      </Typography>
                      <Typography variant="body2">{params.row.year}</Typography>
                    </Box>
                  )}
                  {params.row.year_released && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Year Released:
                      </Typography>
                      <Typography variant="body2">{params.row.year_released}</Typography>
                    </Box>
                  )}
                  {params.row.region_name && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Region:
                      </Typography>
                      <Typography variant="body2">{params.row.region_name} ({params.row.region})</Typography>
                    </Box>
                  )}
                  {params.row.unit && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Unit:
                      </Typography>
                      <Typography variant="body2">{params.row.unit}</Typography>
                    </Box>
                  )}
                  {params.row.unit_type && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Unit Type:
                      </Typography>
                      <Typography variant="body2">{params.row.unit_type}</Typography>
                    </Box>
                  )}
                  {params.row.scopes && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Scopes:
                      </Typography>
                      <Typography variant="body2">{params.row.scopes}</Typography>
                    </Box>
                  )}
                  {params.row.source_lca_activity && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        LCA Activity:
                      </Typography>
                      <Typography variant="body2">{params.row.source_lca_activity}</Typography>
                    </Box>
                  )}
                  {params.row.uncertainty !== null && params.row.uncertainty !== undefined && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Uncertainty:
                      </Typography>
                      <Typography variant="body2">{params.row.uncertainty}</Typography>
                    </Box>
                  )}
                  {params.row.supported_calculation_methods && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Calculation Methods:
                      </Typography>
                      <Typography variant="body2">{params.row.supported_calculation_methods}</Typography>
                    </Box>
                  )}
                  {params.row.access_type && (
                    <Box display={"flex"}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Access Type:
                      </Typography>
                      <Chip 
                        label={params.row.access_type} 
                        size="small" 
                        color={params.row.access_type === 'premium' ? 'primary' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  )}
                  {params.row.constituent_gases && (
                  <Box sx={{ mt: 2 }} display={"flex"}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                      Constituent Gases:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {params.row.constituent_gases.co2e_total !== null && params.row.constituent_gases.co2e_total !== undefined && (
                        <Chip label={`CO2e Total: ${params.row.constituent_gases.co2e_total}`} size="small" />
                      )}
                      {params.row.constituent_gases.co2 !== null && params.row.constituent_gases.co2 !== undefined && (
                        <Chip label={`CO2: ${params.row.constituent_gases.co2}`} size="small" />
                      )}
                      {params.row.constituent_gases.ch4 !== null && params.row.constituent_gases.ch4 !== undefined && (
                        <Chip label={`CH4: ${params.row.constituent_gases.ch4}`} size="small" />
                      )}
                      {params.row.constituent_gases.n2o !== null && params.row.constituent_gases.n2o !== undefined && (
                        <Chip label={`N2O: ${params.row.constituent_gases.n2o}`} size="small" />
                      )}
                    </Box>
                  </Box>
                )}
                {params.row.data_quality_flags && params.row.data_quality_flags.length > 0 && (
                  <Box sx={{ mt: 2 }} display={"flex"}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                      Data Quality Flags:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {params.row.data_quality_flags.map((flag: string, idx: number) => (
                        <Chip key={idx} label={flag} size="small" color="warning" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
                </Box>
              </Box>
            );
          }
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', pl: isDetailRow ? 8 : isChild ? 4 : 0 }}>
            {isParent && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandRow(params.row.activity_id);
                }}
                sx={{ mr: 1, p: 0.5 }}
              >
                {isParentExpanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
              </IconButton>
            )}
            {isFactorRow && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandFactorRow(params.row.factorId || params.row.id);
                }}
                sx={{ mr: 1, p: 0.5 }}
              >
                {isFactorExpanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
              </IconButton>
            )}
            {!isParent && !isFactorRow && <Box sx={{ width: 32 }} />}
            <Typography 
              variant="body2" 
              sx={{ 
                fontStyle: isChild ? 'normal' : 'normal',
                color: isDetailRow ? 'text.disabled' : isChild ? 'text.secondary' : 'text.primary',
                fontWeight: isParent ? 500 : isFactorRow ? 400 : 400,
              }}
            >
              {params.value || 'N/A'}
            </Typography>
          </Box>
        );
      },
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 200,
      flex: 1,
      renderCell: (params) => {
        if (params.row.isDetailRow) {
          return null;
        }
        if (params.row.isChild && !params.row.category) return null;
        return <Typography variant="body2">{params.value || 'N/A'}</Typography>;
      },
    },
    { 
      field: 'sector', 
      headerName: 'Sector',                                                                       
      width: 200,
      flex: 1,
      renderCell: (params) => {
        if (params.row.isDetailRow) return null;
        if (params.row.isChild && !params.row.sector) return null;
        return <Typography variant="body2">{params.value || 'N/A'}</Typography>;
      },
    },
    { 
      field: 'unit', 
      headerName: 'Unit', 
      width: 150,
      renderCell: (params) => {
        if (params.row.isDetailRow) return null;
        if (params.row.isChild && !params.row.unit) return null;
        return <Typography variant="body2">{params.value || 'N/A'}</Typography>;
      },
    },
    { 
      field: 'regions', 
      headerName: 'Region', 
      width: 250,
      flex: 1,
      renderCell: (params) => {
        if (params.row.isDetailRow) return null;
        if (params.row.isChild) {
          return <Typography variant="body2" color="text.secondary">{params.value || 'N/A'}</Typography>;
        }
        const regionCount = params.row.region_count || 0;
        return (
          <Box>
            {regionCount > 0 && (
              <Typography variant="caption" color="text.secondary">
                {regionCount} region{regionCount !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        );
      },
    },
    { 
      field: 'year', 
      headerName: 'Year', 
      width: 120,
      renderCell: (params) => {
        if (params.row.isDetailRow) return null;
        if (params.row.isChild && !params.row.year) return null;
        return <Typography variant="body2">{params.value || 'N/A'}</Typography>;
      },
    },
    { 
      field: 'source', 
      headerName: 'Source', 
      width: 200,
      flex: 1,
      renderCell: (params) => {
        if (params.row.isDetailRow) return null;
        if (params.row.isChild && !params.row.source) return null;
        return <Typography variant="body2">{params.value || 'N/A'}</Typography>;
      },
    },
    { 
      field: 'factor', 
      headerName: 'Factor', 
      width: 120,
      type: 'number',
      renderCell: (params) => {
        if (params.row.isDetailRow) return null;
        if (!params.row.isChild || params.value === null || params.value === undefined) return null;
        return <Typography variant="body2" fontWeight={500}>{params.value}</Typography>;
      },
    },
    { 
      field: 'total_emission_factors', 
      headerName: 'Total Factors', 
      width: 120,
      type: 'number',
      renderCell: (params) => {
        if (params.row.isDetailRow || params.row.isChild) return null;
        return <Typography variant="body2">{params.value || 0}</Typography>;
      },
    },
  ];

  const handleRefresh = () => {
    fetchClimatiqData();
  };

  return (
    <Box sx={{ width: '100%', height: '100%', p: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" gutterBottom>
            Climatiq Activities Data Grid 
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse and explore emission factor activities from the Climatiq API
          </Typography>
        </Box>

        {/* Filters and Controls */}
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TextField
              label="Data Version"
              value={dataVersion}
              onChange={(e) => setDataVersion(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
              placeholder="^28"
              helperText="e.g., ^28 or 27.27"
            />
            <TextField
              label="Page"
              type="number"
              value={page}
              onChange={(e) => setPage(parseInt(e.target.value) || 1)}
              size="small"
              sx={{ minWidth: 100 }}
              inputProps={{ min: 1, max: data?.last_page || 1 }}
            />
            <Button 
              variant="contained" 
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Stack>
          {data && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Page: {data.current_page || page} / {data.last_page || 'N/A'} | 
              Total Results: {data.total_results || 0} | 
              Showing: {data.results?.length || 0} results | 
              Total Emission Factors: {data.total_emission_factors?.toLocaleString() || 0}
            </Typography>
          )}
        </Paper>

        {/* Error Display */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Data Grid */}
        {!loading && !error && data && (
          <Paper sx={{ height: 600, width: '100%' }}>
              <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25 },
                },
              }}
              disableColumnSorting={true}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick={true}
              isRowSelectable={(params) => !params?.row?.isDetailRow}
              getRowHeight={(params) => {
                const found = rows.find((r: any) => r.id === params.id);
                return found && found.isDetailRow ? 400 : undefined;
              }}
              disableAutosize={false}
              pageSizeOptions={[10, 25, 50, 100]}
              checkboxSelection
              getRowClassName={(params) => {
                if (params.row.isDetailRow) {
                  return 'detail-row';
                }
                if (params.row.isFactorRow) {
                  return 'factor-row';
                }
                if (params.row.isChild) {
                  return 'child-row';
                }
                if (params.row.isParent) {
                  const currentName = params.row.name;
                  const parentRows = rows.filter(r => r.isParent);
                  const rowIndex = parentRows.findIndex(r => r.id === params.id);
                  const prevRow = rowIndex > 0 ? parentRows[rowIndex - 1] : null;
                  const isNewGroup = !prevRow || prevRow.name !== currentName;
                  
                  const nextRow = rowIndex < parentRows.length - 1 ? parentRows[rowIndex + 1] : null;
                  const isInGroup = nextRow && nextRow.name === currentName;
                  
                  if (isNewGroup && isInGroup) {
                    return 'name-group-header';
                  } else if (isInGroup) {
                    return 'name-group-item';
                  } else if (isNewGroup) {
                    return 'name-group-single';
                  }
                }
                return '';
              }}
              sx={{
                '& .MuiDataGrid-cell': {
                  fontSize: '0.875rem',
                },
                '& .MuiDataGrid-columnHeader': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                },
                '& .name-group-header': {
                  borderTop: '2px solid #1976d2',
                  backgroundColor: '#e3f2fd',
                  fontWeight: 500,
                },
                '& .name-group-item': {
                  backgroundColor: '#f5f5f5',
                },
                '& .name-group-single': {
                  borderTop: '1px solid #e0e0e0',
                },
                '& .child-row': {
                  backgroundColor: '#fafafa',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                },
                '& .factor-row': {
                  backgroundColor: '#f5f5f5',
                  '&:hover': {
                    backgroundColor: '#eeeeee',
                  },
                },
                '& .detail-row': {
                  backgroundColor: '#fafafa',
                  borderLeft: '3px solid #90caf9',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                  // Ensure detail cells wrap and can expand vertically
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    padding: '12px 16px',
                    whiteSpace: 'normal',
                    overflow: 'visible',
                  },
                  '& .detail-cell': {
                    width: '100%',
                    maxWidth: 'none',
                    minWidth: 0,
                  },
                },
                '& .MuiDataGrid-row:hover:not(.child-row):not(.factor-row):not(.detail-row)': {
                  backgroundColor: '#e8f4f8',
                },
              }}
            />
          </Paper>
        )}

        {/* Empty State */}
        {!loading && !error && (!data || !data.results || data.results.length === 0) && (
          <Alert severity="info">
            No data available. Please check your filters or try refreshing.
          </Alert>
        )}
      </Stack>
    </Box>
  );
}
