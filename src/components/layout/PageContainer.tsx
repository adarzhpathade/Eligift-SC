import React from "react";

type PageContainerProps = {
  children: React.ReactNode;
};

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="max-w-[var(--container-max-width,1440px)] mx-auto px-5 lg:px-16 w-full flex-1 flex flex-col">
      {children}
    </div>
  );
}
