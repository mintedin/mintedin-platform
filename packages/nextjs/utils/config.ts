"server only";

import { PinataSDK } from "pinata";

// Initialize the Pinata SDK with the JWT from environment variables
// Use type assertion to bypass TypeScript errors
export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
}) as any;

// Convert IPFS hash to gateway URL
export const convertToGatewayURL = (ipfsHash: string): string => {
  const gatewayURL = process.env.NEXT_PUBLIC_GATEWAY_URL;
  if (!gatewayURL) {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  }
  return `https://${gatewayURL}/ipfs/${ipfsHash}`;
};
