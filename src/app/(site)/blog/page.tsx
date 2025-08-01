
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User } from 'lucide-react';

const allPosts = [
  {
    id: 1,
    title: "বার্ষিক ক্রীড়া প্রতিযোগিতার পুরস্কার বিতরণী",
    author: "মোঃ আব্দুল্লাহ আল-আমিন",
    date: "২২ জুলাই, ২০২৪",
    excerpt: "আমাদের বিদ্যালয়ে বার্ষিক ক্রীড়া প্রতিযোগিতা सफलतापूर्वक সম্পন্ন হয়েছে। শিক্ষার্থীদের স্বতঃস্ফূর্ত অংশগ্রহণ এবং ক্রীড়াশৈলী ছিল চোখে পড়ার মতো।",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "sports prize giving"
  },
  {
    id: 2,
    title: "বিজ্ঞান মেলায় আমাদের শিক্ষার্থীদের অসাধারণ সাফল্য",
    author: "সালমা চৌধুরী",
    date: "২০ জুলাই, ২০২৪",
    excerpt: "আন্তঃস্কুল বিজ্ঞান মেলায় আমাদের শিক্ষার্থীরা তাদের উদ্ভাবনী প্রকল্প প্রদর্শনের মাধ্যমে প্রথম স্থান অধিকার করেছে।",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "science fair project"
  },
  {
    id: 3,
    title: "বৃক্ষরোপণ কর্মসূচী ও পরিবেশ সচেতনতা",
    author: "ফাতেমা আক্তার",
    date: "১৮ জুলাই, ২০২৪",
    excerpt: "পরিবেশ রক্ষার বার্তা নিয়ে আমাদের শিক্ষার্থীরা বৃক্ষরোপণ কর্মসূচীতে অংশগ্রহণ করেছে এবং校园 প্রাঙ্গণে বিভিন্ন প্রজাতির গাছ লাগিয়েছে।",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "tree plantation school"
  },
  {
    id: 4,
    title: "সাংস্কৃতিক অনুষ্ঠানে শিক্ষার্থীদের মনোমুগ্ধকর পরিবেশনা",
    author: "আয়েশা সিদ্দিকা",
    date: "১৫ জুলাই, ২০২৪",
    excerpt: "প্রতিষ্ঠানের বার্ষিক সাংস্কৃতিক অনুষ্ঠানে শিক্ষার্থীরা নাচ, গান, এবং নাটকের মাধ্যমে তাদের প্রতিভা তুলে ধরেছে।",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "cultural event stage"
  },
  {
    id: 5,
    title: "শিক্ষাসফরে ঐতিহাসিক স্থান পরিদর্শন",
    author: "কামরুল হাসান",
    date: "১২ জুলাই, ২০২৪",
    excerpt: "দশম শ্রেণীর শিক্ষার্থীরা শিক্ষাসফরের অংশ হিসেবে সোনারগাঁও এবং পানাম নগরীর ঐতিহাসিক স্থানগুলো পরিদর্শন করেছে।",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "historical place tour"
  },
  {
    id: 6,
    title: "নতুন লাইব্রেরী উদ্বোধন এবং বই পড়া উৎসব",
    author: "রহিম উদ্দিন আহমেদ",
    date: "১০ জুলাই, ২০২৪",
    excerpt: "জ্ঞানার্জনের সুযোগ বাড়াতে আমাদের বিদ্যালয়ে একটি আধুনিক লাইব্রেরী উদ্বোধন করা হয়েছে।",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "school library books"
  },
];

const POSTS_PER_PAGE = 4;

export default function BlogPage() {
    const [currentPage, setCurrentPage] = useState(1);
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

            {totalPages > 1 && (
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
