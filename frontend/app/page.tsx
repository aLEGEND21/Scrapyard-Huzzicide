"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Upload, MessageSquare, Share2, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//import { useToast } from "@/hooks/use-toast"
import Image from "next/image";
import { BACKEND_URL } from "@/lib/env";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  //const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(file);
        setAdvice(null);
        setSelectedImageUrl(reader.result as string);
        setAdvice(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    // Simulate API call to backend for OCR and AI analysis
    console.log(BACKEND_URL);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch(`${BACKEND_URL}/get_response`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setAdvice(data.response);
      setActiveTab("results");
    } catch (error) {
      /*toast({
        title: "Analysis failed",
        description: "Could not analyze your screenshot. Please try again.",
        variant: "destructive",
      })*/
    } finally {
      setIsAnalyzing(false);
    }
  };

  const shareAdvice = () => {
    if (advice) {
      navigator.clipboard.writeText(advice);
      alert("Copied to clipboard!");
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setAdvice(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="w-full max-w-md px-4 py-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">Huzzicide</h1>
        <p className="text-gray-400 text-center">
          Dating is Hard. Let's Make it Harder.
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md px-4 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-2 bg-zinc-800 rounded-sm text-gray-400">
            <TabsTrigger value="upload" className="rounded-sm">
              Upload
            </TabsTrigger>
            <TabsTrigger value="results" className="rounded-sm">
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {selectedImage && (
              <Button
                className="w-full"
                size="lg"
                onClick={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin mt-0.5" />
                    <span>Analyzing</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="mt-0.5" />
                    Get Terrible Advice
                  </>
                )}
              </Button>
            )}

            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden rounded-xl">
              {selectedImage ? (
                <div className="relative aspect-[9/16] w-full">
                  <Image
                    src={selectedImageUrl || "/placeholder.svg"}
                    alt="Screenshot preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-3 right-6 rounded-full"
                    onClick={resetAll}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="rounded-full bg-gray-700/50 p-4 mb-4">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-6">
                    Upload a screenshot of your conversation
                  </p>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={handleButtonClick}
                    >
                      Choose Image
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card className="bg-gray-800/50 border-gray-700 p-6 rounded-xl">
              {advice ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-pink-500">
                    Expert Advice
                  </h3>
                  <p className="text-md text-gray-400 -mt-1">
                    Respond back with this:
                  </p>
                  <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-200">{advice}</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={shareAdvice}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and analyze a screenshot to get terrible advice</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-md px-4 py-6 text-center text-gray-500 text-sm">
        <p>
          For entertainment purposes only. Please don't actually use this
          advice.
        </p>
      </footer>
    </main>
  );
}
