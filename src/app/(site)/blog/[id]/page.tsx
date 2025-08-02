
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import type { Metadata } from 'next';
import { getPostById } from "@/lib/blog-data";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPostById(params.id);
  return {
    title: post?.title || 'Blog Post',
  };
}


export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">পোস্ট পাওয়া যায়নি।</h1>
        <Button asChild className="mt-4">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            সকল পোস্ট দেখুন
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
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    ব্লগে ফিরে যান
                  </Link>
                </Button>
            </div>
            <Card className="shadow-lg overflow-hidden">
                <div className="relative aspect-[2/1]">
                   <Image 
                     src={post.image}
                     alt={post.title}
                     fill
                     className="object-cover"
                     data-ai-hint={post.dataAiHint}
                    />
                </div>
                <CardHeader>
                    <CardTitle className="text-3xl text-primary font-headline">{post.title}</CardTitle>
                     <div className="flex items-center text-sm text-muted-foreground gap-4 pt-2">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{post.date}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="text-muted-foreground text-base leading-relaxed space-y-4">
                   <p>{post.content}</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
