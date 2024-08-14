export function HighlightedText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative font-semibold z-10 inline-block">
      <span className="dark:bg-primary absolute w-full h-1/2 bg-primary/20 top-4 left-0 -z-10"></span>
      {children}
    </span>
  );
}
