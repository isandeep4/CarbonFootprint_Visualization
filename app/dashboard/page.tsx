"use client"
import { Box, Card, CardContent, Typography } from "@mui/material";
import { LineChart, PieChart } from '@mui/x-charts';
import { useEffect, useState } from "react";
import { colors, keyToLabel, mockMonthlyData } from "../utils/mockMonthlyData";

type EmissionData = {
    "month": string,
    "food": number,
    "transport": number,
    "energy": number
}

export default function Dashboard(){
    const [emissionDataCategorically, setEmissionDataCategorically] = useState<EmissionData[]>([]);
    useEffect(()=>{
        const emissionData = mockMonthlyData.map((monthlyData) => ({
            month: monthlyData.month,
            food: monthlyData.food,
            transport: monthlyData.transport,
            energy: monthlyData.energy
        }))
        setEmissionDataCategorically(emissionData);
    }, []);
    return(
        <Box>
            <Box className="m-2">
                <Typography variant="h4" margin={2}>
                    Your Footprint: 120 kg CO₂ 
                </Typography>
                <Box sx={{
                    margin: "2rem",
                    display: "flex",
                    gap: "2rem"
                }}>
                {/* Emissions Over Time */}
                <Card>
                <Typography sx={{ padding: "1rem"}}>Emissions Over Time:</Typography>
                    <CardContent>
                    <PieChart
                        series={[
                            {
                            data: [
                                { id: 0, value: 10, label: 'Transport' },
                                { id: 1, value: 15, label: 'Food' },
                                { id: 2, value: 20, label: 'Energy' },
                            ],
                            },
                        ]}
                        width={400}
                        height={200}
                    />
                    </CardContent>
                </Card>
                    {/* emission breakdown */}
                <Card>
                <Typography sx={{ padding: "1rem"}}>Emission Breakdown:</Typography>
                    <CardContent>
                    <LineChart
                        xAxis={[
                            {
                                scaleType: "band",
                                data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                            }
                        ]}
                        series={Object.keys(keyToLabel).map(key => ({
                            dataKey: key,
                            label: keyToLabel[key],
                            color: colors[key]
                        }))}
                        dataset={emissionDataCategorically}
                        height= {300}
                        width={800}
                    />
                    </CardContent>
                </Card>
                </Box>
            </Box>
        </Box>
    )
}