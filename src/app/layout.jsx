import { Analytics } from "@vercel/analytics/react";
import React from "react";
import "./globals.css";

export const metadata = {
  title: 'Sawraj Enterprises Marketplace | List Products, Contact Sellers, Buy & Sell Scrap',
  description: 'Free product listings and direct seller contacts for scrap and metal trading. Sawraj Enterprises provides a secure platform for buying and selling  all types of products and ferrous & non-ferrous metals since 2003.',
  keywords: [
    'free product listing',
    'list products for free',
    'contact seller directly',
    'online scrap marketplace',
    'sell scrap online',
    'buy scrap materials',
    'metal trading platform',
    'ferrous metal marketplace',
    'non-ferrous metal marketplace',
    'trusted scrap dealer',
    'secure scrap trading',
    'list your scrap products',
    'dynamic marketplace for scrap',
    'Sawraj Enterprises scrap trading'
  ],
  authors: [{ name: 'Sawraj Enterprises' }],
  creator: 'Sawraj Enterprises',
  publisher: 'Sawraj Enterprises',
  robots: 'index, follow',
  openGraph: {
    title: 'Sawraj Enterprises Marketplace | List, Contact, and Trade Scrap Online',
    description: 'Free product listings and direct seller contacts for scrap and metal trading. A dynamic, trusted marketplace for all types of products.',
    url: 'https://www.sawraj.in',
    siteName: 'Sawraj Enterprises',
    images: [
      {
        url: 'https://www.sawraj.in/SeLogo.png', // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: 'Sawraj Enterprises Marketplace'
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  facebook: {
    url: 'https://www.facebook.com/people/Sawraj-enterprises/61576882319929/', 
  },
  linkedIn: {
    url: 'https://www.linkedin.com/company/107023827',
  },
  instagram: {
    url: 'https://www.instagram.com/sawrajenterprises',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta name="robots" content={metadata.robots} />



 {/* PWA Support */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/selogo.jpg" sizes="192x192" />
        <link rel="apple-touch-icon" href="/SeLogo.png" sizes="512x512" />



        {/* Open Graph */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:image:width" content={metadata.openGraph.images[0].width} />
        <meta property="og:image:height" content={metadata.openGraph.images[0].height} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        <meta property="og:type" content={metadata.openGraph.type} />

        {/* Facebook */}
        <meta property="article:publisher" content={metadata.facebook.url} />

        {/* LinkedIn */}
        <meta property="og:see_also" content={metadata.linkedIn.url} />

        {/* Instagram */}
        <meta property="og:see_also" content={metadata.instagram.url} />

        <link rel="icon" href="/selogo.jpg" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
