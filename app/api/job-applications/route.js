import prisma from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

/* ===============================
   APPLY TO JOB
================================*/
export async function POST(req) {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobId, proposal } = await req.json()

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 })
    }

    // Find editor profile
    const editor = await prisma.editorProfile.findUnique({
      where: { userId },
    })

    if (!editor) {
      return NextResponse.json(
        { error: "Please complete your profile before applying" },
        { status: 400 }
      )
    }

    // Check job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return NextResponse.json(
        { error: "Job does not exist" },
        { status: 400 }
      )
    }

    // Prevent duplicate application
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobId_editorId: {
          jobId,
          editorId: editor.id,
        },
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job." },
        { status: 400 }
      )
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        editorId: editor.id,
        proposal: proposal || "",
        status: "APPLIED",
      },
    })

    return NextResponse.json({
      message: "Application submitted successfully",
      application,
    })

  } catch (err) {
    console.error("JOB APPLICATION ERROR:", err)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

/* ===============================
   GET MY APPLICATIONS
================================*/
export async function GET(req) {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return NextResponse.json({ applications: [] })
    }

    const editor = await prisma.editorProfile.findUnique({
      where: { userId },
    })

    if (!editor) {
      return NextResponse.json({ applications: [] })
    }

    const applications = await prisma.jobApplication.findMany({
      where: { editorId: editor.id },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ applications })

  } catch (err) {
    console.error("GET APPLICATIONS ERROR:", err)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}