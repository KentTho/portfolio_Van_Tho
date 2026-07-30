import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isErr } from "@/shared/domain/result";
import { requestSignedUpload } from "@/composition/media";

/**
 * Server boundary for server-mediated media uploads. The browser asks here for
 * permission; the server verifies the admin session + role, validates the
 * request, and only then returns a short-lived signed upload URL. The service
 * key never leaves the server. Runs on the Node runtime (auth + service client).
 */
export const runtime = "nodejs";

const bodySchema = z.object({
  bucket: z.string().min(1),
  mimeType: z.string().min(1),
  byteSize: z.number().int().positive(),
  keyPrefix: z.string().min(1),
});

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const result = await requestSignedUpload(parsed.data);
  if (isErr(result)) {
    const status = result.error.code === "MEDIA_UPLOAD_FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ error: result.error.code }, { status });
  }

  return NextResponse.json(result.value, { status: 201 });
}
