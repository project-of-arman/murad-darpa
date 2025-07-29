
"use client";

import { ImportantLinkGroup, Link as LinkType, deleteLinkGroup, deleteLink } from "@/lib/important-links-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";


function DeleteGroupButton({ groupId, groupTitle }: { groupId: number; groupTitle: string }) {
    const { toast } = useToast();
    
    const handleDelete = async () => {
        const result = await deleteLinkGroup(groupId);
        if (result.success) {
            toast({ title: "গ্রুপ মোছা হয়েছে", description: `"${groupTitle}" গ্রুপটি সফলভাবে মুছে ফেলা হয়েছে।` });
        } else {
            toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
        }
    };
    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                 <Button variant="destructive" size="sm"><Trash className="mr-2 h-4 w-4" /> মুছুন</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>এই গ্রুপ এবং এর অধীনে থাকা সকল লিংক স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি আর ফেরানো যাবে না।</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">মুছে ফেলুন</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function DeleteLinkButton({ linkId, linkText }: { linkId: number; linkText: string }) {
    const { toast } = useToast();
    
    const handleDelete = async () => {
        const result = await deleteLink(linkId);
        if (result.success) {
            toast({ title: "লিংক মোছা হয়েছে", description: `"${linkText}" লিংকটি সফলভাবে মুছে ফেলা হয়েছে।` });
        } else {
            toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
        }
    };
    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>এই লিংকটি স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি আর ফেরানো যাবে না।</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">মুছে ফেলুন</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}


export default function LinkGroupList({ groups }: { groups: ImportantLinkGroup[] }) {
    if (groups.length === 0) {
        return <p className="text-center text-muted-foreground">কোনো লিংক গ্রুপ পাওয়া যায়নি।</p>;
    }
  
    return (
        <div className="space-y-6">
            {groups.map((group) => (
                <Card key={group.id} className="border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/50">
                        <CardTitle>{group.title}</CardTitle>
                        <div className="flex gap-2">
                            <Button asChild size="sm" variant="outline"><Link href={`/admin/important-links/groups/edit/${group.id}`}><Edit className="mr-2 h-4 w-4" />সম্পাদনা</Link></Button>
                            <DeleteGroupButton groupId={group.id} groupTitle={group.title} />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <ul className="space-y-2">
                           {group.links.map((link) => (
                               <li key={link.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                   <div className="flex flex-col">
                                       <span className="font-medium">{link.text}</span>
                                       <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground">{link.href}</a>
                                   </div>
                                   <div className="flex gap-1">
                                        <Button asChild variant="ghost" size="icon" className="h-7 w-7"><Link href={`/admin/important-links/links/edit/${link.id}`}><Edit className="h-4 w-4" /></Link></Button>
                                        <DeleteLinkButton linkId={link.id} linkText={link.text} />
                                   </div>
                               </li>
                           ))}
                        </ul>
                         <div className="mt-4">
                            <Button asChild variant="secondary" size="sm">
                                <Link href={`/admin/important-links/links/new?groupId=${group.id}`}><PlusCircle className="mr-2 h-4 w-4" />নতুন লিংক যোগ করুন</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
