import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {Analytics} from '@vercel/analytics/react'

const MyApp: AppType = ({ Component, pageProps }) => {
  const queryClient = new QueryClient({  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },})
  return (
  <QueryClientProvider client={queryClient}><Component {...pageProps} /><Analytics/></QueryClientProvider>
)}


export default MyApp;
