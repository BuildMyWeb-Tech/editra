import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Auth Company
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const companyId = await authSeller(userId);

    if (!companyId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const companyInfo = await prisma.company.findUnique({
      where: { id: companyId }
    });

    return NextResponse.json({ isSeller: true, companyInfo });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}