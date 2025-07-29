
"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import LoginPage from './login/page';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import AdminSidebarNav from '@/components/admin/sidebar-nav';
import AdminHeader from '@/components/admin/header';
import { hasAdminAccount, login } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';
import AdminSetupPage from './setup/page';
import MatrixLoader from '@/components/admin/matrix-loader';

function AdminLayoutContainer({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const exists = await hasAdminAccount();
      setAdminExists(exists);
      const session = sessionStorage.getItem('isAdminAuthenticated');
      if (session === 'true') {
          setIsAuthenticated(true);
      }
    }
    checkAdmin();
  }, []);

  const handleLoginSuccess = () => {
    sessionStorage.setItem('isAdminAuthenticated', 'true');
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
  };
  
  const handleSetupSuccess = () => {
      setAdminExists(true);
  }

  if (adminExists === null) {
      return <MatrixLoader />;
  }

  if (!adminExists) {
      return <AdminSetupPage onSetupSuccess={handleSetupSuccess} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
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


export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <React.Suspense fallback={<MatrixLoader />}>
            <AdminLayoutContainer>{children}</AdminLayoutContainer>
        </React.Suspense>
    )
}
