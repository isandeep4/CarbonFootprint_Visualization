"use client"
import { Box, LinearProgress, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CalculatorLayout({children}: {children: React.ReactNode}){
    const [activeTabIndex, setActiveTabIndex] = useState(null);
    const pathName = usePathname();
    const tabList = ["food", "travel", "home", "shopping"];

    useEffect(()=>{
        const currentTab = tabList.findIndex(tab => pathName.includes(tab));
        setActiveTabIndex(currentTab);
    }, [pathName])
    return (
        <Box sx={{ height: "100%", bgcolor: 'hsla(215, 15%, 97%, 0.5);'}}>
            <nav>
            <Box sx={{ margin: "2rem", bgcolor: "rgb(255, 255, 255)"}}>
                <ul style={{ display: "flex", gap: "2rem", justifyContent: "center"}}>
                    {
                        tabList.map((tab, index) =>(
                        <li 
                        style={{ 
                        flexBasis: "15%", 
                        backgroundColor: activeTabIndex === index ? "#1976d2": "white",
                        }} 
                        key={index} 
                        onClick={()=> setActiveTabIndex(index)}
                        >
                        <Link href={`/calculator/${tab}`}>
                        <Button sx={{ width: "100%", padding: "1rem", color: activeTabIndex === index ? "white": "#1976d2" }}>
                            {tab}
                        </Button>
                        </Link>
                        <LinearProgress variant="determinate" value={0} />
                        </li>
                        ))
                    }
                </ul>                
            {/* <List sx={{display: "flex"}}>
            <ListItem sx={{ display: "flex"}}>
                <ListItemButton component="a" href="/calculator/food">
                    <ListItemText primary="Food" />
                </ListItemButton>
                <LinearProgress variant="determinate" value={20} />
            </ListItem>
            <ListItem>
                <ListItemButton component="a" href="/calculator/travel">
                    <ListItemText primary="Travel" />
                    <LinearProgress variant="determinate" value={20} />
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton component="a" href="/calculator/home">
                    <ListItemText primary="Home" />
                    <LinearProgress variant="determinate" value={20} />
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton component="a" href="/calculator/shopping">
                    <ListItemText primary="Shopping" />
                    <LinearProgress variant="determinate" value={20} />
                </ListItemButton>
            </ListItem>
            </List> */}
            </Box>
            </nav> 
            <Box 
            sx={{ 
                display: "flex", 
                flexDirection: "row", 
                justifyContent: "center", 
                margin: "2rem",
            }}
            >
            {children}
            </Box>
        </Box>
    )
}