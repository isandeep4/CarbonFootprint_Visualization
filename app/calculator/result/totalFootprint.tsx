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
    return (
        <><Grid
            container
            direction="row"
            spacing={4}
        >
            <Grid size={{ xs: 4, md: 6 }} container direction="column">
                <Grid size={12}>
                    <Item sx={{ fontSize: '5px', padding: "16px", height: "40rem", bgcolor: "#74c050" }}>
                        <Typography variant="h5" sx={{ zIndex: "1", fontWeight: "bold", padding: "0.5rem", color: "red" }}>
                            Oh no! You're over target.
                        </Typography>
                        <Typography variant="body1" sx={{ zIndex: "1", color: "black", fontWeight: "bold", margin: "2rem" }}>
                            Your annual footprint is above the India target. However,
                            there is still time to reduce your impact.
                            Explore your breakdown below for ideas on how to make a difference.
                        </Typography>
                        <Box position={'relative'} display={'flex'} justifyContent={'center'}>
                            <Image src={'/images/footprint.svg'} alt={'footprint image'} style={{ position: "absolute",  zIndex: 1, opacity: 0.5  }} width="400" height="500"/>
                        </Box>
                        <Typography variant="h4" sx={{ color: "black", zIndex: "999" }}>Your footprint is equal to</Typography>
                        <Typography variant="h3" sx={{ color: "black", zIndex: "999", marginBottom: "2rem" }}>{parseFloat(data.total_emissions.toFixed(2))}kg</Typography>
                        <Button sx={{ bgcolor: "black",  zIndex: "2" }}>
                            <Typography>SHARE</Typography>
                        </Button>
                    </Item>
                </Grid> 
            </Grid>
            <Grid container direction="column" size={{ xs: 4, md: 6 }} spacing={4}>
                <Grid size={{ xs: 6, md: 12 }} direction="row" container spacing={0}>
                    <Grid size={{ xs: 6, md: 2 }} sx={{bgcolor: "black"}}>  
                        <Item sx={{ bgcolor: "black", color: "white" }}>
                            <Image src={'/images/india.svg'} alt={'india image'} width="100" height="600"/>
                        </Item>
                    </Grid>
                    <Grid size={{ xs: 6, md: 8}}>
                        <Item sx={{ bgcolor: "black", color: "white" }}>
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ color: "red" }}>India average footprint for 2025*</Typography>
                            <Typography variant="h4" gutterBottom>{data?.regional_emission} kg</Typography>
                            <Typography variant="body1" gutterBottom>* assuming the India per capita footprint follows the same trajectory as the UK Climate Change Committee Balanced Net Zero Pathway</Typography>
                        </Box>
                    </Item>
                    </Grid>
                </Grid> 
                <Grid size={{ xs: 6, md: 12 }} direction="row" container spacing={0}>
                    <Grid size={{ xs: 6, md: 2 }} sx={{bgcolor: "black"}}>  
                        <Item sx={{ bgcolor: "black", color: "white" }}>
                            <Image src={'/images/person_pin_circle.svg'} alt={'india image'} width="100" height="600"/>
                        </Item>
                    </Grid>
                    <Grid size={{ xs: 6, md: 8}}>
                        <Item sx={{ bgcolor: "black", color: "white" }}>
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ color: "red" }}>
                                    Your Footprint Is
                                </Typography>
                                <Typography variant="h4" gutterBottom>
                                    { Math.round(Math.abs((data as any)?.difference_percentage))}% {`${data?.difference_percentage < 0 ? " above " : " below "}`}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Of the India average for 2025
                                </Typography>
                            </Box>
                        </Item>
                    </Grid>
                </Grid>
                <Grid size={{ xs: 6, md: 12 }} direction="row" container spacing={0}>
                <Grid size={{ xs: 6, md: 12 }} direction="row" container spacing={0}>
                    <Grid size={{ xs: 6, md: 2 }} sx={{bgcolor: "black"}}>  
                        <Item sx={{ bgcolor: "black", color: "white" }}>
                            <Image src={'/images/globe-asia.svg'} alt={'india image'} width="100" height="600"/>
                        </Item>
                    </Grid>
                    <Grid size={{ xs: 6, md: 8}}>
                        <Item sx={{ bgcolor: "black", color: "white" }}>
                            <Box>
                                <Typography sx={{ color: "red" }} variant="h6" gutterBottom> World average </Typography>
                                <Typography variant="h4" gutterBottom> {data?.global_emission} Kg </Typography>
                            </Box>
                        </Item>
                    </Grid>
                </Grid>
             </Grid>
            </Grid>
        </Grid>
        <Breakdown 
            home={data.home}
            transport={data.transport}
            food={data.food} 
            shopping={data.shopping}
            total={data.total_emissions}
        />
        </>
    )
}