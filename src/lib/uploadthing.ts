// lib/uploadthing.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async () => {
      // Optional: Add auth logic here if needed
      return { userId: "anonymous" }; // Metadata passed to onUploadComplete
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Runs on Uploadthing's server after upload
      console.log("Uploaded file:", file.url, "by user:", metadata.userId);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
