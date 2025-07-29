
"use client";

import Link from 'next/link';
import { ChevronDown, Home, Menu, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { getNavLinks, NavLink as NavLinkType } from '@/lib/nav-data';
import * as LucideIcons from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


type IconName = keyof typeof LucideIcons;

const IconComponent = ({ name }: { name: string | null | undefined }) => {
    if (!name) return null;
    const Icon = LucideIcons[name as IconName] as React.ElementType;
    if (!Icon) {
        return null;
    }
    return <Icon className="h-4 w-4" />;
};


const NavLink = ({ href, children, className, icon, isActive }: { href: string; children: React.ReactNode, className?: string, icon?: string | null, isActive: boolean }) => {
  return (
    <Link 
      href={href}
      className={cn(
          'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary border px-3 py-1.5 rounded-md border-transparent',
          isActive ? 'text-primary border-primary bg-primary/10' : 'text-foreground/80',
          className
        )}
    >
      <IconComponent name={icon} />
      <span>{children}</span>
    </Link>
  );
};

const NavDropdown = ({ title, subLinks, className, isActive }: { title: string; subLinks: NavLinkType[], className?: string, isActive: boolean }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary hover:bg-transparent border px-3 py-1.5 rounded-md border-transparent',
            isActive ? 'text-primary border-primary bg-primary/10' : 'text-foreground/80',
            className
          )}
        >
          {title}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {subLinks.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href!}>{link.title}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function SecondaryNav({ schoolName }: { schoolName: string }) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [isSticky, setIsSticky] = React.useState(false);
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const [navLinks, setNavLinks] = React.useState<NavLinkType[]>([]);
  const pathname = usePathname();
  
  React.useEffect(() => {
    setIsMounted(true);
    
    async function fetchNavLinks() {
        const links = await getNavLinks();
        setNavLinks(links);
    }
    fetchNavLinks();

    const handleScroll = () => {
      const heroCarouselHeight = 600; 
      if (window.scrollY > heroCarouselHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const navClasses = cn(
    "h-16 flex items-center justify-start border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
    isMounted && isSticky && "sticky top-0 z-40"
  );

  return (
    <nav className={navClasses}>
        <div className="container mx-auto flex items-center justify-between gap-6 px-4">
            <div className="hidden lg:flex items-center justify-start gap-2">
                {navLinks.map((link) =>
                    link.subLinks && link.subLinks.length > 0 ? (
                    <NavDropdown 
                      key={link.id} 
                      title={link.title} 
                      subLinks={link.subLinks} 
                      isActive={isMounted && link.subLinks.some(subLink => subLink.href && pathname.startsWith(subLink.href))}
                    />
                    ) : (
                    <NavLink key={link.id} href={link.href!} icon={link.icon} isActive={isMounted && pathname === link.href!}>
                        {link.title}
                    </NavLink>
                    )
                )}
            </div>
             <div className="lg:hidden flex items-center gap-2">
                 <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
                    <SheetTrigger asChild>
                       <Button variant="outline" className="w-auto justify-start">
                         <Menu className="mr-2 h-6 w-6" />
                         <span>মেনু</span>
                       </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-sm flex flex-col">
                        <SheetHeader>
                            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                            <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                            <GraduationCap className="h-7 w-7 text-primary" />
                            <span className="text-xl font-bold text-primary">মেনু</span>
                            </Link>
                        </SheetHeader>
                        <ScrollArea className="flex-grow">
                            <nav className="mt-8 flex flex-col gap-2 pr-4">
                                {navLinks.map((link) =>
                                (link.subLinks && link.subLinks.length > 0) ? (
                                    <Accordion type="single" collapsible key={link.id} className="w-full">
                                    <AccordionItem value={link.title} className="border-b-0">
                                        <AccordionTrigger className="text-base font-medium py-3 hover:no-underline">{link.title}</AccordionTrigger>
                                        <AccordionContent>
                                        <div className="pl-4 flex flex-col gap-4 border-l ml-2">
                                            {link.subLinks.map((subLink) => (
                                            <Link key={subLink.id} href={subLink.href!} className="text-base" onClick={() => setMenuOpen(false)} >
                                                {subLink.title}
                                            </Link>
                                            ))}
                                        </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    </Accordion>
                                ) : (
                                    <Link key={link.id} href={link.href!} className="text-base flex items-center gap-2 py-3" onClick={() => setMenuOpen(false)}>
                                     <IconComponent name={link.icon} />
                                    {link.title}
                                    </Link>
                                )
                                )}
                            </nav>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
                <p className="text-sm sm:hiddin font-medium text-primary">{schoolName}</p>
            </div>
          
        </div>
    </nav>
  );
}
