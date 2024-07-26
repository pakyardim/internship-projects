import React from "react";

export function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="border border-black dark:border-secondary hover:scale-105 btn bg-primary text-white px-8 py-4 font-bold">
      {children}
    </button>
  );
}
