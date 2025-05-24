"use client"
import { Box, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Item } from './totalFootprint';
import HomeIcon from '@mui/icons-material/Home';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { FC } from 'react';
import { redirect } from 'next/navigation';

const Cards = [
{
    id: 1,
    field: "home",
    title: "HOME",
    subTitle1: "Your consumption is equal to 2 tonnes",
    subTitle2: "This is roughly the same weight as 2 Polar Bears",
    buttonText: "REDUCE THIS SCORE",
    bgcolor: "#0094d5",
    iconElement: <HomeIcon />,
    subRoute: "home"
},
{
    id: 2,
    field: "food",
    title: "FOOD",
    subTitle1: "Your consumption is equal to 1 tonnes",
    subTitle2: "This is roughly the same weight as 3 Amur Tigers",
    buttonText: "REDUCE THIS SCORE",
    bgcolor: "#f89834",
    iconElement: <RamenDiningIcon />,
    subRoute: "food"
},
{
    id: 3,
    field: "transport",
    title: "TRAVEL",
    subTitle1: "Your consumption is less than 5 tonne",
    subTitle2: "This is roughly the same weight as 37 Giant Pandas",
    buttonText: "REDUCE THIS SCORE",
    bgcolor: "#00b9ad",
    iconElement: <LocalAirportIcon />,
    subRoute: "transport"
},
{
    id: 4,
    field: "shopping",
    title: "SHOPPING",
    subTitle1: "Your consumption is less than 1 tonne",
    subTitle2: "This is roughly the same weight as 5 mountain gorilla",
    buttonText: "REDUCE THIS SCORE",
    bgcolor: "#d04092",
    iconElement: <ShoppingBasketIcon />,
    subRoute: "shopping"
}
];

export const Breakdown: FC<
{
    home: number,
    transport: number,
    food: number,
    shopping: number,
    total: number
}> = (props) => {
    return (
        <Grid container direction="column" spacing={4} padding={4} mt={4}>
            <Box>
                <Typography variant="h4">Lets Break It Down</Typography>
                <Typography variant="h6">{`YOUR FOOTPRINT IS EQUAL TO ${props.total}`}</Typography>
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
                            <Typography>{ Math.round((props[card.field] / props.total) * 100)}%</Typography>
                        </Box>
                    </Item>
                </Grid>
                <Grid size={{ xs: 6, md: 8 }}>
                    <Item>
                        <Box>
                            <Typography>{card.title}</Typography>
                            <Typography>{`Your consumption is equal to ${Math.round(props[card.field])} Kg`}</Typography>
                            <Typography>{card.subTitle2}</Typography>
                            <Button 
                              onClick={() => redirect(`result/${card.subRoute}`)}
                            >
                            {card.buttonText}
                            </Button>
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