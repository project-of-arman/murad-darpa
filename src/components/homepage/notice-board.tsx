

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { Notice } from "@/lib/notice-data";

const NoticeDate = ({ date }: { date: string }) => {
    const parts = date.split(' ');
    if (parts.length < 2) return null;

    const day = parts[0].replace(',', '');
    const month = parts[1].replace(',', '');

    return (
        <div className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-md p-2 w-16 h-16 shrink-0 text-center">
            <span className="text-2xl font-bold leading-tight">{day}</span>
            <span className="text-xs font-medium uppercase tracking-wide">{month}</span>
        </div>
    )
}

export default function NoticeBoard({ notices }: { notices: Notice[] }) {
  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Bell className="h-6 w-6" />
          <span>নোটিশ বোর্ড</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {notices.length > 0 ? (
            <ul className="divide-y divide-border">
                {notices.slice(0, 5).map((notice) => (
                    <li key={notice.id} className="p-2 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                    <NoticeDate date={notice.date} />
                    <div className="flex-grow overflow-hidden">
                        <Link href={`/notice/${notice.id}`} className="font-medium text-foreground  leading-snug hover:text-primary transition-colors block">{notice.title}
                        <p className="text-xs whitespace-nowrap text-muted-foreground  mt-1">{notice.description}</p>
                        </Link>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/notice/${notice.id}`}>
                        <ArrowRight className="h-5 w-5 text-primary/80" />
                        </Link>
                    </Button>
                    </li>
                ))}
            </ul>
        ) : (
             <div className="p-4 text-center text-muted-foreground">
                <p>কোনো নোটিশ পাওয়া যায়নি।</p>
             </div>
        )}
      </CardContent>
       <div className="p-4 border-t">
          <Button variant="link" className="w-full" asChild>
            <Link href="/notice">সকল নোটিশ দেখুন</Link>
          </Button>
        </div>
    </Card>
  );
}
