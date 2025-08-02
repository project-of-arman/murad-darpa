
"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import LoginPage from './login/page';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import AdminSidebarNav from '@/components/admin/sidebar-nav';
import AdminHeader from '@/components/admin/header';
import { hasAdminAccount, login, getLoggedInUser, AdminAccount } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';
import AdminSetupPage from './setup/page';
import LogoLoader from '@/components/admin/logo-loader';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setUser, selectUser, selectRole, clearUser } from '@/lib/redux/slices/user-slice';
import NextNProgress from 'nextjs-progressbar';

function AdminLayoutContainer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userRole = useAppSelector(selectRole);
  
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    async function checkAdmin() {
      const exists = await hasAdminAccount();
      setAdminExists(exists);
      
      const sessionIdentifier = sessionStorage.getItem('adminIdentifier');
      if (sessionIdentifier) {
        setIsAuthenticated(true);
        if (!user) { // Fetch user if not already in store
            const loggedInUser = await getLoggedInUser(sessionIdentifier);
            if (loggedInUser) {
                dispatch(setUser(loggedInUser));
            } else {
                 handleLogout(); // Could not find user, log out
            }
        }
      } else {
          setIsAuthenticated(false);
      }
    }
    checkAdmin();
  }, [dispatch, user]);

  const handleLoginSuccess = async (identifier: string) => {
    sessionStorage.setItem('adminIdentifier', identifier);
    setIsAuthenticated(true);
    const loggedInUser = await getLoggedInUser(identifier);
    if (loggedInUser) {
        dispatch(setUser(loggedInUser));
    }
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('adminIdentifier');
    setIsAuthenticated(false);
    dispatch(clearUser());
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
  
  if (!user || !userRole) {
      return <LogoLoader />;
  }

  return (
    <>
      <NextNProgress color="hsl(var(--primary))" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
      <SidebarProvider defaultOpen={true}>
          <Sidebar collapsible="icon">
            <AdminSidebarNav userRole={userRole} />
          </Sidebar>
          <div className="flex flex-col flex-1">
              <AdminHeader onLogout={handleLogout} />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
                  {children}
              </main>
          </div>
      </SidebarProvider>
    </>
  );
}


export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <React.Suspense fallback={<LogoLoader />}>
            <AdminLayoutContainer>{children}</AdminLayoutContainer>
        </React.Suspense>
    )
}
