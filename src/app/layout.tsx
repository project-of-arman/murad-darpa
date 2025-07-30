
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getSiteSettings } from '@/lib/settings-data';
import { Suspense, useEffect, useState } from 'react';
import NextNProgress from 'nextjs-progressbar';

// We can't use generateMetadata in a client component, so we'll set the title dynamically.
// Note: For full metadata support, this would require a more complex setup, but for the title and favicon, this is a good approach.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        
        async function setMetadata() {
            try {
                const settings = await getSiteSettings();
                document.title = settings.site_title || 'মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয়';
                
                let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
                 const faviconUrl = settings.favicon_url 
                    ? `${settings.favicon_url}?v=${new Date().getTime()}`
                    : '/favicon.ico';
                link.href = faviconUrl;

            } catch (error) {
                console.error("Failed to set metadata:", error);
            }
        }
        setMetadata();
    }, []);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
          <NextNProgress color="#2d8a5b" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
          {children}
          <Toaster />
      </body>
    </html>
  );
}
