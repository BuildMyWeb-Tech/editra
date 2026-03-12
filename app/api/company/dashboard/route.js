import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = await authSeller(userId);

    if (!companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Total jobs
    const totalJobs = await prisma.job.count({
      where: { companyId }
    });

    // Completed jobs (job closed OR has completed application)
    const completedJobs = await prisma.job.count({
      where: {
        companyId,
        OR: [
          { isOpen: false },
          {
            applications: {
              some: {
                status: "COMPLETED"
              }
            }
          }
        ]
      }
    });

    // Total applications
    const totalApplications = await prisma.jobApplication.count({
      where: {
        job: { companyId }
      }
    });

    // Accepted (Hired)
    const acceptedApplications = await prisma.jobApplication.count({
      where: {
        job: { companyId },
        status: "HIRED"
      }
    });

    // Pending
    const pendingApplications = await prisma.jobApplication.count({
      where: {
        job: { companyId },
        status: {
          in: ["APPLIED", "IN_REVIEW"]
        }
      }
    });

    // Completed Applications
    const completedApplications = await prisma.jobApplication.count({
      where: {
        job: { companyId },
        status: "COMPLETED"
      }
    });

    return NextResponse.json({
      totalJobs,
      completedJobs,
      totalApplications,
      acceptedApplications,
      pendingApplications,
      completedApplications
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}