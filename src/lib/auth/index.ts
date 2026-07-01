import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db/prisma";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["https://multistore.ge", "https://www.multistore.ge"],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      sendPasswordResetEmail({ to: user.email, url }).catch((e) =>
        console.error("[auth] sendPasswordResetEmail failed:", e)
      );
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      sendVerificationEmail({ to: user.email, url }).catch((e) =>
        console.error("[auth] sendVerificationEmail failed:", e)
      );
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "seller",
        input: true,
      },
    },
  },
});
