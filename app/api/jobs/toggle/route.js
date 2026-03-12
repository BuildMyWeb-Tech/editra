import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"

export async function POST(req) {
  try {
    const { userId } = getAuth(req)
    const { jobId } = await req.json()

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID required" },
        { status: 400 }
      )
    }

    // Find company of logged-in user
    const company = await prisma.company.findFirst({
      where: { userId }
    })

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      )
    }

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        companyId: company.id
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        isOpen: !job.isOpen
      }
    })

    return NextResponse.json({
      message: "Job status updated",
      job: updatedJob
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}