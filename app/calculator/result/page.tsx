import { Box, Typography } from "@mui/material";
import React from "react";

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
            <Typography>Your Carbon Footprint is: </Typography>
        </Box>
    )
}