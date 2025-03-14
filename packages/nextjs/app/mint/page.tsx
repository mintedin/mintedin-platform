"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Shield } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pinFileToIPFS, pinJSONToIPFS } from "@/lib/utils";

export default function MintPage() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    skills: "",
    experience: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [ipfsData, setIpfsData] = useState<{
    imageUrl?: string;
    metadataUrl?: string;
    metadataUri?: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, upload the avatar image to IPFS if one was selected
      let imageResult = null;
      if (avatarFile) {
        imageResult = await pinFileToIPFS(avatarFile);
      }

      // Create metadata JSON with form data and image reference
      const metadata = {
        ...formData,
        image: imageResult ? imageResult.IpfsHash : null,
        imageUrl: imageResult?.gatewayUrl || null,
        createdAt: new Date().toISOString(),
      };

      // Upload the metadata JSON to IPFS
      const jsonResult = await pinJSONToIPFS(metadata);
      const metadataUri = `ipfs://${jsonResult.IpfsHash}`;

      // Save the URLs for display
      setIpfsData({
        imageUrl: imageResult?.gatewayUrl || undefined,
        metadataUrl: jsonResult.gatewayUrl,
        metadataUri: metadataUri,
      });

      console.log("NFT Metadata URI:", metadataUri);

      // No longer automatically alert success - we'll let the user proceed to minting
    } catch (error) {
      console.error("Error creating NFT metadata:", error);
      alert("There was an error creating your NFT metadata. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Metadata URI copied to clipboard!");
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-cyber-gradient flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism p-8 rounded-lg text-center"
        >
          <Shield className="w-16 h-16 text-cyber-teal mx-auto mb-4" />
          <h1 className="text-3xl font-orbitron font-bold mb-4 neon-text">
            Connect Wallet
          </h1>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to mint your Freelancer NFT
          </p>
          <ConnectButton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-gradient py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto glassmorphism p-8 rounded-lg"
      >
        <h1 className="text-3xl font-orbitron font-bold mb-8 neon-text text-center">
          Mint Your Freelancer NFT
        </h1>

        {ipfsData ? (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-semibold text-cyber-teal">
              Metadata Created Successfully!
            </h2>

            {ipfsData.imageUrl && (
              <div className="flex flex-col items-center">
                <h3 className="text-white mb-2">Your NFT Image:</h3>
                <div className="h-48 w-48 rounded-lg overflow-hidden border-2 border-cyber-teal">
                  <img
                    src={ipfsData.imageUrl}
                    alt="NFT"
                    className="h-full w-full object-cover"
                  />
                </div>
                <a
                  href={ipfsData.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyber-teal mt-2 hover:underline"
                >
                  View on IPFS
                </a>
              </div>
            )}

            {ipfsData.metadataUrl && (
              <div className="mt-4">
                <h3 className="text-white mb-2">Metadata:</h3>
                <a
                  href={ipfsData.metadataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-teal hover:underline"
                >
                  View Metadata on IPFS
                </a>
                <div className="mt-2 text-white">
                  <p className="font-semibold">
                    Metadata URI for NFT Contract:
                  </p>
                  <div className="flex items-center justify-center mt-2">
                    <code className="text-xs bg-black/30 p-2 rounded break-all max-w-full">
                      {ipfsData.metadataUri}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 border-cyber-teal text-cyber-teal"
                      onClick={() =>
                        copyToClipboard(ipfsData.metadataUri || "")
                      }
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 border border-cyan-500 bg-cyan-500/10 rounded-md text-cyan-400 text-sm">
              <p className="mb-2 font-bold">Next Steps:</p>
              <ol className="list-decimal pl-4 space-y-2 text-left">
                <li>Copy the Metadata URI above</li>
                <li>
                  Use it with your wallet that has MINTER_ROLE permission to
                  call the{" "}
                  <code className="bg-black/30 px-1 rounded">safeMint</code>{" "}
                  function on the NFT contract
                </li>
                <li>Parameters needed: your address and the Metadata URI</li>
              </ol>
            </div>

            <div className="flex flex-col space-y-4 mt-6">
              <Button
                variant="outline"
                className="border-cyber-teal text-cyber-teal hover:bg-cyber-teal/10"
                onClick={() => setIpfsData(null)}
              >
                Create Different NFT
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Full Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border-cyber-teal bg-black/50"
              />
            </div>

            <div>
              <label className="block text-white mb-2">
                Professional Title
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full border-cyber-teal bg-black/50"
                placeholder="e.g. Full-Stack Developer"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Key Skills</label>
              <Input
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                required
                className="w-full border-cyber-teal bg-black/50"
                placeholder="e.g. React, Solidity, Node.js"
              />
            </div>

            <div>
              <label className="block text-white mb-2">
                Years of Experience
              </label>
              <Input
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                type="number"
                min="0"
                className="w-full border-cyber-teal bg-black/50"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Avatar Image</label>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full border-cyber-teal bg-black/50"
                />
                {avatarPreview && (
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-cyber-teal">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyber-teal hover:bg-cyber-teal/80 text-black font-bold py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading to
                  IPFS...
                </>
              ) : (
                "Upload to IPFS"
              )}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
