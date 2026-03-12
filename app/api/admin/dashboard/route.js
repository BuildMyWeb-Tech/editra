import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {

    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "not authorized" },
        { status: 401 }
      );
    }

    // ===============================
    // REAL DATABASE STATS
    // ===============================

    const totalCompanies = await prisma.company.count();

    const totalJobs = await prisma.job.count();

    const totalApplications = await prisma.jobApplication.count();

    const dashboardData = {
      totalCompanies,
      totalJobs,
      totalApplications
    };

    return NextResponse.json({ dashboardData });

  } catch (error) {

    console.error("ADMIN DASHBOARD ERROR:", error);

    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );

  }
}