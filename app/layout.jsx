"use client";

import "./globals.css";

/* next */
import { Inter } from "next/font/google";

/* react */
import { useState } from "react";

/* react-toast */
import { Toaster } from "react-hot-toast";

/* daisy-ui theme */
import DaisyUIThemeProvider from "@/providers/daisyui-theme-provider";

/* components */
import ChatList from "@/components/main/ChatList";

/* next */
import { usePathname } from "next/navigation";

/* hooks */
import useWindowSize from "@/hooks/useWindowSize";
import { useEffect } from "react";

/* zustand */
import { useStore } from "@/zustand/store";
import { SignalZero } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

/* 
  metadata is not allowed in client component(Do not delete !!!)
*/
// export const metadata = {
//   title: "Chat2Chat-V3",
//   description:
//     "an instant messenger that brings up your communication to a incredible awesome level 😍",
//   icons: {
//     icon: "/chat-icon.png",
//   },
//   content: {
//     width: "device-width",
//     "user-scalable": "no",
//     "initial-scale": "1.0",
//     "maximum-scale": "1.0",
//   },
// };

export default function RootLayout({ children }) {
  const path = usePathname();
  const size = useWindowSize();
  

  if (path == "/login" || path == "/register") {
    return (
      <html lang="en">
        <body className={`${inter.className}`} suppressHydrationWarning>
          <DaisyUIThemeProvider>
            <Toaster position="bottom-center" />
            <div className="max-w-[1200px] mx-auto bg-base-200 flex">
              {children}
            </div>
          </DaisyUIThemeProvider>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="en">
        <body className={`${inter.className}`} suppressHydrationWarning>
          <DaisyUIThemeProvider>
            <Toaster position="bottom-center" />
            <div className="max-w-[1200px] mx-auto bg-base-100 flex justify-center overflow-hidden">
              <div className="w-[1100px] bg-base-200 flex overflow-hidde">
                <ChatList />
                {children}
              </div>
            </div>
          </DaisyUIThemeProvider>
        </body>
      </html>
    );
  }
}
