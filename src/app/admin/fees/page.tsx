
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFeeTypes, getFeeCollections } from "./actions";
import { getStudents } from "@/lib/student-data";
import FeeTypesManager from "@/components/admin/fees/fee-types-manager";
import FeeCollectionsManager from "@/components/admin/fees/fee-collections-manager";

export default async function FeesPage({ searchParams }: { searchParams: { class: string }}) {
  const selectedClass = searchParams.class || 'all';

  const [feeTypes, students, collections] = await Promise.all([
    getFeeTypes(),
    getStudents(),
    getFeeCollections({ class_name: selectedClass }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ফি ও পেমেন্ট ব্যবস্থাপনা</h1>

      <Tabs defaultValue="collections" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="collections">ফি কালেকশন</TabsTrigger>
          <TabsTrigger value="types">ফির প্রকারভেদ</TabsTrigger>
        </TabsList>
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
              />
            </CardContent>
          </Card>
        </TabsContent>
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
      </Tabs>
    </div>
  );
}
