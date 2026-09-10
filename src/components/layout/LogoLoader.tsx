import React from 'react';
import Image from 'next/image';

export default function LogoLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-background h-[100dvh] w-[100dvw]">
      <Image
        src="/eligify-text-icon.png"
        alt="Eligify AI Loading..."
        width={200}
        height={60}
        className="w-[180px] h-auto object-contain animate-pulse duration-[2000ms] dark:invert"
        priority
      />
    </div>
  );
}
