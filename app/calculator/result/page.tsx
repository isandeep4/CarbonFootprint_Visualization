"use client"
import { Box, Button, Paper, Typography, styled } from "@mui/material";
import Grid from '@mui/material/Grid2';

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

async function fetchFootprint() {
    const res = await fetch(
      "https://bsitydv6m5.execute-api.us-east-1.amazonaws.com/carbon-footprint-insights?user_id=isandeep",
      { cache: 'no-store' }
    );
    const data = res.json();
    console.log('API response:', data); 
    return data
  }

const Result = () => {
    const footprint = fetchFootprint();
    return (
        <Box>
            <Grid
            container
            direction="row"
            sx={{
             justifyContent: "flex-start",
             alignItems: "baseline",
            }}
            spacing={12}
            >
            <Grid size={{ xs: 6, md: 8 }}>
                <Item>
                <Box
                id="category-a"
                sx={{ fontSize: '5px' }}
                >
                    <Typography variant="h5">Oh no! You're over target.</Typography>
                    <Typography>
                    <p>
                        Your annual footprint is above the UK target. However, 
                        there is still time to reduce your impact. 
                        Explore your breakdown below for ideas on how to make a difference.    
                    </p>
                    </Typography>
                    <Typography variant="h5">our footprint is equal to 12.8 Tonnes*.</Typography>
                    <Button>
                        <Typography>SHARE</Typography>
                    </Button>
                </Box>
                </Item>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
                <Item>size=4</Item>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
                <Item>size=4</Item>
            </Grid>
            <Grid size={{ xs: 6, md: 8 }}>
                <Item>size=8</Item>
            </Grid>  
            </Grid>
        </Box>
    )
}