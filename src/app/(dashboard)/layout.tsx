import { AuthProvider } from "../../components/AuthProvider";
import DashboardLayoutInner from "../../components/DashboardLayoutInner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </AuthProvider>
  );
} 