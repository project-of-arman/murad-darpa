import NoticeBoard from '@/components/homepage/notice-board';
import AboutSchool from '@/components/homepage/about-school';
import TeachersCarousel from '@/components/homepage/teachers-carousel';
import VideoGallery from '@/components/homepage/video-gallery';
import ImportantLinks from '@/components/homepage/important-links';
import ImageGallery from '@/components/school-details/image-gallery';
import { getAboutSchool, getSchoolFeatures } from '@/lib/school-data';
import { getTeachers } from '@/lib/teacher-data';
import { getNotices } from '@/lib/notice-data';
import { getGalleryImages } from '@/lib/gallery-data';
import { getVideos } from '@/lib/video-data';
import { getImportantLinkGroups } from '@/lib/important-links-data';


export default async function Home() {
    const [
        aboutInfo, 
        features, 
        teachers,
        notices,
        galleryImages,
        videos,
        importantLinkGroups
    ] = await Promise.all([
        getAboutSchool(),
        getSchoolFeatures(),
        getTeachers(),
        getNotices(),
        getGalleryImages(),
        getVideos(),
        getImportantLinkGroups()
    ]);

  return (
    <div className="space-y-12">
        <NoticeBoard notices={notices} />
        <AboutSchool aboutInfo={aboutInfo} features={features} />
        <div className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
            <ImportantLinks linkGroups={importantLinkGroups} />
        </div>
        </div>
        <div className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
            <TeachersCarousel teachers={teachers} />
        </div>
        </div>
        <div className="bg-white py-12 sm:py-16 lg:py-20">
            <div className="container mx-auto px-4">
                <ImageGallery images={galleryImages} />
            </div>
        </div>
        <VideoGallery videos={videos} />
    </div>
  );
}
