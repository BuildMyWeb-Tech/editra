import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const usernameParam = searchParams.get("username")

    if (!usernameParam) {
      return NextResponse.json(
        { error: "Missing username" },
        { status: 400 }
      )
    }

    const username = usernameParam.toLowerCase()

    const company = await prisma.company.findUnique({
      where: {
        username,
        isActive: true
      },
      include: {
        jobs: {
          where: { isOpen: true },
          orderBy: { createdAt: "desc" }
        }
      }
    })

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ company })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}