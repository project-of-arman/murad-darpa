
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft, Download, Calendar } from "lucide-react";
import { getNoticeById } from "@/lib/notice-data";


export default async function NoticeDetailsPage({ params }: { params: { id: string } }) {
  const notice = await getNoticeById(params.id);

  if (!notice) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">নোটিশ পাওয়া যায়নি।</h1>
        <Button asChild className="mt-4">
          <Link href="/notice">
            <ArrowLeft className="mr-2 h-4 w-4" />
            সকল নোটিশ দেখুন
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-3xl">
            <div className="mb-8">
                <Button asChild variant="outline">
                  <Link href="/notice">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    তালিকায় ফিরে যান
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
                <CardFooter>
                    <Button asChild>
                        <a href={notice.fileUrl} download>
                            <Download className="mr-2 h-4 w-4" />
                            ডাউনলোড করুন
                        </a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
