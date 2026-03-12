import prisma from "@/lib/prisma";

const authSeller = async (userId) => {
  try {
    if (!userId) return false;

    const company = await prisma.company.findFirst({
      where: {
        userId,
        status: "APPROVED",
        isActive: true
      }
    });

    if (!company) return false;

    return company.id;

  } catch (error) {
    console.error(error);
    return false;
  }
};

export default authSeller;