"use client";

import { useAuth } from "./AuthProvider";
import Sidebar from "./Sidebar";

export default function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex">
      {user && <Sidebar />}
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  );
} 