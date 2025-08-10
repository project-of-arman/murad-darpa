
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { getSiteSettings } from "@/lib/settings-data";
import SettingsForm from "@/components/admin/settings/settings-form";
import SchoolInfoForm from "@/components/admin/settings/school-info-form";
import AdminAccountForm from "@/components/admin/settings/admin-account-form";
import type { SchoolInfo } from "@/lib/school-data";
import { toDataURL } from "@/lib/utils";


export default async function AdminSettingsPage() {
  const settingsData = await getSiteSettings();
  
  // Convert any buffer data to base64 strings before passing to client components
  const settings = {
      ...settingsData,
      favicon_url: settingsData?.favicon_url ? toDataURL(settingsData?.favicon_url as Buffer) : null,
      school_logo_url: settingsData?.school_logo_url ? toDataURL(settingsData?.school_logo_url as Buffer) : '',
  };

  const schoolInfo: SchoolInfo = {
      id: settings?.school_id,
      name: settings?.school_name,
      address: settings?.school_address,
      logo_url: settings?.school_logo_url,
      mpo_code: settings?.mpo_code,
      eiin_number: settings?.eiin_number,
  }

  return (
    <div className="space-y-6">
        <div className="text-left mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">সেটিংস</h1>
            <p className="text-muted-foreground mt-1">
                আপনার ওয়েবসাইটের সাধারণ সেটিংস, স্কুলের তথ্য এবং অ্যাডমিন অ্যাকাউন্ট পরিচালনা করুন।
            </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">অ্যাকাউন্ট</TabsTrigger>
                <TabsTrigger value="site_settings">সাইট সেটিংস</TabsTrigger>
                <TabsTrigger value="school_info">স্কুলের তথ্য</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                 <Card>
                    <CardHeader>
                        <CardTitle>আমার অ্যাকাউন্ট</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-muted-foreground -mt-4">
                            আপনার অ্যাকাউন্টের তথ্য এবং পাসওয়ার্ড পরিবর্তন করুন।
                        </p>
                        <AdminAccountForm />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="site_settings">
                <Card>
                    <CardHeader>
                        <CardTitle>সাইট সেটিংস</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <p className="text-muted-foreground -mt-4">
                            এই তথ্যগুলো আপনার ওয়েবসাইটের SEO এবং ব্রাউজার ট্যাবে ব্যবহৃত হবে।
                        </p>
                        <SettingsForm settings={settings} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="school_info">
                <Card>
                    <CardHeader>
                        <CardTitle>স্কুলের তথ্য</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-muted-foreground -mt-4">
                            ওয়েবসাইটের বিভিন্ন জায়গায় প্রদর্শিত স্কুলের নাম, ঠিকানা ও লোগো এখান থেকে পরিবর্তন করুন।
                        </p>
                        <SchoolInfoForm schoolInfo={schoolInfo} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
