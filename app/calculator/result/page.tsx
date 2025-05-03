import { Box } from "@mui/material";
import { TotalFootprint } from "./totalFootprint";
import { Suspense } from "react";

async function fetchFootprint() {
    const res = await fetch(
      "https://f4n690ljh0.execute-api.us-east-1.amazonaws.com/carbon-footprint-insights?user_id=c8efc7bd-b8de-4b9e-90fb-b084e6b10976"
    );
    return res.json();
  }

const Result = () => {
    const footprint = fetchFootprint();
    return (
        <Box>
            <Suspense fallback={<p>waiting for message...</p>}>
                <TotalFootprint footprint={footprint} />
            </Suspense>
        </Box>
    )
}
export default Result;