import { S3Client } from "@aws-sdk/client-s3";

// Works with Cloudflare R2 (free tier) or AWS S3 — swap via env vars only.
//
// Cloudflare R2 setup:
//   1. cloudflare.com → R2 → Create bucket (name = S3_BUCKET)
//   2. R2 → Manage R2 API Tokens → Create token (Object Read & Write)
//   3. Copy Account ID from R2 overview page
//   S3_ENDPOINT = https://<CLOUDFLARE_ACCOUNT_ID>.r2.cloudflarestorage.com
//   S3_REGION   = auto
//
// AWS S3 setup:
//   Leave S3_ENDPOINT unset (or empty). Set S3_REGION to your bucket region.

export const s3 = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT || undefined,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  // Required for R2 path-style URLs
  forcePathStyle: process.env.S3_ENDPOINT ? true : false,
});

export const BUCKET = process.env.S3_BUCKET;
