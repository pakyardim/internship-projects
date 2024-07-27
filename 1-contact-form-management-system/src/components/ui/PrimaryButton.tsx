import React from "react";

type Props = {
  children: React.ReactNode;
  isDisabled: boolean;
};

export function PrimaryButton({ isDisabled, children }: Props) {
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`border border-black dark:border-secondary hover:scale-105 btn bg-primary text-white px-6 py-3 lg:px-8 lg:py-4 font-bold ${
        isDisabled && "bg-primary/50"
      }`}
    >
      {children}
    </button>
  );
}
