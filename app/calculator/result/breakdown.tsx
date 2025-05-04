"use client"
import { Box, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Item } from './totalFootprint';
import HomeIcon from '@mui/icons-material/Home';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

const Cards = [
{
    id: 1,
    title: "HOME",
    subTitle1: "Your consumption is equal to 2 tonnes",
    subTitle2: "This is roughly the same weight as 2 Polar Bears",
    buttonText: "REDUCE THIS SCORE",
    consumption: "21%",
    bgcolor: "#0094d5",
    iconElement: <HomeIcon />
},
{
    id: 2,
    title: "FOOD",
    subTitle1: "Your consumption is equal to 1 tonnes",
    subTitle2: "This is roughly the same weight as 3 Amur Tigers",
    buttonText: "REDUCE THIS SCORE",
    consumption: "21%",
    bgcolor: "#f89834",
    iconElement: <RamenDiningIcon />
},
{
    id: 3,
    title: "TRAVEL",
    subTitle1: "Your consumption is less than 5 tonne",
    subTitle2: "This is roughly the same weight as 37 Giant Pandas",
    buttonText: "REDUCE THIS SCORE",
    consumption: "21%",
    bgcolor: "#00b9ad",
    iconElement: <LocalAirportIcon />
},
{
    id: 4,
    title: "SHOPPING",
    subTitle1: "Your consumption is less than 1 tonne",
    subTitle2: "This is roughly the same weight as 5 mountain gorilla",
    buttonText: "REDUCE THIS SCORE",
    consumption: "21%",
    bgcolor: "#d04092",
    iconElement: <ShoppingBasketIcon />
}
]

export const Breakdown = () => {
    return (
        <Grid container direction="column" spacing={4} padding={4} mt={4}>
            <Box>
                <Typography variant="h4">Lets Break It Down</Typography>
                <Typography variant="h5">YOUR FOOTPRINT IS EQUAL TO 10.7T</Typography>
                <Typography>YOUR BREAKDOWN EXPLAINED</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                justifyContent: "space-between"
              }}        
            >
            {Cards.map((card) => (
                <Grid 
                  sx={{
                    flexBasis: "40%",
                    display: "flex",
                  }}
                  key={card.id}
                >
                    <Grid size={{ xs: 6, md: 4 }}>
                    <Item sx={{ bgcolor: card.bgcolor }}>
                        <Box sx={{ padding: "2.6rem" }}>
                            {card.iconElement}
                            <Typography>{card.consumption}</Typography>
                        </Box>
                    </Item>
                </Grid>
                <Grid size={{ xs: 6, md: 8 }}>
                    <Item>
                        <Box>
                            <Typography>{card.title}</Typography>
                            <Typography>{card.subTitle1}</Typography>
                            <Typography>{card.subTitle2}</Typography>
                            <Button>{card.buttonText}</Button>
                        </Box>
                    </Item>
                </Grid>
                </Grid>
            ))

            }
            </Box>
        </Grid>
    )
}