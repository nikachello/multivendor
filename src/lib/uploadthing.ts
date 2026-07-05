import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { headers } from "next/headers";
import { auth } from "./auth";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new UploadThingError("Unauthorized");
  return { userId: session.user.id };
}

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(requireSession)
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
  categoryImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(requireSession)
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
  sectionImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(requireSession)
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
