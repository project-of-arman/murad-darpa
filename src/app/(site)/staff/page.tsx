
"use client";

import { getStaff, Staff } from "@/lib/staff-data";
import { getTeachers, Teacher } from "@/lib/teacher-data";
import StaffList from "./staff-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from 'react';

const StaffSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {Array.from({length: 4}).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
)

export default function StaffPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [teachersData, staffData] = await Promise.all([getTeachers(), getStaff()]);
      setTeachers(teachersData);
      setStaff(staffData);
      setLoading(false);
    }
    fetchData();
  }, []);

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
              {loading ? <StaffSkeleton /> : <StaffList members={teachers} memberType="teachers" />}
            </TabsContent>
            <TabsContent value="staff">
              {loading ? <StaffSkeleton /> : <StaffList members={staff} memberType="staff" />}
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
