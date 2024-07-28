import React from "react";

type Props = {
  children: React.ReactNode;
  isDisabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  classname?: string;
};

export function PrimaryButton({
  onClick,
  type = "button",
  isDisabled = false,
  children,
  classname,
}: Props) {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      disabled={isDisabled}
      className={`transition-colors duration-300 border border-black dark:border-secondary hover:scale-105 btn bg-primary text-white px-6 lg:px-8 font-bold ${
        isDisabled && "bg-primary/50"
      } ${classname} `}
    >
      {children}
    </button>
  );
}
