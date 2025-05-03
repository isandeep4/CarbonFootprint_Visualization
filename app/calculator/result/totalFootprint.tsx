"use client"
import Grid from '@mui/material/Grid2';
import Image from 'next/image'
import HomeIcon from '@mui/icons-material/Home';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { Box, Button, Paper, Typography, styled } from "@mui/material";
import { FC, use } from 'react';

const Item = styled(Paper)(({ theme }) => ({
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
    console.log("data", data.total_emission);
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
                            <Typography variant="h4" gutterBottom>8.4 TONNES</Typography>
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
                                127%
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
                            <Typography variant="h4" gutterBottom> 6.3 TONNES </Typography>
                        </Box>
                    </Item>
                </Grid>
            </Grid>
        </Grid><Grid container direction="column" spacing={4}>
                <Box>
                    <Typography variant="h4">Lets Break It Down</Typography>
                    <Typography variant="h5">YOUR FOOTPRINT IS EQUAL TO 10.7T</Typography>
                    <Typography>YOUR BREAKDOWN EXPLAINED</Typography>
                </Box>
                <Grid container direction="row"
                    sx={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Grid container direction="row" size={{ xs: 6, md: 6 }} spacing={0}>
                        <Grid size={{ xs: 6, md: 4 }}>
                            <Item sx={{ bgcolor: "#0094d5" }}>
                                <Box sx={{ padding: "2.6rem" }}>
                                    <HomeIcon />
                                    <Typography>21%</Typography>
                                </Box>
                            </Item>
                        </Grid>
                        <Grid size={{ xs: 6, md: 8 }}>
                            <Item>
                                <Box>
                                    <Typography>Home</Typography>
                                    <Typography>Your consumption is equal to 2 tonnes</Typography>
                                    <Typography>This is roughly the same weight as 2 Polar Bears</Typography>
                                    <Button>Reduce this score</Button>
                                </Box>
                            </Item>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" size={{ xs: 6, md: 6 }} spacing={0}>
                        <Grid size={{ xs: 4, md: 4 }}>
                            <Item sx={{ bgcolor: "#00b9ad" }}>
                                <Box sx={{ padding: "2.6rem" }}>
                                    <RamenDiningIcon />
                                    <Typography>10%</Typography>
                                </Box>
                            </Item>
                        </Grid>
                        <Grid size={{ xs: 8, md: 8 }}>
                            <Item>
                                <Box>
                                    <Typography>FOOD</Typography>
                                    <Typography>Your consumption is less than 1 tonne</Typography>
                                    <Typography>This is roughly the same weight as 3 Amur Tigers</Typography>
                                    <Button>Reduce this score</Button>
                                </Box>
                            </Item>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container direction="row"
                    sx={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Grid container direction="row" size={{ xs: 6, md: 6 }} spacing={0}>
                        <Grid size={{ xs: 4, md: 4 }}>
                            <Item sx={{ bgcolor: "#f89834" }}>
                                <Box sx={{ padding: "2.6rem" }}>
                                    <LocalAirportIcon />
                                    <Typography>56%</Typography>
                                </Box>
                            </Item>
                        </Grid>
                        <Grid size={{ xs: 8, md: 8 }}>
                            <Item>
                                <Box>
                                    <Typography>TRAVEL</Typography>
                                    <Typography>Your consumption is less than 5 tonne</Typography>
                                    <Typography>This is roughly the same weight as 37 Giant Pandas</Typography>
                                    <Button>Reduce this score</Button>
                                </Box>
                            </Item>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" size={{ xs: 6, md: 6 }} spacing={0}>
                        <Grid size={{ xs: 6, md: 4 }}>
                            <Item sx={{ bgcolor: "#d04092" }}>
                                <Box sx={{ padding: "2.6rem" }}>
                                    <ShoppingBasketIcon />
                                    <Typography>13%</Typography>
                                </Box>
                            </Item>
                        </Grid>
                        <Grid size={{ xs: 6, md: 8 }}>
                            <Item>
                                <Box>
                                    <Typography>SHOPPING</Typography>
                                    <Typography>Your consumption is less than 1 tonne</Typography>
                                    <Typography>This is roughly the same weight as 5 mountain gorilla</Typography>
                                    <Button>Reduce this score</Button>
                                </Box>
                            </Item>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid></>
    )
}