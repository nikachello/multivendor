import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db/prisma";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  rateLimit: {
    window: 60,        // 60 second window
    max: 10,           // 10 requests per window
    storage: "memory", // in-memory (no Redis required)
  },
  trustedOrigins: ["https://multistore.ge", "https://www.multistore.ge"],
  session: {
    expiresIn: 60 * 60 * 24 * 30,    // 30 days
    updateAge: 60 * 60 * 24,          // rotate token at most once per day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,                 // serve cached session for 5 min before re-validating
    },
  },
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
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: { ...user, role: "seller" },
        }),
      },
    },
  },
});
