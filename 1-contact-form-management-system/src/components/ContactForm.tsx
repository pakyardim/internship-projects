"use client";
import { useTranslations } from "next-intl";
import * as yup from "yup";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  HighlightedText,
  PrimaryButton,
  CustomDropdown,
  Spinner,
} from "src/components/ui";
import { useSnackbar } from "src/contexts/snackbarContext";
import {
  useAddMessageMutation,
  useGetAllCountriesQuery,
} from "src/features/slices";

const schema = yup.object().shape({
  name: yup.string().required("required").min(3, "more3").max(50, "less50"),
  message: yup.string().required("required").max(500, "less500"),
  country_id: yup.number().required("required"),
  gender_id: yup.number().required("required"),
});

type Contact = yup.InferType<typeof schema>;

export function ContactForm() {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<Contact>({
    resolver: yupResolver(schema),
    defaultValues: {
      gender_id: 1,
    },
  });

  const t = useTranslations();

  const { showSnackbar } = useSnackbar();

  const { data, isLoading } = useGetAllCountriesQuery("");

  const countries = data?.countries;

  const [addMessage, { isLoading: isSubmitLoading }] = useAddMessageMutation();

  const onSubmit: SubmitHandler<Contact> = async (data) => {
    try {
      await addMessage(data).unwrap();
      showSnackbar("successMsg", "success");
      reset();
      reset({ gender_id: 1 });
    } catch (error: any) {
      showSnackbar(error.response.data.error, "error");
    }
  };

  return (
    <div className="w-full sm:w-1/2 flex items-center justify-center">
      <div className="dark:bg-dark transition-colors duration-300 w-full sm:w-11/12 lg:w-auto dark:text-secondary dark:border-light relative bg-white card z-10 font-bold border border-darkBackground">
        <div className="absolute top-0 left-0 w-full h-full bg-image -z-10"></div>
        <h2 className="text-2xl lg:text-3xl mb-5">
          Send us a <HighlightedText>message</HighlightedText>
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
              htmlFor="country_id"
              className={`${
                errors.country_id && "text-primary"
              } block text-lg font-medium`}
            >
              {t("country")}
            </label>
            <Controller
              control={control}
              name="country_id"
              render={({ field: { onChange, value } }) => (
                <CustomDropdown
                  isLoading={isLoading}
                  options={countries}
                  isError={errors.country_id ? true : false}
                  onChange={onChange}
                  value={value}
                  reset={() => setValue("country_id", -1)}
                />
              )}
            />
            {errors.country_id && (
              <p className="absolute left-0 text-sm text-primary">
                {t(errors.country_id?.message || "defaultError")}
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
              htmlFor="gender_id"
              className={`${
                errors.gender_id && "text-primary"
              } block text-lg font-medium mb-2`}
            >
              {t("gender")}
            </label>
            <div className="flex gap-4">
              <Controller
                control={control}
                name="gender_id"
                render={({ field: { onChange, value } }) => (
                  <>
                    <label
                      className={`${
                        errors.gender_id && "text-primary"
                      } cursor-pointer flex items-center`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        onChange={() => onChange(1)}
                        checked={value === 1}
                        value="male"
                        className="hidden peer"
                      />
                      <span className="radio-custom"></span>
                      <span className="ml-2">{t("male")}</span>
                    </label>
                    <label
                      className={`${
                        errors.gender_id && "text-primary"
                      } cursor-pointer flex items-center`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        onChange={() => onChange(2)}
                        checked={value === 2}
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
            {errors.gender_id && (
              <p className="absolute left-0 text-sm text-primary">
                {t(errors.gender_id?.message || "defaultError")}
              </p>
            )}
          </div>
          <div className="flex w-full justify-end">
            <PrimaryButton
              type="submit"
              isDisabled={isSubmitLoading}
              classname="py-3 lg:py-4 px-6 lg:px-8 bg-primary"
            >
              <div className="flex items-center gap-x-2">
                <p>{isSubmitLoading ? t("Submitting") : t("Submit")}</p>
                {isSubmitLoading && <Spinner size={4} />}
              </div>
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
