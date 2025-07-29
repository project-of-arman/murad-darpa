
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Edit, PlusCircle, ArrowUp, ArrowDown } from "lucide-react";
import { NavLink, deleteNavLink } from "@/lib/nav-data";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import * as LucideIcons from 'lucide-react';

const IconComponent = ({ name }: { name: string | null | undefined }) => {
    if (!name) return null;
    const Icon = LucideIcons[name as keyof typeof LucideIcons] as React.ElementType;
    return Icon ? <Icon className="h-4 w-4" /> : null;
};


function DeleteButton({ linkId, linkTitle }: { linkId: number, linkTitle: string }) {
    const { toast } = useToast();
    const router = useRouter();

    const handleConfirmDelete = async () => {
        const result = await deleteNavLink(linkId);
        if (result.success) {
            toast({ title: "লিংক মোছা হয়েছে", description: `"${linkTitle}" সফলভাবে মুছে ফেলা হয়েছে।` });
            router.refresh();
        } else {
            toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
        }
    };
    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="text-destructive h-7 w-7"><Trash className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>এই লিংক এবং এর অধীনে থাকা সকল সাব-লিংক স্থায়ীভাবে মুছে ফেলা হবে।</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>বাতিল</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">মুছুন</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}


export default function NavLinkTable({ navLinks }: { navLinks: NavLink[] }) {
  const router = useRouter();

  const renderRow = (link: NavLink, isSub: boolean = false) => {
    return (
        <TableRow key={link.id}>
            <TableCell className={isSub ? "pl-12" : "pl-4"}>
                <div className="flex items-center gap-2">
                    <IconComponent name={link.icon} />
                    <span>{link.title}</span>
                </div>
            </TableCell>
            <TableCell>{link.href || ' (ড্রপডাউন)'}</TableCell>
            <TableCell>{link.sort_order}</TableCell>
            <TableCell className="text-right">
                {!isSub && (
                    <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                        <Link href={`/admin/nav-manager/new?parent_id=${link.id}`} title="সাব-লিংক যোগ করুন">
                            <PlusCircle className="h-4 w-4" />
                        </Link>
                    </Button>
                )}
                <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                    <Link href={`/admin/nav-manager/edit/${link.id}`} title="সম্পাদনা করুন">
                        <Edit className="h-4 w-4" />
                    </Link>
                </Button>
                <DeleteButton linkId={link.id} linkTitle={link.title} />
            </TableCell>
        </TableRow>
    );
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>শিরোনাম</TableHead>
            <TableHead>লিংক</TableHead>
            <TableHead>অবস্থান</TableHead>
            <TableHead className="w-[150px] text-right">অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {navLinks.length > 0 ? navLinks.map(link => (
              <>
                {renderRow(link)}
                {link.subLinks && link.subLinks.map(subLink => renderRow(subLink, true))}
              </>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                কোনো নেভিগেশন লিংক পাওয়া যায়নি।
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
