import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      // Expose role through the session so server actions can read it
      // without an extra DB round-trip.
      role: {
        type: "string",
        defaultValue: "DISPATCHER",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;