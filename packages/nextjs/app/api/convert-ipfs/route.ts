import { NextRequest, NextResponse } from "next/server";
import { pinata, convertToGatewayURL } from "@/utils/config";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get the IPFS hash from the request
    const { ipfsHash } = await request.json();

    if (!ipfsHash) {
      return NextResponse.json(
        { error: "No IPFS hash provided" },
        { status: 400 }
      );
    }

    // Convert the hash to a gateway URL
    const url = convertToGatewayURL(ipfsHash);

    // Return the gateway URL
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error converting IPFS hash:", error);
    return NextResponse.json(
      { error: "Failed to convert IPFS hash" },
      { status: 500 }
    );
  }
}
