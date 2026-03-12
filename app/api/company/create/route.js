import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// create company
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username")?.trim();
    const description = formData.get("description");
    const email = formData.get("email");
    const phone = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    if (!name || !username || !description || !email || !phone || !address || !image) {
      return NextResponse.json({ error: "Missing company info" }, { status: 400 });
    }

    // Check if user already created a company
    const existingCompany = await prisma.company.findFirst({
      where: { userId }
    });

   if (existingCompany) {

  if (existingCompany.status === "PENDING") {
    return NextResponse.json(
      { error: "Your company request is already submitted and waiting for admin approval." },
      { status: 400 }
    );
  }

  if (existingCompany.status === "APPROVED") {
    return NextResponse.json(
      { error: "You already have an approved company." },
      { status: 400 }
    );
  }

  if (existingCompany.status === "REJECTED") {
    return NextResponse.json(
      { error: "Your previous company request was rejected. Contact admin." },
      { status: 400 }
    );
  }
}

    // Check username
    const isUsernameTaken = await prisma.company.findFirst({
      where: { username: username.toLowerCase() }
    });

    if (isUsernameTaken) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    // Upload logo
    const buffer = Buffer.from(await image.arrayBuffer());
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "company-logos"
    });

    const optimizedImage = imagekit.url({
      path: uploadResponse.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" }
      ]
    });

    await prisma.company.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        email,
        phone,
        address,
        logo: optimizedImage,
        status: "PENDING",
        isActive: false
      }
    });

    return NextResponse.json({ message: "Company applied, waiting for approval" });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

// get company status
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const company = await prisma.company.findFirst({
      where: { userId }
    });

    if (company) {
      return NextResponse.json({ status: company.status });
    }

    return NextResponse.json({ status: "not registered" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
