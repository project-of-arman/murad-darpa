
"use client";

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Users,
  FileText,
  Bell,
  Calendar,
  Book,
  Newspaper,
  Award,
  File,
  MessageSquare,
  Image as ImageIcon,
  Home,
  GraduationCap,
  ChevronDown,
  Video,
  User,
  Building2,
  List,
  StickyNote,
  Link2,
  Trophy,
  Settings,
  GalleryHorizontal,
  ClipboardList,
  Sidebar as SidebarIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: Home, label: "Dashboard" },
  {
    label: "স্কুল সম্পর্কিত",
    icon: BookOpen,
    subItems: [
      { href: "/admin/school-details", icon: Building2, label: "স্কুল বিস্তারিত" },
      { href: "/admin/notices", icon: Bell, label: "নোটিশ" },
      { href: "/admin/routine", icon: Calendar, label: "রুটিন" },
      { href: "/admin/exam-routine", icon: ClipboardList, label: "পরীক্ষার রুটিন" },
      { href: "/admin/syllabus", icon: Book, label: "সিলেবাস" },
      { href: "/admin/students", icon: User, label: "শিক্ষার্থী" },
      { href: "/admin/teachers", icon: Users, label: "শিক্ষক" },
      { href: "/admin/staff", icon: Users, label: "কর্মচারী" },
      { href: "/admin/committee", icon: Users, label: "কমিটি" },
    ],
  },
  { href: "/admin/notifications", icon: Bell, label: "ঘোষণা" },
  { href: "/admin/results", icon: Trophy, label: "ফলাফল" },
  { href: "/admin/admission-guidelines", icon: FileText, label: "ভর্তি নির্দেশিকা" },
  { href: "/admin/pages", icon: StickyNote, label: "পেজ" },
   { href: "/admin/important-links", icon: Link2, label: "গুরুত্বপূর্ণ লিংক" },
  { href: "/admin/sidebar", icon: SidebarIcon, label: "সাইডবার" },
  { href: "/admin/forms", icon: File, label: "সকল ফরমস" },
  {
    label: "গ্যালারি",
    icon: ImageIcon,
    subItems: [
        { href: "/admin/gallery/carousel", icon: GalleryHorizontal, label: "ক্যারোসেল" },
        { href: "/admin/gallery/photos", icon: ImageIcon, label: "ছবি গ্যালারি" },
        { href: "/admin/gallery/videos", icon: Video, label: "ভিডিও গ্যালারি" }
    ]
  },
  { href: "/admin/contact", icon: MessageSquare, label: "যোগাযোগ ও ফিডব্যাক" },
  { href: "/admin/settings", icon: Settings, label: "সাইট সেটিংস" },
];

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const { state, setOpen } = useSidebar();


  const isSubItemActive = (subItems: any[]) => {
    return subItems.some((item) => pathname.startsWith(item.href));
  }

  const getAccordionDefaultValue = () => {
    const activeItem = navItems.find(item => item.subItems && isSubItemActive(item.subItems));
    if (activeItem) {
        if (pathname.startsWith('/admin/committee') || pathname.startsWith('/admin/staff') || pathname.startsWith('/admin/gallery')) return activeItem.label;
    }
    return activeItem ? activeItem.label : undefined;
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <Link href="/" className="flex items-center gap-2" target="_blank">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-primary truncate group-data-[collapsible=icon]:hidden">হোম পেজ</span>
            </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) =>
            item.subItems ? (
              <Accordion key={item.label} type="single" collapsible defaultValue={getAccordionDefaultValue()} className="w-full">
                <AccordionItem value={item.label} className="border-b-0">
                  <AccordionTrigger 
                    onClick={() => {
                        if (state === 'collapsed') {
                            setOpen(true);
                        }
                    }}
                    className={cn("hover:no-underline hover:bg-sidebar-accent p-2 rounded-md group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-8", isSubItemActive(item.subItems) && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pl-7 group-data-[collapsible=icon]:hidden">
                    <div className="flex flex-col gap-1 mt-1 border-l border-sidebar-border">
                        {item.subItems.map((subItem) => (
                             <SidebarMenuItem key={subItem.href} className="pl-2">
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith(subItem.href)}
                                    tooltip={subItem.label}
                                    size="sm"
                                    className="h-auto py-1.5"
                                >
                                    <Link href={subItem.href}>
                                    <subItem.icon />
                                    <span>{subItem.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                                </SidebarMenuItem>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href!}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
