import Box from "@mui/material/Box";

export default function SideNav(){
    return (
        <Box className="w-48 shadow-md">
            <nav>
            <ul>
                <li><a href={`/dashboard`}>Dashboard</a></li>
                <li>Calculator</li>
                <li>Profile</li>
                <li>Setting</li>
            </ul>
            </nav>
        </Box>
    )
}