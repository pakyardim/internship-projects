import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  PrimaryButton,
  Spinner,
  DarkModeToggle,
  LanguageDropdown,
  PasswordInput,
} from "src/components/ui";
import { MobileNavbar } from "src/components/mobile-nav";
import { AuthSection } from "src/components";
import { useAuthContext } from "src/contexts";

const schema = yup.object().shape({
  username: yup.string().required("required"),
  password: yup.string().required("required"),
});

type Login = yup.InferType<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const {
    functions: { login },
    values: { loading },
  } = useAuthContext();

  const { control, handleSubmit } = useForm<Login>({
    resolver: yupResolver(schema),
  });

  const { t } = useTranslation();

  const onSubmit = async (data: Login) => {
    const response = await login(data);
    if (response) {
      navigate("/dashboard");
    }
  };

  return (
    <div className={`relative w-screen h-screen flex`}>
      <div className="absolute top-5 right-5 ">
        <div className="hidden sm:flex items-center gap-3">
          <DarkModeToggle />
          <LanguageDropdown />
        </div>
        <MobileNavbar />
      </div>
      <AuthSection />
      <div className="h-full w-full lg:w-3/5 bg-secondary transition-colors duration-300 dark:bg-darkBackground">
        <div className="flex font-primary flex-col w-full h-full mt-20 sm:mt-0 sm:justify-center items-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-5 justify-center items-center"
          >
            <h1 className="uppercase text-2xl flex font-bold text-primary">
              Contact
              <span className="text-dark dark:text-light">Form</span>
              Hub
            </h1>
            <div className="flex flex-col gap-3 w-3/4 md:w-1/2 max-w-2xl">
              <Controller
                control={control}
                name="username"
                defaultValue={""}
                render={({ field: { onChange, value } }) => (
                  <input
                    className="h-12 shadow-custom dark:bg-dark w-full z-10 p-2 border-2 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    type="text"
                    value={value}
                    onChange={onChange}
                    id="username"
                    name="username"
                    placeholder={t("username")}
                    required
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                defaultValue={""}
                render={({ field: { onChange, value } }) => (
                  <PasswordInput value={value} onChange={onChange} />
                )}
              />

              <div className="flex justify-center mt-2">
                <PrimaryButton
                  type="submit"
                  isDisabled={loading}
                  classname="h-12 md:py-0 px-6 lg:px-8 bg-primary"
                >
                  <div className="flex items-center gap-x-2">
                    <p>{loading ? t("Logging in") : t("Log in")}</p>
                    {loading && <Spinner size={4} />}
                  </div>
                </PrimaryButton>
              </div>
              <div className="font-primary text-xs sm:text-sm mt-2">
                <p className="text-grayish text-center">
                  {t("Don't have an account?")}{" "}
                  <Link to="/" className="text-primary">
                    <span className="text-primary cursor-pointer hover:underline">
                      {t("go back")}
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
