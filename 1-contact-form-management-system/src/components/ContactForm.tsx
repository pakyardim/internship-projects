import { useTranslation, Trans } from "react-i18next";
import * as yup from "yup";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { HighlightedText } from "src/components/ui/HighlightedText";
import { PrimaryButton } from "src/components/ui/PrimaryButton";
import { CustomDropdown } from "src/components/ui/CustomDropdown";
import { fetchCountries, submitContactForm } from "src/fetchers/contact";
import { Spinner } from "./ui/Spinner";
import { useSnackbar } from "src/contexts/SnackbarContext";

const schema = yup.object().shape({
  name: yup.string().required("required").min(3, "more3").max(50, "less50"),
  country: yup.string().required("required"),
  gender: yup.string().required("required"),
  message: yup.string().required("required").max(500, "less500"),
});

type Contact = yup.InferType<typeof schema>;

export function ContactForm() {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<Contact>({ resolver: yupResolver(schema) });

  const { showSnackbar } = useSnackbar();

  const { data, status } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    retry: 1,
    gcTime: 1000 * 60,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: submitContactForm,
    retry: 1,
    onSuccess: () => {
      showSnackbar("successMsg", "success");
      reset();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      showSnackbar(error.response.data.error, "error");
    },
  });

  const countries = data?.countries;

  const { t } = useTranslation();

  const onSubmit: SubmitHandler<Contact> = (data: Contact) => {
    mutate(data);
  };

  return (
    <div className="w-1/2 flex items-center justify-center">
      <div className="dark:bg-dark dark:text-secondary dark:border-light relative bg-white card z-10 font-bold border border-darkBackground">
        <div className="absolute top-0 left-0 w-full h-full bg-image -z-10"></div>
        <h2 className="text-3xl mb-5">
          <Trans i18nKey="formHeader">
            Send us a <HighlightedText>message</HighlightedText>
          </Trans>
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="relative">
            <label
              htmlFor="name"
              className={`${
                errors.name && "text-primary"
              } block text-lg font-medium`}
            >
              {t("name")}
            </label>
            <Controller
              control={control}
              name="name"
              defaultValue={""}
              render={({ field: { onChange, value } }) => (
                <>
                  <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    id="name"
                    name="name"
                    className={`dark:bg-dark w-full z-10 p-2 border-b-2 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 ${
                      errors.name && "border-primary"
                    }`}
                  />
                  {value?.length > 0 && (
                    <p className="absolute right-0">
                      <span
                        className={`${value.length > 50 ? "text-primary" : ""}`}
                      >
                        {value.length}
                      </span>
                      /50
                    </p>
                  )}
                </>
              )}
            />
            {errors.name && (
              <p className="absolute left-0 text-sm text-primary">
                {t(errors.name?.message || "defaultError")}
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="country"
              className={`${
                errors.country && "text-primary"
              } block text-lg font-medium`}
            >
              {t("country")}
            </label>
            <CustomDropdown
              isLoading={status === "pending"}
              options={countries}
              control={control}
              isError={errors.country ? true : false}
              setValue={(val: string) => {
                setValue("country", val);
              }}
            />
            {errors.country && (
              <p className="absolute left-0 text-sm text-primary">
                {t(errors.country?.message || "defaultError")}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="message"
              className={`${
                errors.message && "text-primary"
              } block text-lg font-medium`}
            >
              {t("message")}
            </label>
            <Controller
              control={control}
              name="message"
              defaultValue={""}
              render={({ field: { onChange, value } }) => (
                <>
                  <textarea
                    id="message"
                    rows={4}
                    name="message"
                    value={value}
                    onChange={onChange}
                    className={`dark:bg-dark w-full resize-none p-2 border-b-2 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 ${
                      errors.message && "border-primary"
                    }`}
                  ></textarea>
                  {value?.length > 0 && (
                    <p className="absolute right-0">
                      <span
                        className={`${
                          value.length > 500 ? "text-primary" : ""
                        }`}
                      >
                        {value.length}
                      </span>
                      /500
                    </p>
                  )}
                </>
              )}
            />
            {errors.message && (
              <p className="absolute left-0 text-sm text-primary">
                {t(errors.message?.message || "defaultError")}
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="gender"
              className={`${
                errors.gender && "text-primary"
              } block text-lg font-medium mb-2`}
            >
              {t("gender")}
            </label>
            <div className="flex gap-4">
              <Controller
                control={control}
                name="gender"
                defaultValue={""}
                render={({ field: { onChange } }) => (
                  <>
                    <label
                      className={`${
                        errors.gender && "text-primary"
                      } cursor-pointer flex items-center`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        onChange={onChange}
                        value="male"
                        className="hidden peer"
                      />
                      <span className="radio-custom"></span>
                      <span className="ml-2">{t("male")}</span>
                    </label>
                    <label
                      className={`${
                        errors.gender && "text-primary"
                      } cursor-pointer flex items-center`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        onChange={onChange}
                        value="female"
                        className="hidden peer"
                      />
                      <span className="radio-custom"></span>
                      <span className="ml-2">{t("female")}</span>
                    </label>
                  </>
                )}
              />
            </div>
            {errors.gender && (
              <p className="absolute left-0 text-sm text-primary">
                {t(errors.gender?.message || "defaultError")}
              </p>
            )}
          </div>
          <div className="flex w-full justify-end">
            <PrimaryButton isDisabled={isPending}>
              <div className="flex items-center gap-x-2">
                <p>{isPending ? t("Submitting") : t("Submit")}</p>
                {isPending && <Spinner size={4} />}
              </div>
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
