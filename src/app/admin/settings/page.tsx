
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getSiteSettings } from "@/lib/settings-data";
import SettingsForm from "@/components/admin/settings/settings-form";
import SchoolInfoForm from "@/components/admin/settings/school-info-form";
import AdminAccountForm from "@/components/admin/settings/admin-account-form";
import type { SchoolInfo } from "@/lib/school-data";
import { getAdminUsername } from "@/lib/actions/auth-actions";
import { toDataURL } from "@/lib/utils";

export default async function AdminSettingsPage() {
  const [settingsData, username] = await Promise.all([
    getSiteSettings(),
    getAdminUsername()
  ]);
  
  // Convert any buffer data to base64 strings before passing to client components
  const settings = {
      ...settingsData,
      favicon_url: settingsData.favicon_url ? toDataURL(settingsData.favicon_url as Buffer) : null,
      school_logo_url: settingsData.school_logo_url ? toDataURL(settingsData.school_logo_url as Buffer) : '',
  };

  const schoolInfo: SchoolInfo = {
      id: settings.school_id,
      name: settings.school_name,
      address: settings.school_address,
      logo_url: settings.school_logo_url
  }

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>সাইট সেটিংস</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">
                এই তথ্যগুলো আপনার ওয়েবসাইটের SEO এবং ব্রাউজার ট্যাবে ব্যবহৃত হবে।
                </p>
                <SettingsForm settings={settings} />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>স্কুলের তথ্য</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">
                ওয়েবসাইটের বিভিন্ন জায়গায় প্রদর্শিত স্কুলের নাম, ঠিকানা ও লোগো এখান থেকে পরিবর্তন করুন।
                </p>
                <SchoolInfoForm schoolInfo={schoolInfo} />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>অ্যাডমিন অ্যাকাউন্ট</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">
                আপনার অ্যাডমিন ইউজারনেম এবং পাসওয়ার্ড পরিবর্তন করুন।
                </p>
                <AdminAccountForm username={username || ''} />
            </CardContent>
        </Card>
    </div>
  );
}
