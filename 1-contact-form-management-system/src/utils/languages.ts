import usFlag from "src/assets/us.jpg";
import turkey from "src/assets/turkey.jpg";

type Language = {
  label: string;
  flag: any;
};

type Languages = {
  [key: string]: Language;
};

export const languages: Languages = {
  en: {
    label: "English",
    flag: usFlag,
  },
  tr: {
    label: "Turkish",
    flag: turkey,
  },
};
