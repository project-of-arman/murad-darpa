"use client";

import Footer from '@/components/footer';
import HeroCarousel from '@/components/homepage/hero-carousel';
import SecondaryNav from '@/components/homepage/secondary-nav';
import DynamicSidebar from '@/components/homepage/dynamic-sidebar';
import SiteHeaderClientWrapper from '@/components/homepage/site-header-client-wrapper';
import { getNotices, Notice } from '@/lib/notice-data';
import { getSchoolInfo, SchoolInfo } from '@/lib/school-data';
import { useEffect, useState } from 'react';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [marqueeNotices, setMarqueeNotices] = useState<Notice[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [info, notices] = await Promise.all([
        getSchoolInfo(),
        getNotices({ is_marquee: true })
      ]);
      setSchoolInfo(info);
      setMarqueeNotices(notices);
    }
    fetchData();
  }, []);
  
  return (
    <div className="relative flex min-h-screen flex-col">
        {schoolInfo && <SiteHeaderClientWrapper schoolInfo={schoolInfo} marqueeNotices={marqueeNotices} />}
        <HeroCarousel />
        {schoolInfo && <SecondaryNav schoolName={schoolInfo.name} />}
        <main className="flex-1">
            <div className="container mx-auto py-12 sm:py-16 lg:py-20 ">
                <div className="grid grid-cols-10 gap-8"> 
                <div className="col-span-10 lg:col-span-7 xl:col-span-8">
                    {children}
                </div>
                <div className="col-span-10 lg:col-span-3 xl:col-span-2">
                    <DynamicSidebar />
                </div>
                </div>
            </div>
        </main>
      <Footer />
    </div>
  );
}