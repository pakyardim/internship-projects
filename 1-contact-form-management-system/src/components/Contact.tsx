import { useTranslation, Trans } from "react-i18next";
import { HighlightedText } from "src/components/ui/HighlightedText";
import { PrimaryButton } from "src/components/ui/PrimaryButton";
import { CustomDropdown } from "src/components/ui/CustomDropdown";
import heroImg from "src/assets/hero2.png";

export function Contact() {
  const { t } = useTranslation();

  const text = t("contactHeader");
  const textArray = text.split(/(?!$)/u);
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

  return (
    <main className="transition-colors duration-300 bg-secondary dark:bg-darkBackground flex font-primary flex-1 gap-8 p-20 items-center border-b">
      <div className="w-1/2 dark:text-secondary flex flex-col gap-8 items-center">
        <div>
          <h1 className="hero-text text-5xl mb-5 w-[90%]">
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
          <p className="animated-text text-2xl">
            <Trans i18nKey="contactParagraph">
              Feel free to <b>reach out</b> to us with any questions or{" "}
              <b>concerns</b> you may have. <b>We</b> will get back to you as
              soon as <b>possible</b>
            </Trans>
          </p>
        </div>
        <div className="h-60">
          <img className="w-full h-full" src={heroImg} alt="ash and pikachu" />
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="dark:bg-dark dark:text-secondary dark:border-light relative bg-white card z-10 font-bold border border-darkBackground">
          <div className="absolute top-0 left-0 w-full h-full bg-image -z-10"></div>
          <h2 className="text-3xl mb-5">
            <Trans i18nKey="formHeader">
              Send us a <HighlightedText>message</HighlightedText>
            </Trans>
          </h2>
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-lg font-medium">
                {t("name")}
              </label>
              <input
                type="text"
                id="name"
                className="dark:bg-dark w-full z-10 p-2 border-b-2 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-lg font-medium">
                {t("country")}
              </label>
              <CustomDropdown options={options} />
            </div>

            <div>
              <label htmlFor="message" className="block text-lg font-medium">
                {t("message")}
              </label>
              <textarea
                id="message"
                rows={4}
                className="dark:bg-dark w-full p-2 border-b-2 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-lg font-medium mb-2"
              >
                {t("gender")}
              </label>
              <div className="flex gap-4">
                <label className="cursor-pointer flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="hidden peer"
                  />
                  <span className="radio-custom"></span>
                  <span className="ml-2">{t("male")}</span>
                </label>
                <label className="cursor-pointer flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="hidden peer"
                  />
                  <span className="radio-custom"></span>
                  <span className="ml-2">{t("female")}</span>
                </label>
              </div>
            </div>
            <div className="flex w-full justify-end">
              <PrimaryButton>{t("Submit")}</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
