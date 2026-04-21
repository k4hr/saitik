import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

function getR2Client(): S3Client {
  const accountId = getEnv("CLOUDFLARE_R2_ACCOUNT_ID");
  const accessKeyId = getEnv("CLOUDFLARE_R2_ACCESS_KEY_ID");
  const secretAccessKey = getEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY");

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export function getR2BucketName(): string {
  return getEnv("CLOUDFLARE_R2_BUCKET_NAME");
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildR2Key(params: {
  userId: string;
  kind: "face" | "reference" | "edit-source" | "result";
  fileName: string;
  orderId?: string;
}) {
  const safeName = sanitizeFileName(params.fileName || "file");
  const stamp = Date.now();
  const random = crypto.randomUUID();

  if (params.kind === "result" && params.orderId) {
    return `users/${params.userId}/orders/${params.orderId}/result/${stamp}-${random}-${safeName}`;
  }

  return `users/${params.userId}/${params.kind}/${stamp}-${random}-${safeName}`;
}

export async function getSignedUploadUrl(params: {
  key: string;
  contentType: string;
  expiresIn?: number;
}) {
  const client = getR2Client();
  const bucket = getR2BucketName();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    ContentType: params.contentType,
  });

  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: params.expiresIn ?? 60 * 10,
  });

  return signedUrl;
}

export async function getSignedReadUrl(params: {
  key: string;
  expiresIn?: number;
}) {
  const client = getR2Client();
  const bucket = getR2BucketName();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: params.key,
  });

  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: params.expiresIn ?? 60 * 10,
  });

  return signedUrl;
}

export async function uploadBufferToR2(params: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
  contentDisposition?: string;
  cacheControl?: string;
}) {
  const client = getR2Client();
  const bucket = getR2BucketName();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      ContentDisposition: params.contentDisposition,
      CacheControl: params.cacheControl,
    }),
  );
}

export async function readObjectFromR2(key: string) {
  const client = getR2Client();
  const bucket = getR2BucketName();

  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  if (!response.Body) {
    throw new Error("R2 object body is empty");
  }

  const bytes = await response.Body.transformToByteArray();

  return {
    bytes,
    contentType: response.ContentType || "application/octet-stream",
    contentDisposition: response.ContentDisposition || undefined,
  };
}

export async function headObjectInR2(key: string) {
  const client = getR2Client();
  const bucket = getR2BucketName();

  const response = await client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  return {
    contentLength: Number(response.ContentLength || 0),
    contentType: response.ContentType || "application/octet-stream",
  };
}
