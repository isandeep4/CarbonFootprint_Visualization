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
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  unit?: string;
  unit_type?: string;
  factor?: number | null;
  scopes?: string[];
  access_type?: string;
  data_quality_flags?: string[];
  description?: string;
}

interface FactorsResponse {
  results: FactorResult[];
  total_results?: number;
}

interface ActivityData {
  activity_id: string;
  name: string;
  category?: string;
  sector?: string;
  region?: string;
  unit?: string;
  unit_type?: string;
  year?: string;
  source?: string;
  total_emission_factors?: number;
}

export default function ActivityPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = decodeURIComponent(params.id as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [factors, setFactors] = useState<FactorResult[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch activity data and factors
        const params = new URLSearchParams({
          activity_id: activityId,
          data_version: encodeURIComponent('^28'),
        });

        const response = await fetch(`/api/climatiq/factors?${params}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch activity data: ${response.status}`);
        }

        const data: FactorsResponse = await response.json();
        
        if (data.results && data.results.length > 0) {
          const firstFactor = data.results[0];
          
          // Build activity summary from first factor
          const summary: ActivityData = {
            activity_id: activityId,
            name: firstFactor.name || 'N/A',
            category: firstFactor.category || 'N/A',
            sector: firstFactor.sector || 'N/A',
            region: firstFactor.region_name || 'N/A',
            unit: firstFactor.unit || 'N/A',
            unit_type: firstFactor.unit_type || 'N/A',
            year: firstFactor.year?.toString() || 'N/A',
            source: firstFactor.source || 'N/A',
            total_emission_factors: data.results.length,
          };

          setActivityData(summary);
          setFactors(data.results);
        } else {
          setError('No data found for this activity');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (activityId) {
      fetchData();
    }
  }, [activityId]);

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
          <Typography variant="h4">Activity Details</Typography>
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

        {/* Activity Summary Section */}
        {activityData && !loading && (
          <Stack spacing={3}>
            {/* Summary Card */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Activity Summary
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Activity ID
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-word', fontWeight: 500 }}>
                    {activityData.activity_id}
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">{activityData.name}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1">{activityData.category}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Sector
                      </Typography>
                      <Typography variant="body1">{activityData.sector}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Region
                      </Typography>
                      <Typography variant="body1">{activityData.region}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Unit
                      </Typography>
                      <Typography variant="body1">{activityData.unit}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Unit Type
                      </Typography>
                      <Typography variant="body1">{activityData.unit_type}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Year
                      </Typography>
                      <Typography variant="body1">{activityData.year}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Source
                      </Typography>
                      <Typography variant="body1">{activityData.source}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>

            {/* Emission Factors Section */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Emission Factors ({factors.length})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Factor</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Region</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Year</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {factors.map((factor) => (
                      <TableRow key={factor.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {factor.name || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{factor.unit_type || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{factor.region_name || factor.region || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{factor.year || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{factor.source || 'N/A'}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
