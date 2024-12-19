"use client";

import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Modal from "react-modal";
import Footer from '@/components/Footer';
import "./globals.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()
import { setCookie, deleteCookie } from "cookies-next";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathName = usePathname();
  useEffect(() => {
    Modal.setAppElement("#htmlParrent");
  }, []);
  return (
    <html lang="en" id="htmlParrent">
      <QueryClientProvider client={queryClient}>
        <body className={inter.className} >
          <div
            className={`min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-30 text-gray-700 ${pathName === "/login" ? "" : "pl-64"}`} style={{backgroundImage: `url("/background.png")`, backgroundSize: 'cover', backgroundPosition: 'center'}}
          >
            {pathName === "/login" ? null : (
              <div className="h-14  bg-gray-50">
                <div className="flex items-center justify-between h-full px-6 border-b">
                  <div className="flex items-center">
                    <div className="text-m font-serif ">
                    
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                    
                      <div className="ml-4 hover:text-gray-700 font-serif hover:bg-gray-400 p-2 rounded-full">
                        <button onClick={() => {
                          deleteCookie("token");
                          window.location.href = "/login";
                        }}>Déconnexion</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {pathName === "/login" ? null : <Sidebar />}

            <main>
            
              {children}</main>
          </div>
          <Toaster />
        </body>
      </QueryClientProvider>
     
    </html>
  );
}
