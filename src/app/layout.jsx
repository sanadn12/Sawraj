import { Analytics } from "@vercel/analytics/react"
import React from "react"
// import IdleLogout from "@/components/Logout/Logout";
import "./globals.css";
export const metadata = {
  title: 'Sawraj Enterprises',
  description: 'Trusted Scrap Trading Since 2003 | Dealers in Ferrous & Non-Ferrous Metals',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
                {/* <IdleLogout /> */}
{children}
      <Analytics />
      </body>
    </html>
  )
}
