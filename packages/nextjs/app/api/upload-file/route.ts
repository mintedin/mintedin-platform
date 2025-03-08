import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create a Buffer from the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a proper File object from the buffer for Pinata SDK
    const fileObject = new File([buffer], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });

    // Upload to IPFS using the File object
    const result = await pinata.upload.public.file(fileObject, {
      pinataMetadata: {
        name: file.name,
        keyvalues: {
          created: String(new Date().toISOString()),
        },
      },
    });

    // Return the IPFS hash
    return NextResponse.json({
      cid: result.cid,
      IpfsHash: result.cid, // for backward compatibility
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
