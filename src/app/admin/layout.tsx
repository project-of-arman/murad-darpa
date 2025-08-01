
"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import LoginPage from './login/page';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import AdminSidebarNav from '@/components/admin/sidebar-nav';
import AdminHeader from '@/components/admin/header';
import { hasAdminAccount, login, getLoggedInUser } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';
import AdminSetupPage from './setup/page';
import LogoLoader from '@/components/admin/logo-loader';
import type { AdminAccount } from '@/lib/actions/auth-actions';

function AdminLayoutContainer({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [user, setUser] = useState<AdminAccount | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const exists = await hasAdminAccount();
      setAdminExists(exists);
      const session = sessionStorage.getItem('isAdminAuthenticated');
      const identifier = sessionStorage.getItem('adminIdentifier');
      if (session === 'true' && identifier) {
          setIsAuthenticated(true);
          const loggedInUser = await getLoggedInUser(identifier);
          setUser(loggedInUser);
      }
    }
    checkAdmin();
  }, []);

  const handleLoginSuccess = async (identifier: string) => {
    sessionStorage.setItem('isAdminAuthenticated', 'true');
    sessionStorage.setItem('adminIdentifier', identifier);
    setIsAuthenticated(true);
    const loggedInUser = await getLoggedInUser(identifier);
    setUser(loggedInUser);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    sessionStorage.removeItem('adminIdentifier');
    setIsAuthenticated(false);
    setUser(null);
  };
  
  const handleSetupSuccess = () => {
      setAdminExists(true);
  }

  if (adminExists === null || (isAuthenticated && !user)) {
      return <LogoLoader />;
  }

  if (!adminExists) {
      return <AdminSetupPage onSetupSuccess={handleSetupSuccess} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }
  
  if (!user) {
      return <LogoLoader />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
        <Sidebar collapsible="icon">
          <AdminSidebarNav userRole={user.role} />
        </Sidebar>
        <div className="flex flex-col flex-1">
            <AdminHeader onLogout={handleLogout} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        // @ts-ignore
                        return React.cloneElement(child, { userRole: user.role });
                    }
                    return child;
                })}
            </main>
        </div>
    </SidebarProvider>
  );
}


export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <React.Suspense fallback={<LogoLoader />}>
            <AdminLayoutContainer>{children}</AdminLayoutContainer>
        </React.Suspense>
    )
}
