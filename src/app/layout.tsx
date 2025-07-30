
"use client";

import type { Metadata, IconDescriptor } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getSiteSettings } from '@/lib/settings-data';
import NextNProgress from 'nextjs-progressbar';
import { useEffect, useState } from 'react';

// We can't use generateMetadata in a client component, so we manage the title dynamically.
// SEO-critical metadata should be handled in a parent Server Component layout if possible,
// but for this case, we'll set the title with useEffect.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteTitle, setSiteTitle] = useState('মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয়');
  const [favicon, setFavicon] = useState('/favicon.ico');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await getSiteSettings();
        if (settings.site_title) {
          setSiteTitle(settings.site_title);
          document.title = settings.site_title;
        }
        if (settings.favicon_url && typeof settings.favicon_url === 'string') {
          setFavicon(settings.favicon_url);
        }
      } catch (error) {
        console.error("Failed to fetch site settings, using defaults.", error);
      }
    }
    fetchSettings();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={favicon} type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
          <NextNProgress color="hsl(var(--primary))" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
          {children}
          <Toaster />
      </body>
    </html>
  );
}
