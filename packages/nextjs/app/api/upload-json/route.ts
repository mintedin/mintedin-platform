import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get the JSON data from the request
    const jsonData = await request.json();

    if (!jsonData) {
      return NextResponse.json(
        { error: "No JSON data provided" },
        { status: 400 }
      );
    }

    // Upload using public json method (with type assertion)
    // Using the SDK but bypassing TypeScript checking with 'as any'
    const result = await pinata.upload.public.json(jsonData, {
      pinataMetadata: {
        name: "Freelancer NFT Metadata",
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
    console.error("Error uploading JSON:", error);
    return NextResponse.json(
      { error: "Failed to upload JSON" },
      { status: 500 }
    );
  }
}
