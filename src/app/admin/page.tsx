
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, FileText, Newspaper, Users, School } from "lucide-react";
import { getDashboardStats, getApplicationCounts } from "@/lib/admin-data";
import ApplicationsChart from "@/components/admin/dashboard/applications-chart";

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();
    const applicationCounts = await getApplicationCounts();

    return (
        <>
            <div className="text-left mb-8">
                <h1 className="text-3xl font-bold text-primary">অ্যাডমিন ড্যাশবোর্ড</h1>
                <p className="text-muted-foreground mt-1">এখান থেকে আপনার ওয়েবসাইটের কনটেন্ট এবং ফিচার পরিচালনা করুন।</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">মোট নোটিশ</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.noticeCount}</div>
                        <p className="text-xs text-muted-foreground">স্কুলের নোটিশ পরিচালনা করুন</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">মোট শিক্ষার্থী</CardTitle>
                        <School className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.studentCount}</div>
                        <p className="text-xs text-muted-foreground">শিক্ষার্থীদের তথ্য দেখুন</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">মোট শিক্ষক</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.teacherCount}</div>
                        <p className="text-xs text-muted-foreground">শিক্ষকদের তথ্য পরিচালনা করুন</p>
                    </CardContent>
                </Card>
                 <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ভর্তি আবেদন</CardTitle>
                        <Newspaper className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.admissionApplicationsCount}</div>
                         <p className="text-xs text-muted-foreground">নতুন ভর্তির আবেদন দেখুন</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart className="h-5 w-5" />
                            আবেদনের পরিসংখ্যান
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ApplicationsChart data={applicationCounts} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
