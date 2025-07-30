"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
}

export default function PaginationControls({ currentPage, totalPages, basePath }: PaginationControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePreviousPage = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(currentPage - 1));
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleNextPage = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(currentPage + 1));
        router.push(`${pathname}?${params.toString()}`);
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-4">
            <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
            >
                পূর্ববর্তী
            </Button>
            <span className="text-sm text-muted-foreground">
                পৃষ্ঠা {currentPage} এর {totalPages}
            </span>
            <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
            >
                পরবর্তী
            </Button>
        </div>
    );
}