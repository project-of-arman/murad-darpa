
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { getPosts, Post } from '@/lib/blog-data';
import { Skeleton } from '@/components/ui/skeleton';


const POSTS_PER_PAGE = 4;

const PostCardSkeleton = () => (
    <Card className="flex flex-col">
        <div className="relative aspect-video">
            <Skeleton className="h-full w-full" />
        </div>
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center gap-4 pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
            </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-6 w-20" />
        </CardFooter>
    </Card>
);

export default function BlogPage() {
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const posts = await getPosts();
            setAllPosts(posts);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    const paginatedPosts = allPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

  return (
    <div className="bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
             <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-primary font-headline">ব্লগ ও ঘটনাবলী</h1>
              <p className="text-muted-foreground mt-2">আমাদের প্রতিষ্ঠানের সাম্প্রতিক ঘটনাবলী ও লেখালেখি</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {loading ? (
                    <>
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                    </>
                ) : (
                    paginatedPosts.map((post) => (
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
                    ))
                )}
            </div>

            {totalPages > 1 && !loading && (
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
            )}
        </div>
    </div>
  );
}
