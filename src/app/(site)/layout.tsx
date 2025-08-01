
import Footer from '@/components/footer';
import HeroCarousel from '@/components/homepage/hero-carousel';
import SecondaryNav from '@/components/homepage/secondary-nav';
import DynamicSidebar from '@/components/homepage/dynamic-sidebar';
import SiteHeaderClientWrapper from '@/components/homepage/site-header-client-wrapper';
import { getNotices } from '@/lib/notice-data';
import { getSchoolInfo } from '@/lib/school-data';

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [schoolInfo, marqueeNotices] = await Promise.all([
    getSchoolInfo(),
    getNotices({ is_marquee: true })
  ]);
  
  return (
    <div className="relative flex min-h-screen flex-col">
        <SiteHeaderClientWrapper schoolInfo={schoolInfo} marqueeNotices={marqueeNotices} />
        <HeroCarousel />
        <SecondaryNav schoolName={schoolInfo.name} />
        <main className="flex-1">
            <div className="container mx-auto py-12 sm:py-16 lg:py-20 ">
                <div className="grid grid-cols-10 gap-8"> 
                <div className="col-span-10 lg:col-span-7 xl:col-span-8">
                    {children}
                </div>
                <div className="col-span-10 lg:col-span-3 xl:col-span-2">
                    <DynamicSidebar />
                </div>
                </div>
            </div>
        </main>
      <Footer />
    </div>
  );
}
