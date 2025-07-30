
"use client";

import { Megaphone } from 'lucide-react';
import Link from 'next/link';
import TopBar from '@/components/homepage/top-bar';
import type { SchoolInfo } from '@/lib/school-data';
import type { Notice } from '@/lib/notice-data';


const Marquee = ({ notices }: { notices: Notice[] }) => {
  if (notices.length === 0) {
    return null;
  } 
  
  return (
    <div className="bg-primary text-primary-foreground py-2 my-4 overflow-hidden">
      <div className="marquee-container flex items-center">
        <div className="flex-shrink-0 flex z-50 items-center gap-2 bg-primary px-3 py-1 rounded-md">
            <Megaphone className="h-5 w-5" />
            <span className="font-bold hidden sm:flex">জরুরী ঘোষণা:</span>
        </div>
        <div className="marquee whitespace-nowrap">
          <div className="flex">
            {notices.map(notice => (
                <Link href={`/notice/${notice.id}`} key={notice.id} className="hover:underline px-4">
                    {notice.title}
                </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default function SiteHeaderClientWrapper({ schoolInfo, marqueeNotices }: { schoolInfo: SchoolInfo, marqueeNotices: Notice[] }) {
    return (
        <>
            <TopBar schoolInfo={schoolInfo} />
            <div className="container mx-auto px-4">
               <Marquee notices={marqueeNotices} />
            </div>
        </>
    )
}
