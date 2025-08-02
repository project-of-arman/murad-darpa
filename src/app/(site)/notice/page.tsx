
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getNotices, Notice } from '@/lib/notice-data';
import PaginationControls from '@/components/pagination-controls';

const NOTICES_PER_PAGE = 5;

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

export default async function NoticeListPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const allNotices = await getNotices();
  
  const currentPage = Number(searchParams?.page || '1');
  const totalPages = Math.ceil(allNotices.length / NOTICES_PER_PAGE);

  const paginatedNotices = allNotices.slice(
    (currentPage - 1) * NOTICES_PER_PAGE,
    currentPage * NOTICES_PER_PAGE
  );
  
  return (
    <div className="bg-white py-16">
        <div className="container mx-auto px-4">
             <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-primary font-headline">নোটিশ বোর্ড</h1>
              <p className="text-muted-foreground mt-2">প্রতিষ্ঠানের সকল নোটিশসমূহ</p>
            </div>
            <Card className="shadow-lg border-primary/20">
              <CardContent className="p-0">
                  <ul className="divide-y divide-border">
                    {paginatedNotices.map((notice) => (
                      <li key={notice.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                        <NoticeDate date={notice.date} />
                        <div className="flex-grow">
                          <Link href={`/notice/${notice.id}`} className="font-medium text-foreground leading-snug hover:text-primary transition-colors block">{notice.title}</Link>
                          <p className="text-xs text-muted-foreground mt-1">{notice.date}</p>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/notice/${notice.id}`}>
                            <ArrowRight className="h-5 w-5 text-primary/80" />
                          </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
              </CardContent>
              <CardFooter className="flex items-center justify-center pt-4 border-t">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/notice"
                  />
              </CardFooter>
            </Card>
        </div>
    </div>
  );
}
