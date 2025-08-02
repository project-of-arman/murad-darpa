
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFeeTypes, getFeeCollections } from "./actions";
import { getStudents } from "@/lib/student-data";
import FeeTypesManager from "@/components/admin/fees/fee-types-manager";
import FeeCollectionsManager from "@/components/admin/fees/fee-collections-manager";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";
import { useEffect, useState } from "react";
import type { FeeType, FeeCollection } from "./actions";
import type { Student } from "@/lib/student-data";
import { useSearchParams } from "next/navigation";


export default function FeesPage() {
  const searchParams = useSearchParams();
  const selectedClass = searchParams.get('class') || 'all';
  const userRole = useAppSelector(selectRole);

  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [collections, setCollections] = useState<FeeCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        const [feeTypesData, studentsData, collectionsData] = await Promise.all([
            getFeeTypes(),
            getStudents(),
            getFeeCollections({ class_name: selectedClass }),
        ]);
        setFeeTypes(feeTypesData);
        setStudents(studentsData);
        setCollections(collectionsData);
        setLoading(false);
    }
    fetchData();
  }, [selectedClass]);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ফি ও পেমেন্ট ব্যবস্থাপনা</h1>

      <Tabs defaultValue="collections" className="w-full">
        {userRole !== 'visitor' && (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="collections">ফি কালেকশন</TabsTrigger>
              <TabsTrigger value="types">ফির প্রকারভেদ</TabsTrigger>
            </TabsList>
        )}
        <TabsContent value="collections">
          <Card>
            <CardHeader>
              <CardTitle>ফি কালেকশন</CardTitle>
            </CardHeader>
            <CardContent>
              <FeeCollectionsManager 
                initialCollections={collections} 
                students={students} 
                feeTypes={feeTypes}
                selectedClass={selectedClass}
                userRole={userRole || 'visitor'}
              />
            </CardContent>
          </Card>
        </TabsContent>
        {userRole !== 'visitor' && (
          <TabsContent value="types">
            <Card>
              <CardHeader>
                <CardTitle>ফির প্রকারভেদ</CardTitle>
              </CardHeader>
              <CardContent>
                <FeeTypesManager initialFeeTypes={feeTypes} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
