"use client";

import { useState, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { CountryType } from "src/types";

interface Props {
  options: CountryType[];
  isError: boolean;
  isLoading: boolean;
  value: number;
  onChange: (val: number) => void;
  reset: () => void;
}

export const CustomDropdown = ({
  options,
  isLoading,
  isError,
  reset,
  value,
  onChange,
}: Props) => {
  const t = useTranslations();

  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filteredOptions = options?.filter((option: CountryType) =>
    option.country.toLowerCase().includes(query.toLowerCase())
  );

  const selectedCountry = options?.find((option) => option.id === value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  const handleClick = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        name="country"
        autoComplete="off"
        value={selectedCountry?.country || query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`relative dark:bg-dark w-full z-10 p-2 border-b-2 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 ${
          isError && "border-primary"
        }`}
      />
      {value && value !== -1 && (
        <button
          type="button"
          onClick={reset}
          className="absolute z-20 top-2 right-2"
        >
          x
        </button>
      )}

      {isOpen && filteredOptions && filteredOptions.length > 0 && (
        <ul className="dark:bg-darkBackground dark:text-light absolute z-10 w-full mt-1 bg-light border border-primary/30 shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <li className="px-4 py-2 cursor-pointer hover:bg-primary/10">
              {t("loading")}
            </li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  handleClick();
                }}
                className="px-4 py-2 cursor-pointer hover:bg-primary/10"
              >
                {option.country}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
