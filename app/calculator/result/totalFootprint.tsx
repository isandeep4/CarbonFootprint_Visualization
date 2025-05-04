"use client"
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { Box, Button, Paper, Typography, styled } from "@mui/material";
import { FC, use } from 'react';
import { Breakdown } from './breakdown';

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

export const TotalFootprint: FC<{footprint: Promise<any>}> = ({footprint}) => {
    const data = use(footprint);
    console.log("data", data);
    return (
        <><Grid
            container
            direction="row"
            sx={{
                justifyContent: "flex-start",
                alignItems: "baseline",
            }}
            spacing={4}
        >
            <Grid size={{ xs: 4, md: 6 }}>
                <Item sx={{ fontSize: '5px', position: 'relative', padding: "16px", display: 'flex', flexDirection: "column", height: "580px" }}>
                    <Image src={'/images/footprint-image.jpg'} alt={'footprint image'} fill style={{ objectFit: 'cover' }} />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }} />
                    <Typography variant="h5" sx={{ zIndex: "1", fontWeight: "bold", padding: "0.5rem", color: "red" }}>Oh no! You're over target.</Typography>
                    <Typography variant="body1" sx={{ zIndex: "1", color: "black", fontWeight: "bold", margin: "2rem" }}>
                        Your annual footprint is above the India target. However,
                        there is still time to reduce your impact.
                        Explore your breakdown below for ideas on how to make a difference.
                    </Typography>
                    <Typography variant="h4" sx={{ color: "black", zIndex: "1" }}>Your footprint is equal to</Typography>
                    <Typography variant="h3" sx={{ color: "black", zIndex: "1", marginBottom: "2rem" }}>{data.total_emissions}</Typography>
                    <Button sx={{ bgcolor: "black" }}>
                        <Typography>SHARE</Typography>
                    </Button>
                </Item>
            </Grid>
            <Grid container direction="column" size={{ xs: 4, md: 6 }} spacing={4}>
                <Grid size={{ xs: 6, md: 10 }}>
                    <Item sx={{ bgcolor: "black", color: "white" }}>
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ color: "red" }}>India average footprint for 2025*</Typography>
                            <Typography variant="h4" gutterBottom>{data?.regional_emission} kg</Typography>
                            <Typography variant="body1" gutterBottom>* assuming the India per capita footprint follows the same trajectory as the UK Climate Change Committee Balanced Net Zero Pathway</Typography>
                        </Box>
                    </Item>
                </Grid>
                <Grid size={{ xs: 6, md: 10 }}>
                    <Item sx={{ bgcolor: "black", color: "white" }}>
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ color: "red" }}>
                                Your Footprint Is
                            </Typography>
                            <Typography variant="h4" gutterBottom>
                                { Math.abs((data as any)?.difference_percentage)}% {`${data?.difference_percentage < 0 ? " above " : " below "}`}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Of the India average for 2025
                            </Typography>
                        </Box>
                    </Item>
                </Grid>
                <Grid size={{ xs: 6, md: 10 }}>
                    <Item sx={{ bgcolor: "black", color: "white" }}>
                        <Box>
                            <Typography sx={{ color: "red" }} variant="h6" gutterBottom> World average </Typography>
                            <Typography variant="h4" gutterBottom> {data?.global_emission} Kg </Typography>
                        </Box>
                    </Item>
                </Grid>
            </Grid>
        </Grid>
        <Breakdown />
        </>
    )
}