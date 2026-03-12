"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function WaitingApproval() {

  const { getToken } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const checkCompanyStatus = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(
        "/api/company/data",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const company = data?.company;

      if (!company) {
        router.push("/create-company");
        return;
      }

      if (company.status === "APPROVED") {
        router.push("/company");
        return;
      }

      if (company.status === "REJECTED") {
        router.push("/create-company");
        return;
      }

    } catch (error) {
      console.error(error);
      router.push("/create-company");
    }

    setLoading(false);
  };

  useEffect(() => {
    checkCompanyStatus();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold">
          Your company application is under review
        </h1>

        <p className="mt-4 text-slate-500">
          Our team is reviewing your company profile.
          This usually takes a few hours.
        </p>

        <p className="mt-2 text-slate-400 text-sm">
          Once approved, you will gain access to the company dashboard.
        </p>
      </div>
    </div>
  );
}