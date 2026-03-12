import { getAuth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import imagekit from "@/configs/imageKit"

export async function GET(req) {

  const { userId } = getAuth(req)

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const profile = await prisma.editorProfile.findUnique({
    where: { userId }
  })

  return NextResponse.json({ profile })
}

export async function POST(req) {

  const { userId } = getAuth(req)

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 🔹 Get real Clerk user
  const clerkUser = await currentUser()

  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()

  const email =
    clerkUser.emailAddresses?.[0]?.emailAddress || ""

  const image = clerkUser.imageUrl || ""

  const formData = await req.formData()

  const phone = formData.get("phone")
  const experience = formData.get("experience")
  const portfolio = formData.get("portfolio")
  const youtube = formData.get("youtube")
  const instagram = formData.get("instagram")

  const skills = JSON.parse(formData.get("skills") || "[]")
  const software = JSON.parse(formData.get("software") || "[]")

  const resume = formData.get("resume")

  let resumeUrl = null

  // 🔹 Upload resume if provided
  if (resume && resume.size > 0) {

    const buffer = Buffer.from(await resume.arrayBuffer())

    const upload = await imagekit.upload({
      file: buffer,
      fileName: resume.name,
      folder: "resumes"
    })

    resumeUrl = upload.url
  }

  // 🔹 Sync Clerk user with DB
  await prisma.user.upsert({
    where: { id: userId },

    update: {
      name,
      email,
      image
    },

    create: {
      id: userId,
      name,
      email,
      image,
      cart: {}
    }
  })

  // 🔹 Save editor profile
  const profile = await prisma.editorProfile.upsert({

    where: { userId },

    update: {
      phone,
      skills,
      experience,
      portfolio,
      youtube,
      instagram,
      software,
      ...(resumeUrl && { resumeUrl })
    },

    create: {
      userId,
      phone,
      skills,
      experience,
      portfolio,
      youtube,
      instagram,
      software,
      resumeUrl
    }

  })

  return NextResponse.json({ profile })
}