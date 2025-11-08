"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, TestTube, TestTubeIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

export default function ColdEmailGenerator() {
  const [recipientUrl, setRecipientUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const emailDisplayRef = useRef(null);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipientUrl || !fullName) {
      return;
    }

    setIsLoading(true);
    setShowEmail(false);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_DEV}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: recipientUrl, fullname: fullName }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to generate email");
      }

      const data = await res.json();
      setGeneratedEmail(data.response);
      setShowEmail(true);

      setTimeout(() => {
        emailDisplayRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    toast.loading(
      "The backend server is hosted on render and may take a while to wake up. Please be patient!",
      { duration: 4000 }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-3xl  mx-auto px-4 py-8 md:py-16 text-center">
        <div className="mb-6">
          <h2 className="text-emerald-500 font-medium uppercase tracking-wider mb-4">
            WELCOME TO COLD EMAIL GENERATOR
          </h2>
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-8">
            Enter job link, get personalized cold email
          </h1>

          {/* Testimonial */}
          <div className="max-w-3xl mx-auto border border-gray-200 rounded-lg p-6 mb-12">
            <div className="flex items-center gap-6">
              <Mail className="h-12 w-12 text-emerald-500" />
              <div className="text-left">
                <div className="hidden md:flex text-gray-800">
                  I used to spend hours writing cold emails. This generator has
                  saved me so much time while improving my response rates! All I
                  need to provide is the job&apos;s website URL, and it crafts a
                  personalized email that gets results.
                </div>
                <div className="flex md:hidden text-gray-800">
                  I used to spend hours writing cold emails. This generator has
                  saved me so much time while improving my response rates!
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  Prajjwol Shrestha, Director at Tech Solutions
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="flex flex-col gap-4 mb-4">
              <Input
                type="url"
                placeholder="Job's Website URL"
                value={recipientUrl}
                onChange={(e) => setRecipientUrl(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 px-4 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
              <Input
                type="text"
                placeholder="Your Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 px-4 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !recipientUrl || !fullName}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Email...
                </>
              ) : (
                "Generate Email"
              )}
            </Button>
          </form>
        </div>

        {/* Generated Email Display */}
        {showEmail && generatedEmail && (
          <div ref={emailDisplayRef} className="mt-16 text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Your Generated Email
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm leading-relaxed">
                {generatedEmail}
              </pre>
            </div>
            <div className="mt-6 flex gap-4">
              <Button
                onClick={() => navigator.clipboard.writeText(generatedEmail)}
                variant="outline"
                className="flex-1 border-emerald-500 text-emerald-500 hover:bg-emerald-50"
              >
                Copy to Clipboard
              </Button>
              <Button
                onClick={() => {
                  // Use the state variables which should now be correctly parsed
                  setRecipientUrl("");
                  setFullName("");
                  setGeneratedEmail("");
                  setShowEmail(false);

                  setTimeout(() => {
                    formRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Generate new Email
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
