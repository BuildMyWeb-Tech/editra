import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Editra — Hire Professional Video Editors",
  description:
    "Editra connects companies with skilled freelance video editors. Post jobs, hire editors, and collaborate seamlessly.",
  keywords: [
    "video editors",
    "freelance editors",
    "hire video editor",
    "editing jobs",
    "freelance editing platform",
  ],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased bg-gray-50`}>
          <StoreProvider>
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: "10px",
                  background: "#1e293b",
                  color: "#fff",
                },
              }}
            />

            {children}

          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}