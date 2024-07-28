import React from "react";

type Props = {
  children: React.ReactNode;
  isDisabled: boolean;
  classname?: string;
};

export function PrimaryButton({ isDisabled, children, classname }: Props) {
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`border border-black dark:border-secondary hover:scale-105 btn bg-primary text-white px-6 lg:px-8 font-bold ${
        isDisabled && "bg-primary/50"
      } ${classname} `}
    >
      {children}
    </button>
  );
}
