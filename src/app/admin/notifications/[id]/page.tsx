
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft, Download, Calendar } from "lucide-react";
import { getNoticeById } from "@/lib/notice-data";
import { notFound } from "next/navigation";

export default async function AdminNoticeDetailsPage({ params }: { params: { id: string } }) {
  const notice = await getNoticeById(params.id);

  if (!notice) {
    notFound();
  }

  return (
    <>
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href="/admin/notifications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            সকল ঘোষণায় ফিরে যান
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="text-2xl text-primary font-headline">{notice.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground pt-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{notice.date}</span>
              </div>
          </CardHeader>
          <CardContent className="text-muted-foreground text-base leading-relaxed">
              <p>{notice.description}</p>
          </CardContent>
          {notice.fileUrl && (
            <CardFooter>
                <Button asChild>
                    <a href={notice.fileUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        ডাউনলোড করুন
                    </a>
                </Button>
            </CardFooter>
          )}
      </Card>
    </>
  );
}
