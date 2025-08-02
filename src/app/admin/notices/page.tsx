
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNotices, Notice } from "@/lib/notice-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import NoticeTable from "@/components/admin/notices/notice-table";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = useAppSelector(selectRole);

  useEffect(() => {
    async function fetchNotices() {
        setLoading(true);
        const data = await getNotices();
        setNotices(data);
        setLoading(false);
    }
    fetchNotices();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>নোটিশ ব্যবস্থাপনা</CardTitle>
        {userRole !== 'visitor' && (
            <Button asChild>
            <Link title="নতুন নোটিশ যোগ করুন" href="/admin/notices/new">
                <PlusCircle  className="mx-2 h-4 w-4" />
                <span className="hidden sm:flex">নতুন নোটিশ যোগ করুন</span>
            </Link>
            </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? <p>Loading...</p> : <NoticeTable notices={notices} userRole={userRole} />}
      </CardContent>
    </Card>
  );
}
