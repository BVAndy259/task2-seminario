import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const region = process.env.AWS_REGION || "us-east-1";
export const bucketName =
  process.env.AWS_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME;

if (!bucketName) {
  throw new Error("AWS_BUCKET_NAME is not configured in the environment");
}

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});
