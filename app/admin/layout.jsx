import AdminLayout from "@/components/admin/AdminLayout";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Editra - Admin Panel",
  description: "Editra Admin Dashboard - Manage Companies, Jobs & Applications",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <SignedIn>
        <AdminLayout>
          {children}
        </AdminLayout>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Editra Admin Panel
          </h1>
          <p className="text-slate-500 mb-6">
            Sign in to manage your freelance editor platform
          </p>
          <SignIn fallbackRedirectUrl="/admin" routing="hash" />
        </div>
      </SignedOut>
    </>
  );
}