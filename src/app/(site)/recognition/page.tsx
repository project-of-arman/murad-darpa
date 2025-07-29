import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";

export default function RecognitionPage() {
  return (
    <div className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">পাঠদান ও স্বীকৃতি</h1>
          <p className="text-muted-foreground mt-2">আমাদের শিক্ষাদান পদ্ধতি ও সরকারী স্বীকৃতি</p>
        </div>
        <Card className="shadow-lg max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                <BadgeCheck className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl text-primary font-headline">আমাদের পাঠদান পদ্ধতি ও স্বীকৃতি</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয় একটি সরকার-অনুমোদিত শিক্ষা প্রতিষ্ঠান এবং এটি ঢাকা শিক্ষা বোর্ডের অধিভুক্ত। আমরা জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (এনসিটিবি) কর্তৃক নির্ধারিত পাঠ্যসূচি অনুসরণ করি। আমাদের শিক্ষাদান পদ্ধতি আধুনিক ও বিজ্ঞানসম্মত, যা শিক্ষার্থীদের সৃজনশীলতা এবং সমালোচনামূলক চিন্তাভাবনার বিকাশে সহায়তা করে।</p>
            <p>আমরা নিয়মিতভাবে শিক্ষকদের জন্য প্রশিক্ষণের আয়োজন করি যাতে তারা সর্বশেষ শিক্ষাদান কৌশল সম্পর্কে অবগত থাকতে পারেন। আমাদের মূল লক্ষ্য হলো একটি আনন্দদায়ক এবং শিক্ষার্থীকেন্দ্রিক পরিবেশ তৈরি করা যেখানে প্রত্যেক শিক্ষার্থী নিজের সেরাটা দিতে উৎসাহিত হয়।</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
