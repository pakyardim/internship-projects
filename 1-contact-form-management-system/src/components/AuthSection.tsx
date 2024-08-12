import { useTranslations } from "next-intl";

export function AuthSection() {
  const t = useTranslations();
  const text = t("authTitle");
  const textArray = text.split(/(?!$)/);

  return (
    <div
      className={`bg-primaryDark hidden lg:flex auth-section dark:bg-dark transition-colors duration-300 relative justify-center items-center w-2/5 h-full overflow-hidden`}
    >
      <div className="bg-secondary first absolute rounded-full"></div>
      <div className="bg-secondary second absolute rounded-full"></div>
      <div className="bg-secondary third absolute rounded-full"></div>
      <div className="bg-secondary fourth absolute rounded-full"></div>
      <div className="container font-primary flex-col items-center text-center justify-center text-white mb-20">
        <h2 className="hero-text text-5xl mb-8">
          {textArray.map((char, index) => {
            return (
              <span
                key={index}
                className="inline-block"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </h2>
        <p className="animated-text text-xl text-light mb-8">
          It&apos;s always good to see <b>you</b>.
        </p>
      </div>
    </div>
  );
}
