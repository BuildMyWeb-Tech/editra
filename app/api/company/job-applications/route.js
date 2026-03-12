import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1️⃣ Get company owned by logged-in user
    const company = await prisma.company.findUnique({
      where: { userId }
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Get applications for this company's jobs
    const applications = await prisma.jobApplication.findMany({
      where: {
        job: {
          companyId: company.id
        }
      },
      include: {
        job: true,
        editor: {
          include: {
            user: true // ✅ IMPORTANT FIX
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ applications });

  } catch (error) {
    console.error("COMPANY APPLICATION ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}