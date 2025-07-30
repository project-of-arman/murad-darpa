
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSchoolInfo, SchoolInfo } from "@/lib/school-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function LogoLoader() {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLogo() {
            try {
                const info = await getSchoolInfo();
                setLogoUrl(info.logo_url);
            } catch (error) {
                console.error("Failed to fetch school logo for loader:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchLogo();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="relative h-24 w-24">
                {loading ? (
                    <Skeleton className="h-full w-full rounded-full" />
                ) : logoUrl ? (
                    <>
                        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20"></div>
                        <Image
                            src={logoUrl}
                            alt="School Logo"
                            width={96}
                            height={96}
                            className="relative z-10 animate-fade-in"
                        />
                    </>
                ) : (
                    <div className="h-full w-full rounded-full bg-muted"></div>
                )}
            </div>
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
