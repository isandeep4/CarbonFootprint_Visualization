"use client"
import Grid from '@mui/material/Grid2';
import Box from "@mui/material/Box";
import { Item } from "../totalFootprint";
import Image from 'next/image';
import { Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { Tips } from './helper';

const Tip = () => {
    const params = useParams();
    const tipPage = params?.tipPage as string;

    return (
        <Box width={"100%"}>
            <h1>Tips for home</h1>
            {
                Tips[tipPage].map((tip, index) => (
                <Grid container alignItems="stretch" rowGap={2}>
                    <Grid size={6} height={"400px"} sx={{ order: index % 2 === 0 ? 1 : 2 }}>
                        <Item sx={{ height: '100%', position: 'relative'}}>
                            <Image src={`${tip.image}`} alt={`${tip.imageName}`} fill />
                        </Item>
                    </Grid>
                    <Grid size={6} height={"400px"} sx={{ order: index % 2 === 0 ? 2 : 1}}>
                        <Item sx={{ height: "100%", alignContent: "center"}}>
                            <Typography variant="h6">{tip.title}</Typography>
                            <Typography>{tip.description}</Typography>
                        </Item>
                    </Grid>
            </Grid>
                ))
            }
        </Box>
    )
}
export default Tip;