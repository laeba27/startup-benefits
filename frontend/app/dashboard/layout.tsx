'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DashboardShell } from '@/components/dashboard/layout/DashboardShell';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // If still loading auth, show loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    redirect('/login');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
