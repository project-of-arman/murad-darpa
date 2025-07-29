
import { getStaff } from "@/lib/staff-data";
import { getTeachers } from "@/lib/teacher-data";
import StaffList from "./staff-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default async function StaffPage() {
  const teachers = await getTeachers();
  const staff = await getStaff();

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">শিক্ষক ও কর্মচারী</h1>
          <p className="text-muted-foreground mt-2">আমাদের প্রতিষ্ঠানের নিবেদিতপ্রাণ শিক্ষক এবং কর্মচারীবৃন্দ</p>
        </div>

        <Tabs defaultValue="teachers" className="w-full">
            <div className="flex justify-center mb-8">
                <TabsList>
                    <TabsTrigger value="teachers">শিক্ষক</TabsTrigger>
                    <TabsTrigger value="staff">কর্মচারী</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="teachers">
              <StaffList members={teachers} memberType="teachers" />
            </TabsContent>
            <TabsContent value="staff">
              <StaffList members={staff} memberType="staff" />
            </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
