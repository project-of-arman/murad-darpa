
"use client";

import { useState, useEffect } from 'react';
import type { SchoolInfo } from '@/lib/school-data';

export default function TopBar({ schoolInfo }: { schoolInfo: SchoolInfo }) {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const dateOptions: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        setCurrentDate(new Date().toLocaleDateString('bn-BD', dateOptions));
    }, []);

    return (
        <div className="bg-primary/10 text-primary text-sm py-2">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-4 font-medium">
                   {schoolInfo.mpo_code && <span>MPO Code: {schoolInfo.mpo_code}</span>}
                   {schoolInfo.eiin_number && <span>EIIN: {schoolInfo.eiin_number}</span>}
                </div>
                <div className="font-medium hidden md:block">
                    {currentDate}
                </div>
            </div>
        </div>
    );
}
