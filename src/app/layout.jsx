import { Analytics } from "@vercel/analytics/react";
import React from "react";
import "./globals.css";

export const metadata = {
  title: 'Sawraj Enterprises Marketplace | List Products, Live Auctions, Connect with Sellers, Buy & Sell Scrap, Social Profiles',
  description: 'Sawraj Enterprises, originally known for scrap and metal trading, now offers a comprehensive marketplace with free product listings, live auctions, and direct seller contacts. Connect with sellers, buy and sell a wide range of products, ferrous and non-ferrous metals, and explore our social profiles for updates and offers.',
 keywords: [
  'free product listing',
  'list products for free',
  'contact seller directly',
  'online marketplace India',
  'buy and sell products online',
  'live auctions online',
  'connect with sellers',
  'industrial product listings',
  'business trading platform',
  'trusted online marketplace',
  'product listing platform',
  'bulk buying and selling',
  'online auctions platform',
  'ferrous and non-ferrous metals',
  'metal buyers and sellers',
  'scrap and material auctions',
  'social marketplace India',
  'trusted marketplace for sellers',
  'secure online trading',
  'list your products online',
  'dynamic e-commerce marketplace',
  'buy electronics online',
  'sell electronics online',
  'buy furniture online',
  'sell furniture online',
  'buy machinery online',
  'sell machinery online',
  'B2B product marketplace',
  'connect with buyers',
  'online trading platform India',
  'industrial equipment marketplace',
  'home products marketplace',
  'agriculture products marketplace',
  'live bidding platform',
  'multi-category marketplace',
  'online product auctions',
  'direct seller contacts',
  'business-to-business marketplace',
  'buy bulk products online',
  'sell bulk products online',
  'trusted seller platform',
  'online listing platform India',
  'list and sell products',
  'marketplace for all products',
  'social profile marketplace',
  'product discovery platform',
  'online trading hub India',
  'industrial and consumer products'
],
  authors: [{ name: 'Sawraj Enterprises' }],
  creator: 'Sawraj Enterprises',
  publisher: 'Sawraj Enterprises',
  robots: 'index, follow',
  openGraph: {
    title: 'Sawraj Enterprises Marketplace | List, Contact, Auctions and Trade Scrap Online',
    description: 'Free product listings and direct seller contacts for scrap and metal trading. A dynamic, trusted marketplace for all types of products.',
    url: 'https://www.sawraj.in',
    siteName: 'Sawraj Enterprises',
    images: [
      {
        url: 'https://www.sawraj.in/selogo.jpg',
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
        <link rel="apple-touch-icon" href="/selogo.jpg" sizes="512x512" />



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
