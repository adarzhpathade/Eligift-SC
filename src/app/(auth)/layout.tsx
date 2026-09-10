import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-eg-background)]">

      {/* Content */}
      <main className="flex-1 flex items-center justify-center w-full max-w-5xl mx-auto px-5 md:px-8">
        {children}
      </main>
    </div>
  );
}
