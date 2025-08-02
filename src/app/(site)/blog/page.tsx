
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { getPosts, Post } from '@/lib/blog-data';
import PaginationControls from '@/components/pagination-controls';

const POSTS_PER_PAGE = 4;

export default async function BlogPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const allPosts = await getPosts();
    
    const currentPage = Number(searchParams?.page || '1');
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    const paginatedPosts = allPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );
    
  return (
    <div className="bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
             <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-primary font-headline">ব্লগ ও ঘটনাবলী</h1>
              <p className="text-muted-foreground mt-2">আমাদের প্রতিষ্ঠানের সাম্প্রতিক ঘটনাবলী ও লেখালেখি</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {paginatedPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
                        <div className="relative aspect-video">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                data-ai-hint={post.dataAiHint}
                            />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                <Link href={`/blog/${post.id}`}>{post.title}</Link>
                            </CardTitle>
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
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="link" className="p-0">
                                <Link href={`/blog/${post.id}`}>
                                    আরো পড়ুন <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/blog"
            />
        </div>
    </div>
  );
}
