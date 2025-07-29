
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getNotices, Notice } from "@/lib/notice-data";
import { Bell, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NOTICES_PER_PAGE = 5;

const NoticeItem = ({ notice, isRead, onRead }: { notice: Notice, isRead: boolean, onRead: (id: number) => void }) => (
    <li className={cn(
        "p-4 flex items-start gap-4 border-b last:border-b-0 transition-colors",
        !isRead && "bg-blue-50"
    )}>
        <div className="flex-shrink-0 mt-1">
             {!isRead ? (
                <div className="bg-blue-500 rounded-full h-5 w-5 flex items-center justify-center text-white">
                    <Bell className="h-3 w-3" />
                </div>
            ) : (
                <div className="text-green-500">
                    <CheckCircle className="h-5 w-5" />
                </div>
            )}
        </div>
        <div className="flex-grow">
            <Link 
                href={`/admin/notifications/${notice.id}`} 
                className="font-semibold text-foreground hover:text-primary transition-colors block" 
                onClick={() => onRead(notice.id)}
            >
                {notice.title}
            </Link>
            <p className="text-sm text-muted-foreground mt-1">{notice.date}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{notice.description}</p>
        </div>
    </li>
);

export default function NotificationsPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [readNoticeIds, setReadNoticeIds] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    
    useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true);
            const marqueeNotices = await getNotices({ is_marquee: true });
            setNotices(marqueeNotices);
            setLoading(false);
        };
        fetchNotices();

        const storedReadIds = localStorage.getItem("readNoticeIds");
        if (storedReadIds) {
            setReadNoticeIds(new Set(JSON.parse(storedReadIds)));
        }
    }, []);

    const totalPages = Math.ceil(notices.length / NOTICES_PER_PAGE);

    const paginatedNotices = useMemo(() => {
        return notices.slice(
            (currentPage - 1) * NOTICES_PER_PAGE,
            currentPage * NOTICES_PER_PAGE
        );
    }, [notices, currentPage]);

    const handleMarkAsRead = (id: number) => {
        setReadNoticeIds(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            localStorage.setItem("readNoticeIds", JSON.stringify(Array.from(newSet)));
            return newSet;
        });
    };

    const handleMarkAllAsRead = () => {
        const allIds = new Set(notices.map(n => n.id));
        setReadNoticeIds(allIds);
        localStorage.setItem("readNoticeIds", JSON.stringify(Array.from(allIds)));
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>জরুরী ঘোষণা</CardTitle>
                 {notices.length > 0 && <Button onClick={handleMarkAllAsRead}>সবগুলো পঠিত হিসেবে চিহ্নিত করুন</Button>}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-muted-foreground text-center py-8">লোড হচ্ছে...</p>
                ) : paginatedNotices.length > 0 ? (
                    <ul className="divide-y divide-border -m-6 border rounded-lg overflow-hidden">
                        {paginatedNotices.map((notice) => (
                            <NoticeItem 
                                key={notice.id} 
                                notice={notice} 
                                isRead={readNoticeIds.has(notice.id)}
                                onRead={handleMarkAsRead}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-center py-8">কোনো নতুন ঘোষণা নেই।</p>
                )}
            </CardContent>
             {totalPages > 1 && (
                <CardFooter className="flex items-center justify-between pt-4">
                    <span className="text-sm text-muted-foreground">
                        পৃষ্ঠা {currentPage} এর {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            size="sm"
                        >
                            পূর্ববর্তী
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                             size="sm"
                        >
                            পরবর্তী
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
