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
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    skills: "",
    experience: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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
      let imageIpfsHash = null;
      if (avatarFile) {
        const imageResult = await pinFileToIPFS(avatarFile);
        imageIpfsHash = imageResult.IpfsHash;
      }

      // Create metadata JSON with form data and image reference
      const metadata = {
        ...formData,
        image: imageIpfsHash ? `ipfs://${imageIpfsHash}` : null,
        createdAt: new Date().toISOString(),
      };

      // Upload the metadata JSON to IPFS
      const jsonResult = await pinJSONToIPFS(metadata);
      const metadataUri = `ipfs://${jsonResult.IpfsHash}`;

      console.log("NFT Metadata URI:", metadataUri);
      // Here you would typically call your smart contract to mint the NFT
      // with the metadata URI as the tokenURI

      alert(
        `Success! Your freelancer profile has been created.\nMetadata URI: ${metadataUri}`
      );
    } catch (error) {
      console.error("Error creating NFT:", error);
      alert("There was an error creating your NFT. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            <label className="block text-white mb-2">Professional Title</label>
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
            <label className="block text-white mb-2">Years of Experience</label>
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
            {isLoading ? "Creating NFT..." : "Create Freelancer Profile NFT"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
