
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarouselForm } from "@/components/admin/gallery/carousel-form";

export default function NewCarouselItemPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন স্লাইড যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <CarouselForm />
      </CardContent>
    </Card>
  );
}
