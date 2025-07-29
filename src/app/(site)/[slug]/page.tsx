
import { getPageBySlug } from "@/lib/page-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function DynamicPage({ params }: { params: { slug: string } }) {
    const page = await getPageBySlug(params.slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <Card className="shadow-lg overflow-hidden">
                    {page.thumbnail && (
                        <div className="relative aspect-[16/9]">
                            <Image 
                                src={page.thumbnail}
                                alt={page.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="text-3xl text-primary font-headline">{page.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none text-muted-foreground text-base leading-relaxed space-y-4">
                        <div dangerouslySetInnerHTML={{ __html: page.description }} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
