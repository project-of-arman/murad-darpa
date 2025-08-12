

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImportantLinkGroup } from "@/lib/important-links-data";

export default function ImportantLinks({ linkGroups }: { linkGroups: ImportantLinkGroup[] }) {

    return (
        <div className="container mx-auto ">
            <h2 className="text-3xl font-bold text-primary font-headline mb-8 text-center">গুরুত্বপূর্ণ লিংকসমূহ</h2>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 ">
                {linkGroups.map((card, index) => (
                    <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="text-primary">{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="!px-4">
                            <div className="flex gap-6 items-center">
                                <div className="w-[110px] h-[110px] flex-shrink-0">
                                    <Image 
                                        src={card.image || "https://placehold.co/110x110.png"}
                                        alt={card.title}
                                        width={110}
                                        height={110}
                                        className="rounded-lg w-full h-full object-cover"
                                        data-ai-hint={card.data_ai_hint}
                                    />
                                </div>
                                <div className="w-full sm:w-2/3 flex flex-col overflow-hidden space-y-2">
                                    {card.links.map((link, linkIndex) => (
                                        <Button key={linkIndex} asChild variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-primary text-left">
                                            {link.href ? (
                                                <Link href={link.href} className="flex !items-start gap-2">
                                                    <ArrowRight className="h-4 w-4 text-accent mt-1 shrink-0" />
                                                    <span className="whitespace-normal">{link.text}</span>
                                                </Link>
                                            ) : (
                                                <div className="flex !items-start gap-2 cursor-default">
                                                    <ArrowRight className="h-4 w-4 text-accent mt-1 shrink-0" />
                                                    <span className="whitespace-normal">{link.text}</span>
                                                </div>
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
