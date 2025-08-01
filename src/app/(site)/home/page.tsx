import NoticeBoard from '@/components/homepage/notice-board';
import AboutSchool from '@/components/homepage/about-school';
import TeachersCarousel from '@/components/homepage/teachers-carousel';
import VideoGallery from '@/components/homepage/video-gallery';
import ImportantLinks from '@/components/homepage/important-links';
import ImageGallery from '@/components/school-details/image-gallery';


export default function Home() {
  return (
    <div className="space-y-12">
        <NoticeBoard />
        <AboutSchool />
        <div className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
            <ImportantLinks />
        </div>
        </div>
        <div className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
            <TeachersCarousel />
        </div>
        </div>
        <div className="bg-white py-12 sm:py-16 lg:py-20">
            <div className="container mx-auto px-4">
                <ImageGallery />
            </div>
        </div>
        <VideoGallery />
    </div>
  );
}
