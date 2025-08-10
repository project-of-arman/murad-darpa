
"use client";

import Link from 'next/link';
import { GraduationCap, Facebook, Twitter, Youtube } from 'lucide-react';
import { getSchoolInfo, SchoolInfo } from '@/lib/school-data';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

export default function Footer() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);

  useEffect(() => {
    async function fetchInfo() {
      const info = await getSchoolInfo();
      setSchoolInfo(info);
    }
    fetchInfo();
  }, []);

  if (!schoolInfo) {
    return (
        <footer className="bg-white border-t">
            <div className="container mx-auto px-4 py-8">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-5 w-80" />
                    <Skeleton className="h-5 w-24" />
                </div>
            </div>
        </footer>
    );
  }

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-primary">{schoolInfo.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {schoolInfo.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
