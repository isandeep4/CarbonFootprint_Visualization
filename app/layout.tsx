import React from "react"
import './globals.css'
import { NextAppProvider } from "@toolpad/core/nextjs/NextAppProvider"
import DashboardIcon from '@mui/icons-material/Dashboard';
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import BarChartIcon from '@mui/icons-material/BarChart';
import CalculateIcon from '@mui/icons-material/Calculate';


export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en" data-toolpad-color-scheme="light">
        <body>
          <NextAppProvider
            navigation={[
              {
                segment: 'dashboard',
                title: 'Dashboard',
                icon: <DashboardIcon />,
              },
              {
                segment: 'calculator',
                title: 'calculator',
                icon: <CalculateIcon />,
                pattern: 'orders{/:orderId}*',
              },
              {
                segment: 'reports',
                title: 'Reports',
                icon: <BarChartIcon />,
              },
            ]}
          >
            <DashboardLayout>{children}</DashboardLayout>
          </NextAppProvider>
        </body>
      </html>
    )
  }