// import { NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import prisma from "@/lib/prisma";

// export async function GET() {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session?.user) {
//       return NextResponse.json({ role: null }, { status: 401 });
//     }

//     // Get user role from database
//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       select: { role: true },
//     });

//     return NextResponse.json({ role: user?.role || "USER" });
//   } catch (error) {
//     console.error("Error fetching user role:", error);
//     return NextResponse.json({ role: null }, { status: 500 });
//   }
// }