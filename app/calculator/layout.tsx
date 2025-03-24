"use client"
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CalculatorLayout({children}: {children: React.ReactNode, contextValue: number}){
    const [activeTabIndex, setActiveTabIndex] = useState(null);
    const pathName = usePathname();
    const tabList = [{label: "FOOD", value: "foodQuestionnaire"}, {label: "TRAVEL", value: "travelQuestionnaire"}, {label: "HOME", value: "homeQuestionnaire"}, {label: "SHOPPING", value: "shoppingQuestionnaire"}];

    useEffect(()=>{
        const currentTab = tabList.findIndex(tab => pathName.includes(tab.value));
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
                <Link href={`/calculator/${tab.value}`}>
                <Button 
                    sx={{ 
                    width: "100%", 
                    padding: "1rem", 
                    color: activeTabIndex === index ? "white": "#1976d2" 
                    }}
                >
                {tab.label}
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