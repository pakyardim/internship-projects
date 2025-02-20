import Link from "next/link";
import { useLocale } from "next-intl";

export function AnimatedLogo() {
  const locale = useLocale();

  return (
    <Link href={`/${locale}`}>
      <div className="uppercase cursor-pointer flex items-center text-primary font-primary font-bold sm:text-2xl lg:text-3xl">
        <span>Contact</span>
        <div className="text-wrap overflow-hidden text-center h-6 sm:h-8 lg:h-9">
          <div className="sm:text-2xl lg:text-3xl text text-darkBackground dark:text-light relative">
            <span className="block">form</span>
            <span className="block">Info</span>
            <span className="block">page</span>
          </div>
        </div>
        <span>Hub</span>
      </div>
    </Link>
  );
}
