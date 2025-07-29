import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getSiteSettings } from '@/lib/settings-data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const faviconUrl = settings.favicon_url 
    ? `${settings.favicon_url}?v=${new Date().getTime()}`
    : '/favicon.ico';
 
  return {
    title: settings.site_title || 'মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয়',
    description: settings.meta_description || 'Official website for মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয়',
    keywords: settings.meta_keywords || 'school, education, bangladesh',
    icons: {
      icon: {
        url: faviconUrl,
        type: settings.favicon_url ? 'image/x-icon' : 'image/vnd.microsoft.icon',
      }
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
          {children}
          <Toaster />
      </body>
    </html>
  );
}
