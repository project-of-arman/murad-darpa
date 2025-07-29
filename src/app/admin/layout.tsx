
"use client";

import { useState, ReactNode } from 'react';
import LoginPage from './login/page';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import AdminSidebarNav from '@/components/admin/sidebar-nav';
import AdminHeader from '@/components/admin/header';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <AdminSidebarNav />
        </Sidebar>
        <div className="flex flex-col flex-1">
            <AdminHeader onLogout={handleLogout} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
                {children}
            </main>
        </div>
    </SidebarProvider>
  );
}
