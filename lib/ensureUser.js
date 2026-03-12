import prisma from "@/lib/prisma"

export async function ensureUser(clerkUser) {
  const existing = await prisma.user.findUnique({
    where: { id: clerkUser.id }
  })

  if (existing) return existing

  return await prisma.user.create({
    data: {
      id: clerkUser.id,
      name: clerkUser.fullName || "",
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      image: clerkUser.imageUrl || ""
    }
  })
}