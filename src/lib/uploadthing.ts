import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(() => ({ uploadedAt: Date.now() }))
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
  categoryImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => ({ uploadedAt: Date.now() }))
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
  sectionImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => ({ uploadedAt: Date.now() }))
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
