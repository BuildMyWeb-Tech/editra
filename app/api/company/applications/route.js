import prisma from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    console.log("🔥 COMPANY APPLICATIONS ROUTE HIT")

    const { userId } = getAuth(req)
    console.log("👤 Clerk userId:", userId)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🧠 Prisma models:", Object.keys(prisma))

    // ✅ FIXED MODEL NAME HERE
    const company = await prisma.company.findUnique({
      where: { userId }
    })

    console.log("🏢 Company found:", company)

    if (!company) {
      return NextResponse.json({ applications: [] })
    }

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
            user: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    console.log("📄 Applications found:", applications.length)

    return NextResponse.json({ applications })

  } catch (err) {
    console.error("🔥 COMPANY GET ERROR:", err)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { applicationId, status } = await req.json()

    const company = await prisma.company.findUnique({
      where: { userId }
    })

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    // ✅ Ensure application belongs to this company
    const application = await prisma.jobApplication.findMany({
  where: {
    job: {
      companyId: company.id
    }
  },
  include: {
    job: true,
    editor: {
      include: {
        user: true
      }
    }
  },
  orderBy: { createdAt: "desc" }
})

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const updated = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status }
    })

    return NextResponse.json({ success: true, updated })

  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}