"use client";

import { useState } from "react";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import CaptionDisplay from "@/components/CaptionDisplay";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      generateCaption(result);
    };
    reader.readAsDataURL(file);
  };

  const generateCaption = async (base64Image: string) => {
    setIsLoading(true);
    setCaption("");

    try {
      const response = await fetch("/api/caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.caption) {
          setCaption(data.caption);
        } else {
          setCaption("Failed to generate caption. No caption returned from API.");
        }
      } else {
        // Handle specific error responses from the API
        if (data.error) {
          setCaption(`Error: ${data.error}`);
        } else {
          setCaption("Failed to generate caption. Please try again.");
        }
      }
    } catch (error) {
      console.error("Network error or other exception:", error);
      setCaption("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setCaption("");
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-blue-500/30">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />

        <div className="mt-12 space-y-12">
          <UploadZone
            onFileSelect={handleFileSelect}
            selectedImage={selectedImage}
            onClear={handleClear}
          />

          <CaptionDisplay
            caption={caption}
            isLoading={isLoading}
            onRegenerate={() => selectedImage && generateCaption(selectedImage)}
          />
        </div>
      </div>
    </main>
  );
}
