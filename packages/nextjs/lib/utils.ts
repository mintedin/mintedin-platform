import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to pin a file to IPFS using the API route
export const pinFileToIPFS = async (file: File): Promise<any> => {
  try {
    // Create form data for the file
    const formData = new FormData();
    formData.append("file", file);

    // Send the file to the API route
    const response = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error pinning file: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("File pinned successfully:", result);

    // Convert IPFS hash to a gateway URL
    const gatewayResponse = await fetch("/api/convert-ipfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ipfsHash: result.IpfsHash }),
    });

    if (gatewayResponse.ok) {
      const { url } = await gatewayResponse.json();
      result.gatewayUrl = url;
    }

    return result;
  } catch (error) {
    console.error("Error pinning file to IPFS:", error);
    throw error;
  }
};

// Function to pin JSON to IPFS using the API route
export const pinJSONToIPFS = async (jsonData: object): Promise<any> => {
  try {
    // Send the JSON data to the API route
    const response = await fetch("/api/upload-json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      throw new Error(`Error pinning JSON: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("JSON pinned successfully:", result);

    // Convert IPFS hash to a gateway URL
    const gatewayResponse = await fetch("/api/convert-ipfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ipfsHash: result.IpfsHash }),
    });

    if (gatewayResponse.ok) {
      const { url } = await gatewayResponse.json();
      result.gatewayUrl = url;
    }

    return result;
  } catch (error) {
    console.error("Error pinning JSON to IPFS:", error);
    throw error;
  }
};
