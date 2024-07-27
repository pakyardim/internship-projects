import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordInput({ value, onChange }: Props) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  return (
    <div className={`h-12 relative w-full max-w-2xl`}>
      <input
        className="h-12 shadowedInput dark:bg-dark w-full z-10 p-2 border-2 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        type={showPassword ? "text" : "password"}
        id="password"
        value={value}
        onChange={onChange}
        name="password"
        placeholder={t("password")}
        required
      />
      <button
        className="absolute top-0 text-sm right-0 w-10 h-full text-gray-500 focus:outline-none"
        onClick={(e) => togglePasswordVisibility(e)}
      >
        {showPassword ? "🐵" : "🙈"}
      </button>
    </div>
  );
}
