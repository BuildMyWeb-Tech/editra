import CompanyLayout from "@/components/company/CompanyLayout";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Editra - Company Panel",
  description: "Manage your jobs and applications",
};

export default function RootCompanyLayout({ children }) {
  return (
    <>
      <SignedIn>
        <CompanyLayout>
          {children}
        </CompanyLayout>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <SignIn fallbackRedirectUrl="/company" routing="hash" />
        </div>
      </SignedOut>
    </>
  );
}