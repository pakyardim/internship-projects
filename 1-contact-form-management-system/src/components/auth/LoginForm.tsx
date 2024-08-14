"use client";
import * as yup from "yup";
import React from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { useSnackbar } from "src/contexts/snackbarContext";
import { RootState, AppDispatch } from "src/features/store";
import { loginUser } from "src/features/slices/auth";
import { usersAPI, messagesAPI } from "src/features/slices";
import { PrimaryButton, Spinner } from "src/components/common";
import { PasswordInput } from "src/components/auth";

const schema = yup.object().shape({
  username: yup.string().required("required"),
  password: yup.string().required("required"),
});

type Login = yup.InferType<typeof schema>;

export function LoginForm() {
  const locale = useLocale();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { errorMessage, status } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch: AppDispatch = useDispatch();

  const { control, handleSubmit } = useForm<Login>({
    resolver: yupResolver(schema),
  });

  const t = useTranslations();

  const onSubmit = async (data: Login) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      dispatch(usersAPI.util.resetApiState());
      dispatch(messagesAPI.util.resetApiState());
      router.replace(`/${locale}/dashboard`);
    } catch (error: any) {
      showSnackbar(errorMessage || error?.message, "error");
    }
  };

  return (
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
              isDisabled={status === "loading"}
              classname="h-12 md:py-0 px-6 lg:px-8 bg-primary"
            >
              <div className="flex items-center gap-x-2">
                <p>{status === "loading" ? t("Logging in") : t("Log in")}</p>
                {status === "loading" && <Spinner size={4} />}
              </div>
            </PrimaryButton>
          </div>
          <div className="font-primary text-xs sm:text-sm mt-2">
            <p className="text-grayish text-center">
              {t("Don't have an account?")}{" "}
              <Link href="/" className="text-primary">
                <span className="text-primary cursor-pointer hover:underline">
                  {t("go back")}
                </span>
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
