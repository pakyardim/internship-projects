type Props = {
  onClick: () => void;
  isChecked: boolean;
};

export function DarkModeToggle({ onClick, isChecked }: Props) {
  return (
    <label className="cursor-pointer relative inline-block w-14 h-6">
      <input onClick={onClick} type="checkbox" className="sr-only" />
      <div
        className={`w-full h-full rounded-full ${
          isChecked ? "bg-dark" : "bg-light"
        } transition-colors duration-300`}
      ></div>
      <div
        className={`absolute top-1 left-1 w-4 h-4 rounded-full shadow-md transform ${
          isChecked && "translate-x-8"
        } transition-transform duration-300 flex items-center justify-center`}
      >
        {isChecked ? "🌜" : "🌞"}
      </div>
    </label>
  );
}
