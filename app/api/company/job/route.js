import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ==============================
// CREATE JOB
// ==============================
export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.company.findFirst({
      where: {
        userId,
        status: "APPROVED",
        isActive: true
      }
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not approved or not found" },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const budget = parseFloat(formData.get("budget"));
    const images = formData.getAll("images");

    if (!title || !description || isNaN(budget)) {
      return NextResponse.json(
        { error: "Missing job details" },
        { status: 400 }
      );
    }

    let imageUrls = [];

    if (images && images.length > 0 && images[0].size !== 0) {
      imageUrls = await Promise.all(
        images.map(async (image) => {
          const buffer = Buffer.from(await image.arrayBuffer());

          const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: image.name,
            folder: "job-images"
          });

          return imagekit.url({
            path: uploadResponse.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1024" }
            ]
          });
        })
      );
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        budget,
        images: imageUrls,
        companyId: company.id,
        isOpen: true
      }
    });

    return NextResponse.json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


// ==============================
// GET JOBS (Return as products)
// ==============================
export async function GET(request) {
  try {

    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const company = await prisma.company.findFirst({
      where: { userId }
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // ✅ FETCH SINGLE JOB FOR EDIT PAGE
    if (id) {

      const job = await prisma.job.findFirst({
        where: {
          id,
          companyId: company.id
        }
      });

      if (!job) {
        return NextResponse.json(
          { error: "Job not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ job });

    }

    // ✅ FETCH ALL JOBS
    const jobs = await prisma.job.findMany({
      where: { companyId: company.id },
      include: {
        company: true
      },
      orderBy: { createdAt: "desc" }
    });

    const products = jobs.map(job => ({
      id: job.id,
      name: job.title,
      description: job.description,
      price: job.budget,
      images: job.images,
      inStock: job.isOpen,
      createdAt: job.createdAt,
      company: job.company
    }));

    return NextResponse.json({ products });

  } catch (error) {

    console.error("GET JOB ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }
}

export async function PUT(request) {

  try{

    const { userId } = getAuth(request)

    if(!userId){
      return NextResponse.json(
        {error:"Unauthorized"},
        {status:401}
      )
    }

    const { id,title,description,budget } = await request.json()

    const company = await prisma.company.findFirst({
      where:{ userId }
    })

    if(!company){
      return NextResponse.json(
        {error:"Company not found"},
        {status:404}
      )
    }

    const job = await prisma.job.update({
      where:{ id },
      data:{
        title,
        description,
        budget:parseFloat(budget)
      }
    })

    return NextResponse.json({
      message:"Job updated",
      job
    })

  }catch(error){

    console.error(error)

    return NextResponse.json(
      {error:error.message},
      {status:500}
    )

  }

}

// ==============================
// DELETE JOB
// ==============================

export async function DELETE(request) {

  try {

    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await request.json()

    const company = await prisma.company.findFirst({
      where: { userId }
    })

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      )
    }

    const job = await prisma.job.findUnique({
      where: { id }
    })

    if (!job || job.companyId !== company.id) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    await prisma.job.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Job deleted successfully"
    })

  } catch (error) {

    console.error("DELETE JOB ERROR:", error)

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )

  }

}