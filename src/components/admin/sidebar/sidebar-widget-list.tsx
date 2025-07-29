
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Edit } from "lucide-react";
import { SidebarWidget, deleteSidebarWidget } from "@/lib/sidebar-data";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";

const widgetTypeMap = {
    profile: 'প্রোফাইল',
    links: 'লিংক তালিকা',
    image_link: 'ছবি লিংক'
}

export default function SidebarWidgetList({ widgets }: { widgets: SidebarWidget[] }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<SidebarWidget | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteClick = (widget: SidebarWidget) => {
    setSelectedWidget(widget);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedWidget) {
      const result = await deleteSidebarWidget(selectedWidget.id);
      if (result.success) {
        toast({ title: "উইজেট মোছা হয়েছে", description: `"${selectedWidget.title}" সফলভাবে মুছে ফেলা হয়েছে।` });
        router.refresh();
      } else {
        toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
      }
      setIsDeleteDialogOpen(false);
      setSelectedWidget(null);
    }
  };

  return (
    <>
      {/* Desktop View */}
      <div className="border rounded-md hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>শিরোনাম</TableHead>
              <TableHead>ধরণ</TableHead>
              <TableHead>অবস্থান</TableHead>
              <TableHead className="w-[100px] text-right">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {widgets.length > 0 ? widgets.map((widget) => (
              <TableRow key={widget.id}>
                <TableCell className="font-medium">{widget.title}</TableCell>
                <TableCell>{widgetTypeMap[widget.widget_type]}</TableCell>
                <TableCell>{widget.sort_order}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">মেনু খুলুন</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/sidebar/edit/${widget.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          সম্পাদনা
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleDeleteClick(widget)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        মুছুন
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  কোনো উইজেট পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {widgets.length > 0 ? widgets.map((widget) => (
            <Card key={widget.id}>
                <CardHeader>
                    <CardTitle>{widget.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>ধরণ:</strong> {widgetTypeMap[widget.widget_type]}</p>
                    <p><strong>অবস্থান:</strong> {widget.sort_order}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/sidebar/edit/${widget.id}`}>সম্পাদনা</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(widget)}>মুছুন</Button>
                </CardFooter>
            </Card>
        )) : (
             <p className="text-center text-muted-foreground py-8">কোনো উইজেট পাওয়া যায়নি।</p>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>এই উইজেটটি স্থায়ীভাবে মুছে ফেলা হবে।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">মুছে ফেলুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
