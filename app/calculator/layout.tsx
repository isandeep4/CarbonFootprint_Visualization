"use client"
import { Box, LinearProgress, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCalculator } from "../contexts/CalculatorContext";

export default function CalculatorLayout({children}: {children: React.ReactNode, contextValue: number}){
    const [activeTabIndex, setActiveTabIndex] = useState(null);
    const pathName = usePathname();
    const tabList = ["food", "travel", "home", "shopping"];

    useEffect(()=>{
        const currentTab = tabList.findIndex(tab => pathName.includes(tab));
        setActiveTabIndex(currentTab);
    }, [pathName]);
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
                        </li>
                        ))
                    }
                </ul>                
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