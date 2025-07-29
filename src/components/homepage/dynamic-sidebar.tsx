
"use client";

import { getSidebarWidgets, SidebarWidget } from "@/lib/sidebar-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

function ProfileWidget({ widget }: { widget: SidebarWidget }) {
    return (
        <Card className="w-full shadow-lg border-primary/20 overflow-hidden">
            <CardHeader className="p-0">
                <div className="bg-primary text-primary-foreground p-3">
                    <h2 className="text-lg font-bold">{widget.title}</h2>
                </div>
            </CardHeader>
            <CardContent className="text-center p-0">
                {widget.image_url && (
                    <div className="flex justify-center">
                        <Image
                            src={widget.image_url}
                            alt={widget.title || 'Profile image'}
                            width={280}
                            height={380}
                            className="object-cover rounded"
                        />
                    </div>
                )}
                {widget.subtitle && <p className="mt-4 font-semibold text-primary">{widget.subtitle}</p>}
                {widget.link_url && widget.link_text && (
                    <Button asChild variant="link" className="mt-2">
                        <Link href={widget.link_url}>{widget.link_text}</Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

function LinksWidget({ widget }: { widget: SidebarWidget }) {
    let links: { text: string; url: string }[] = [];
    try {
        if (widget.content) {
            links = JSON.parse(widget.content);
        }
    } catch (error) {
        console.error("Failed to parse links content:", error);
    }

    return (
        <Card className="w-full shadow-lg border-primary/20 overflow-hidden">
            <CardHeader className="p-0">
                <div className="bg-primary text-primary-foreground p-3">
                    <h2 className="text-lg font-bold">{widget.title}</h2>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                {links.map((link, index) => (
                    <div key={index} className="border-b pb-2 last:border-b-0">
                        <Button asChild variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-primary text-left">
                             <Link href={link.url} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                                <span className="whitespace-normal">{link.text}</span>
                            </Link>
                        </Button>
                    </div>
                ))}
                 {widget.link_url && widget.link_text && (
                    <div className="text-center pt-2">
                        <Button asChild variant="secondary" size="sm">
                            <Link href={widget.link_url}>{widget.link_text}</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function ImageLinkWidget({ widget }: { widget: SidebarWidget }) {
    if (!widget.link_url || !widget.image_url) return null;
    return (
        <Link href={widget.link_url} target="_blank" rel="noopener noreferrer">
            <Card className="overflow-hidden shadow-md my-3 hover:shadow-xl transition-shadow">
                <Image 
                    src={widget.image_url}
                    alt={widget.title || "Banner"}
                    width={500}
                    height={150}
                    className="w-full h-auto object-cover"
                />
            </Card>
        </Link>
    );
}


const SidebarSkeleton = () => (
    <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="shadow-lg border-primary/20">
                <CardHeader className="p-0">
                    <Skeleton className="h-12 w-full rounded-t-lg rounded-b-none" />
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                </CardContent>
            </Card>
        ))}
    </div>
);


export default function DynamicSidebar() {
    const [widgets, setWidgets] = useState<SidebarWidget[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWidgets() {
            setLoading(true);
            const fetchedWidgets = await getSidebarWidgets();
            setWidgets(fetchedWidgets);
            setLoading(false);
        }
        fetchWidgets();
    }, []);
    
    if (loading) {
        return <SidebarSkeleton />;
    }

    return (
        <div className="space-y-8">
            {widgets.map(widget => {
                switch (widget.widget_type) {
                    case 'profile':
                        return <ProfileWidget key={widget.id} widget={widget} />;
                    case 'links':
                        return <LinksWidget key={widget.id} widget={widget} />;
                    case 'image_link':
                        return <ImageLinkWidget key={widget.id} widget={widget} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}
