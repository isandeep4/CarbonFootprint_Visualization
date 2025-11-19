"use client"
import React, { Suspense } from "react"
import './globals.css'
import { NextAppProvider } from "@toolpad/core/nextjs/NextAppProvider"
import DashboardIcon from '@mui/icons-material/Dashboard';
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import BarChartIcon from '@mui/icons-material/BarChart';
import CalculateIcon from '@mui/icons-material/Calculate';
import {
  AppProvider,
  type Session,
  type Navigation,
} from '@toolpad/core/AppProvider';
import CalculatorProvider from "./contexts/CalculatorContext";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
})


export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const [session, setSession] = React.useState<Session | null>({
      user: {
        name: 'Sandeep Kumar Sahoo',
        id: "isandeep",
        email: 'isandeepsahoo5@gmail.com',
        image: 'https://avatars.githubusercontent.com/u/19550456',
      },
    });
    const authentication = React.useMemo(() => {
      return {
        signIn: () => {
          setSession({
            user: {
              name: 'Sandeep Kumar Sahoo',
              id: "isandeep",
              email: 'isandeepsahoo5@gmail.com',
              image: 'https://avatars.githubusercontent.com/u/19550456',
            },
          });
        },
        signOut: () => {
          setSession(null);
        },
      };
    }, []);
    
    return (
      <html lang="en" data-toolpad-color-scheme="light">
        <body>
          <Suspense fallback={<div>...Loading</div>}>
          <NextAppProvider
            session={session}
            authentication={authentication}
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
            branding={{
              logo: <img src="https://mui.com/static/logo.png" alt="CARBON FOOTPRINT TRACKER" />,
              title: 'CARBON FOOTPRINT TRACKER',
            }}
          >
            <ApolloProvider client={client}>
              <DashboardLayout>
              <CalculatorProvider>
                {children}
              </CalculatorProvider>
              </DashboardLayout>
            </ApolloProvider>
          </NextAppProvider>
          </Suspense>
        </body>
      </html>
    )
  }