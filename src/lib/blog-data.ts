
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';

/* 
This is a mock implementation. In a real application, you would fetch this data from a database.
To set up a database, you would typically:
1. Create a `posts` table in your database.
2. Create functions here to query that table (e.g., `getPosts`, `getPostById`).
3. These functions would use the `pool` object to execute SQL queries.
*/

export interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    excerpt: string;
    content: string;
    image: string;
    dataAiHint: string;
}

const allPosts: Post[] = [
  {
    id: 1,
    title: "বার্ষিক ক্রীড়া প্রতিযোগিতার পুরস্কার বিতরণী",
    author: "মোঃ আব্দুল্লাহ আল-আমিন",
    date: "২২ জুলাই, ২০২৪",
    excerpt: "আমাদের বিদ্যালয়ে বার্ষিক ক্রীড়া প্রতিযোগিতা सफलतापूर्वक সম্পন্ন হয়েছে। শিক্ষার্থীদের স্বতঃস্ফূর্ত অংশগ্রহণ এবং ক্রীড়াশৈলী ছিল চোখে পড়ার মতো।",
    content: "আমাদের বিদ্যালয়ে বার্ষিক ক্রীড়া প্রতিযোগিতা सफलतापूर्वक সম্পন্ন হয়েছে। শিক্ষার্থীদের স্বতঃস্ফূর্ত অংশগ্রহণ এবং ক্রীড়াশৈলী ছিল চোখে পড়ার মতো। প্রধান অতিথি হিসেবে উপস্থিত ছিলেন माननीय জেলা প্রশাসক। তিনি বিজয়ীদের হাতে পুরস্কার তুলে দেন এবং শিক্ষার্থীদের উজ্জ্বল ভবিষ্যৎ কামনা করেন।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "sports prize giving"
  },
  {
    id: 2,
    title: "বিজ্ঞান মেলায় আমাদের শিক্ষার্থীদের অসাধারণ সাফল্য",
    author: "সালমা চৌধুরী",
    date: "২০ জুলাই, ২০২৪",
    excerpt: "আন্তঃস্কুল বিজ্ঞান মেলায় আমাদের শিক্ষার্থীরা তাদের উদ্ভাবনী প্রকল্প প্রদর্শনের মাধ্যমে প্রথম স্থান অধিকার করেছে।",
    content: "আন্তঃস্কুল বিজ্ঞান মেলায় আমাদের শিক্ষার্থীরা তাদের উদ্ভাবনী প্রকল্প প্রদর্শনের মাধ্যমে প্রথম স্থান অধিকার করেছে। তাদের 'সৌরশক্তি চালিত জল পরিশোধন' প্রকল্পটি বিচারকদের প্রশংসা অর্জন করে। এই সাফল্য স্কুলের জন্য একটি বড় গর্বের বিষয়।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "science fair project"
  },
  {
    id: 3,
    title: "বৃক্ষরোপণ কর্মসূচী ও পরিবেশ সচেতনতা",
    author: "ফাতেমা আক্তার",
    date: "১৮ জুলাই, ২০২৪",
    excerpt: "পরিবেশ রক্ষার বার্তা নিয়ে আমাদের শিক্ষার্থীরা বৃক্ষরোপণ কর্মসূচীতে অংশগ্রহণ করেছে এবং校园 প্রাঙ্গণে বিভিন্ন প্রজাতির গাছ লাগিয়েছে।",
    content: "পরিবেশ রক্ষার বার্তা নিয়ে আমাদের শিক্ষার্থীরা বৃক্ষরোপণ কর্মসূচীতে অংশগ্রহণ করেছে এবং校园 প্রাঙ্গণে বিভিন্ন প্রজাতির গাছ লাগিয়েছে। এই কর্মসূচীর মাধ্যমে শিক্ষার্থীদের মধ্যে পরিবেশ সচেতনতা বৃদ্ধি করা হয়।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "tree plantation school"
  },
  {
    id: 4,
    title: "সাংস্কৃতিক অনুষ্ঠানে শিক্ষার্থীদের মনোমুগ্ধকর পরিবেশনা",
    author: "আয়েশা সিদ্দিকা",
    date: "১৫ জুলাই, ২০২৪",
    excerpt: "প্রতিষ্ঠানের বার্ষিক সাংস্কৃতিক অনুষ্ঠানে শিক্ষার্থীরা নাচ, গান, এবং নাটকের মাধ্যমে তাদের প্রতিভা তুলে ধরেছে।",
    content: "প্রতিষ্ঠানের বার্ষিক সাংস্কৃতিক অনুষ্ঠানে শিক্ষার্থীরা নাচ, গান, এবং নাটকের মাধ্যমে তাদের প্রতিভা তুলে ধরেছে। অভিভাবকদের উপস্থিতিতে অনুষ্ঠানটি একটি উৎসবমুখর পরিবেশে পরিণত হয়।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "cultural event stage"
  },
  {
    id: 5,
    title: "শিক্ষাসফরে ঐতিহাসিক স্থান পরিদর্শন",
    author: "কামরুল হাসান",
    date: "১২ জুলাই, ২০২৪",
    excerpt: "দশম শ্রেণীর শিক্ষার্থীরা শিক্ষাসফরের অংশ হিসেবে সোনারগাঁও এবং পানাম নগরীর ঐতিহাসিক স্থানগুলো পরিদর্শন করেছে।",
    content: "দশম শ্রেণীর শিক্ষার্থীরা শিক্ষাসফরের অংশ হিসেবে সোনারগাঁও এবং পানাম নগরীর ঐতিহাসিক স্থানগুলো পরিদর্শন করেছে। এর মাধ্যমে তারা দেশের ইতিহাস ও ঐতিহ্য সম্পর্কে জানতে পারে।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "historical place tour"
  },
  {
    id: 6,
    title: "নতুন লাইব্রেরী উদ্বোধন এবং বই পড়া উৎসব",
    author: "রহিম উদ্দিন আহমেদ",
    date: "১০ জুলাই, ২০২৪",
    excerpt: "জ্ঞানার্জনের সুযোগ বাড়াতে আমাদের বিদ্যালয়ে একটি আধুনিক লাইব্রেরী উদ্বোধন করা হয়েছে।",
    content: "জ্ঞানার্জনের সুযোগ বাড়াতে আমাদের বিদ্যালয়ে একটি আধুনিক লাইব্রেরী উদ্বোধন করা হয়েছে। উদ্বোধনী অনুষ্ঠানে একটি বই পড়া উৎসবের আয়োজন করা হয় যেখানে শিক্ষার্থীরা স্বতঃস্ফূর্তভাবে অংশগ্রহণ করে।",
    image: "https://placehold.co/800x400.png",
    dataAiHint: "school library books"
  },
];

export async function getPosts(): Promise<Post[]> {
    // In a real app, you would fetch this from a database.
    // For now, we return the mock data.
    return allPosts;
}

export async function getPostById(id: string | number): Promise<Post | null> {
    // In a real app, you would fetch this from a database.
    const postId = parseInt(id as string, 10);
    return allPosts.find(p => p.id === postId) || null;
}
