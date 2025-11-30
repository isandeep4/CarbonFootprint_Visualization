'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ConstituentGases {
  co2e_total?: number | null;
  co2e_other?: number | null;
  co2?: number | null;
  ch4?: number | null;
  n2o?: number | null;
}

interface EmissionFactorData {
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
  year_released?: string;
}

export default function EmissionFactorPage() {
  const params = useParams();
  const router = useRouter();
  const factorId = decodeURIComponent(params.id as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [factorData, setFactorData] = useState<EmissionFactorData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try to fetch from localStorage first (passed from dashboard)
        const storedData = sessionStorage.getItem(`factor-${factorId}`);
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setFactorData(parsed);
          setLoading(false);
          return;
        }

        // Fallback: This is a detail page that receives data from dashboard navigation
        // The factor data is passed via sessionStorage from the dashboard
        setError('Factor data not available. Please navigate from the dashboard.');
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
      }
    };

    if (factorId) {
      fetchData();
    }
  }, [factorId]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: 3, bgcolor: '#f5f5f5' }}>
      <Stack spacing={3}>
        {/* Header with Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            variant="outlined"
          >
            Back
          </Button>
          <Typography variant="h4">Emission Factor Details</Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert severity="error">
            <Typography variant="subtitle2" fontWeight={600}>
              Error
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          </Alert>
        )}

        {/* Emission Factor Summary Section */}
        {factorData && !loading && (
          <Stack spacing={3}>
            {/* Summary Card */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Factor Summary
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Factor ID
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-word', fontWeight: 500 }}>
                    {factorData.id}
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">{factorData.name || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1">{factorData.category || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Sector
                      </Typography>
                      <Typography variant="body1">{factorData.sector || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Region
                      </Typography>
                      <Typography variant="body1">{factorData.region_name || factorData.region || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Unit
                      </Typography>
                      <Typography variant="body1">{factorData.unit || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Unit Type
                      </Typography>
                      <Typography variant="body1">{factorData.unit_type || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Year
                      </Typography>
                      <Typography variant="body1">{factorData.year || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Source
                      </Typography>
                      <Typography variant="body1">{factorData.source || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Emission Factor
                      </Typography>
                      <Typography variant="body1">{factorData.factor !== null ? factorData.factor : 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Access Type
                      </Typography>
                      <Typography variant="body1">{factorData.access_type || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  {factorData.uncertainty !== null && factorData.uncertainty !== undefined && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Uncertainty
                        </Typography>
                        <Typography variant="body1">{factorData.uncertainty}</Typography>
                      </Box>
                    </Grid>
                  )}
                  {factorData.scopes && factorData.scopes.length > 0 && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Scopes
                        </Typography>
                        <Typography variant="body1">{factorData.scopes.join(', ')}</Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            </Paper>

            {/* Additional Details */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Additional Information
              </Typography>
              <Stack spacing={2}>
                {factorData.description && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body2">{factorData.description}</Typography>
                  </Box>
                )}
                {factorData.source_dataset && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Source Dataset
                    </Typography>
                    <Typography variant="body2">{factorData.source_dataset}</Typography>
                  </Box>
                )}
                {factorData.source_lca_activity && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Source LCA Activity
                    </Typography>
                    <Typography variant="body2">{factorData.source_lca_activity}</Typography>
                  </Box>
                )}
                {factorData.source_link && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Source Link
                    </Typography>
                    <Typography
                      component="a"
                      href={factorData.source_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{ color: 'primary.main', cursor: 'pointer' }}
                    >
                      {factorData.source_link}
                    </Typography>
                  </Box>
                )}
                {factorData.data_quality_flags && factorData.data_quality_flags.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Data Quality Flags
                    </Typography>
                    <Typography variant="body2">{factorData.data_quality_flags.join(', ')}</Typography>
                  </Box>
                )}
                {factorData.supported_calculation_methods && factorData.supported_calculation_methods.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Supported Calculation Methods
                    </Typography>
                    <Typography variant="body2">{factorData.supported_calculation_methods.join(', ')}</Typography>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* Constituent Gases */}
            {factorData.constituent_gases && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Constituent Gases
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Gas</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                          Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(factorData.constituent_gases).map(([key, value]) => (
                        <TableRow key={key} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {key.replace(/_/g, ' ').toUpperCase()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{value !== null ? value : 'N/A'}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
