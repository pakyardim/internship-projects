export function Spinner({ size }: { size: number }) {
  return (
    <div
      className={`border-t border-dark rounded-full spinner h-${size} w-${size}`}
    />
  );
}
