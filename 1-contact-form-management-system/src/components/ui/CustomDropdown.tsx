import { useState, ChangeEvent } from "react";

interface CustomDropdownProps {
  options: string[];
}

export const CustomDropdown = ({ options }: CustomDropdownProps) => {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    setQuery("");
    setIsOpen(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 100);
  };

  const handleClick = (option: string) => () => {
    handleSelectOption(option);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={selectedOption || query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="dark:bg-dark w-full z-10 p-2 border-b-2 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="dark:bg-darkBackground dark:text-light absolute z-10 w-full mt-1 bg-light border border-primary/30 shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={handleClick(option)}
              className="px-4 py-2 cursor-pointer hover:bg-primary/10"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
