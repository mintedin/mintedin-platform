import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import pinataSDK from '@pinata/sdk';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Initialize Pinata
const pinata = new pinataSDK('0f2409f441a209844c1c', 'cfc962619eb90ffe254004b63eccc27c032cf207cd61dcf317bf97bc6c07f6b6');

// Function to pin a file to IPFS
export const pinFileToIPFS = async (file: File): Promise<any> => {
  try {
    const result = await pinata.pinFileToIPFS(file);
    console.log('File pinned successfully:', result);
    return result;
  } catch (error) {
    console.error('Error pinning file:', error);
    throw error;
  }
};

// Function to pin JSON to IPFS
export const pinJSONToIPFS = async (jsonData: object): Promise<any> => {
  try {
    const result = await pinata.pinJSONToIPFS(jsonData);
    console.log('JSON pinned successfully:', result);
    return result;
  } catch (error) {
    console.error('Error pinning JSON:', error);
    throw error;
  }
};
