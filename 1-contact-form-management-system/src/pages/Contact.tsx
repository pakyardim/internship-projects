import { useTranslation, Trans } from "react-i18next";

import heroImg from "src/assets/hero2.png";
import { HighlightedText } from "src/components/ui/HighlightedText";
import { ContactForm } from "src/components/ContactForm";

export function Contact() {
  const { t } = useTranslation();

  const text = t("contactHeader");
  const textArray = text.split(/(?!$)/u);

  return (
    <main className="flex flex-col gap-8 sm:flex-row sm:gap-6 p-8 sm:p-12 lg:gap-8 lg:p-20 transition-colors duration-300 bg-secondary dark:bg-darkBackground font-primary flex-1 items-center border-b">
      <div className="w-full sm:w-1/2 dark:text-secondary flex flex-col gap-8 items-center">
        <div>
          <h1 className="hero-text text-4xl lg:text-5xl mb-5 w-[90%]">
            {textArray.map((char, index) => {
              if (index > 6) {
                return <HighlightedText key={index}>{char}</HighlightedText>;
              }
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
          </h1>
          <p className="animated-text text-xl lg:text-2xl">
            <Trans i18nKey="contactParagraph">
              Feel free to <b>reach out</b> to us with any questions or{" "}
              <b>concerns</b> you may have. <b>We</b> will get back to you as
              soon as <b>possible</b>
            </Trans>
          </p>
        </div>
        <div className="h-40 lg:h-60">
          <img className="w-full h-full" src={heroImg} alt="ash and pikachu" />
        </div>
      </div>
      <ContactForm />
    </main>
  );
}
