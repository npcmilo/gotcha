import { ActionCtx } from "../_generated/server";
import { api } from "../_generated/api";

/**
 * Downloads a file from a URL and uploads it to Convex storage
 */
export async function downloadAndUploadFile(
  ctx: ActionCtx,
  url: string
): Promise<string> {
  // Download the file
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file from ${url}: ${response.statusText}`);
  }

  const blob = await response.blob();

  // Generate upload URL
  const uploadUrl = await ctx.runMutation(api.storage.generateUploadUrl, {
    contentType: blob.type,
  });

  // Upload to Convex
  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    body: blob,
    headers: {
      "Content-Type": blob.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload file to Convex: ${uploadResponse.statusText}`);
  }

  // Get the storage ID from the response
  const { storageId } = await uploadResponse.json();

  // Get the URL for the uploaded file
  const fileUrl = await ctx.runMutation(api.storage.getUrl, {
    storageId,
  });

  return fileUrl;
}

/**
 * Downloads and uploads multiple files in parallel
 */
export async function downloadAndUploadFiles(
  ctx: ActionCtx,
  urls: string[]
): Promise<string[]> {
  const uploadPromises = urls.map(url => downloadAndUploadFile(ctx, url));
  return Promise.all(uploadPromises);
}