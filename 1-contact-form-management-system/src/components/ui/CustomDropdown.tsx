import { useState, ChangeEvent } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface CustomDropdownProps {
  options: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  isError: boolean;
  isLoading: boolean;
  setValue: (val: string) => void;
}

export const CustomDropdown = ({
  options,
  control,
  isLoading,
  isError,
  setValue,
}: CustomDropdownProps) => {
  const { t } = useTranslation();

  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filteredOptions = options?.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase())
  );

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
      <Controller
        control={control}
        name="country"
        defaultValue={""}
        render={({ field: { onChange, value } }) => (
          <>
            <input
              type="text"
              name="country"
              autoComplete="off"
              value={value || query}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`relative dark:bg-dark w-full z-10 p-2 border-b-2 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 ${
                isError && "border-primary"
              }`}
            />
            {value && (
              <button
                type="button"
                onClick={() => setValue("")}
                className="absolute z-20 top-2 right-2"
              >
                x
              </button>
            )}

            {isOpen && filteredOptions.length > 0 && (
              <ul className="dark:bg-darkBackground dark:text-light absolute z-10 w-full mt-1 bg-light border border-primary/30 shadow-lg max-h-60 overflow-auto">
                {isLoading ? (
                  <li className="px-4 py-2 cursor-pointer hover:bg-primary/10">
                    {t("loading")}
                  </li>
                ) : (
                  filteredOptions.map((option, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        onChange(option);
                        handleClick();
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-primary/10"
                    >
                      {option}
                    </li>
                  ))
                )}
              </ul>
            )}
          </>
        )}
      />
    </div>
  );
};
