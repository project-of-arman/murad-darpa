
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";

const allPosts = [
  {
    id: 1,
    title: "বার্ষিক ক্রীড়া প্রতিযোগিতার পুরস্কার বিতরণী",
    author: "মোঃ আব্দুল্লাহ আল-আমিন",
    date: "২২ জুলাই, ২০২৪",
    content: "আমাদের বিদ্যালয়ে বার্ষিক ক্রীড়া প্রতিযোগিতা सफलतापूर्वक সম্পন্ন হয়েছে। শিক্ষার্থীদের স্বতঃস্ফূর্ত অংশগ্রহণ এবং ক্রীড়াশৈলী ছিল চোখে পড়ার মতো। প্রধান অতিথি হিসেবে উপস্থিত ছিলেন माननीय জেলা প্রশাসক। তিনি বিজয়ীদের হাতে পুরস্কার তুলে দেন এবং শিক্ষার্থীদের উজ্জ্বল ভবিষ্যৎ কামনা করেন।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "sports prize giving"
  },
  {
    id: 2,
    title: "বিজ্ঞান মেলায় আমাদের শিক্ষার্থীদের অসাধারণ সাফল্য",
    author: "সালমা চৌধুরী",
    date: "২০ জুলাই, ২০২৪",
    content: "আন্তঃস্কুল বিজ্ঞান মেলায় আমাদের শিক্ষার্থীরা তাদের উদ্ভাবনী প্রকল্প প্রদর্শনের মাধ্যমে প্রথম স্থান অধিকার করেছে। তাদের 'সৌরশক্তি চালিত জল পরিশোধন' প্রকল্পটি বিচারকদের প্রশংসা অর্জন করে। এই সাফল্য স্কুলের জন্য একটি বড় গর্বের বিষয়।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "science fair project"
  },
  {
    id: 3,
    title: "বৃক্ষরোপণ কর্মসূচী ও পরিবেশ সচেতনতা",
    author: "ফাতেমা আক্তার",
    date: "১৮ জুলাই, ২০২৪",
    content: "পরিবেশ রক্ষার বার্তা নিয়ে আমাদের শিক্ষার্থীরা বৃক্ষরোপণ কর্মসূচীতে অংশগ্রহণ করেছে এবং校园 প্রাঙ্গণে বিভিন্ন প্রজাতির গাছ লাগিয়েছে। এই কর্মসূচীর মাধ্যমে শিক্ষার্থীদের মধ্যে পরিবেশ সচেতনতা বৃদ্ধি করা হয়।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "tree plantation school"
  },
  {
    id: 4,
    title: "সাংস্কৃতিক অনুষ্ঠানে শিক্ষার্থীদের মনোমুগ্ধকর পরিবেশনা",
    author: "আয়েশা সিদ্দিকা",
    date: "১৫ জুলাই, ২০২৪",
    content: "প্রতিষ্ঠানের বার্ষিক সাংস্কৃতিক অনুষ্ঠানে শিক্ষার্থীরা নাচ, গান, এবং নাটকের মাধ্যমে তাদের প্রতিভা তুলে ধরেছে। অভিভাবকদের উপস্থিতিতে অনুষ্ঠানটি একটি উৎসবমুখর পরিবেশে পরিণত হয়।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "cultural event stage"
  },
  {
    id: 5,
    title: "শিক্ষাসফরে ঐতিহাসিক স্থান পরিদর্শন",
    author: "কামরুল হাসান",
    date: "১২ জুলাই, ২০২৪",
    content: "দশম শ্রেণীর শিক্ষার্থীরা শিক্ষাসফরের অংশ হিসেবে সোনারগাঁও এবং পানাম নগরীর ঐতিহাসিক স্থানগুলো পরিদর্শন করেছে। এর মাধ্যমে তারা দেশের ইতিহাস ও ঐতিহ্য সম্পর্কে জানতে পারে।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "historical place tour"
  },
  {
    id: 6,
    title: "নতুন লাইব্রেরী উদ্বোধন এবং বই পড়া উৎসব",
    author: "রহিম উদ্দিন আহমেদ",
    date: "১০ জুলাই, ২০২৪",
    content: "জ্ঞানার্জনের সুযোগ বাড়াতে আমাদের বিদ্যালয়ে একটি আধুনিক লাইব্রেরী উদ্বোধন করা হয়েছে। উদ্বোধনী অনুষ্ঠানে একটি বই পড়া উৎসবের আয়োজন করা হয় যেখানে শিক্ষার্থীরা স্বতঃস্ফূর্তভাবে অংশগ্রহণ করে।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "school library books"
  },
];


export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = allPosts.find(p => p.id.toString() === params.id);

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

