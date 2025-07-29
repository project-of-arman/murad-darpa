
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { getStaffById } from "@/lib/staff-data";


export default async function StaffDetailsPage({ params }: { params: { id: string } }) {
  const staff = await getStaffById(params.id);

  if (!staff) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">কর্মচারী পাওয়া যায়নি।</h1>
        <Button asChild className="mt-4">
          <Link href="/staff">
            <ArrowLeft className="mr-2 h-4 w-4" />
            তালিকায় ফিরে যান
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-8">
                <Button asChild variant="outline">
                  <Link href="/staff">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    তালিকায় ফিরে যান
                  </Link>
                </Button>
            </div>
            <Card className="shadow-lg border-primary/20">
              <div className="flex flex-col md:flex-row gap-0">
                  <div className="w-full md:w-1/3 relative aspect-[3/4] md:aspect-auto">
                      <Image 
                        src={staff.image} 
                        alt={staff.name} 
                        fill 
                        className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none" 
                        data-ai-hint={staff.dataAiHint} 
                      />
                  </div>
                  <div className="w-full md:w-2/3">
                      <CardHeader>
                          <CardTitle className="text-3xl text-primary font-headline">{staff.name}</CardTitle>
                          <p className="text-muted-foreground text-lg">{staff.role}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          {staff.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
                                <a href={`mailto:${staff.email}`} className="text-muted-foreground hover:text-primary">{staff.email}</a>
                            </div>
                          )}
                          {staff.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
                                <a href={`tel:${staff.phone}`} className="text-muted-foreground hover:text-primary">{staff.phone}</a>
                            </div>
                          )}
                          {staff.address && (
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
                                <span className="text-muted-foreground">{staff.address}</span>
                            </div>
                          )}
                      </CardContent>
                  </div>
              </div>
            </Card>
        </div>
    </div>
  );
}
