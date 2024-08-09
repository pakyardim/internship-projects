import { useState } from "react";
import { useTranslations } from "next-intl";

import * as yup from "yup";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useMutation } from "@tanstack/react-query";

import { PrimaryButton, Spinner, ImagePicker } from "src/components/ui";
// import { useSnackbar } from "src/contexts";
// import { addUser, editUser } from "src/fetchers";
import { UserType } from "src/types";

const schema = yup.object().shape({
  id: yup.string(),
  username: yup.string().required("required").min(3, "more3").max(10, "less10"),
  password: yup.string().required("required").min(3, "more3").max(10, "less10"),
  base64Photo: yup.string().required("required"),
});

type User = yup.InferType<typeof schema>;

interface Props {
  isEdit: boolean;
  user?: UserType | null;
}

export function UserForm({ isEdit, user }: Props) {
  // const [showPassword, setShowPassword] = useState<boolean>(false);

  // function togglePasswordVisibility(e: React.MouseEvent<HTMLButtonElement>) {
  //   e.preventDefault();
  //   setShowPassword(!showPassword);
  // }

  // const {
  //   handleSubmit,
  //   formState: { errors },
  //   control,
  //   reset,
  // } = useForm<User>({
  //   resolver: yupResolver(schema),
  //   defaultValues: {
  //     username: user?.username,
  //     password: user?.password,
  //     base64Photo: user?.base64Photo,
  //   },
  // });

  // const { showSnackbar } = useSnackbar();

  // const { mutate: addMutate, isPending: isAddPending } = useMutation({
  //   mutationFn: addUser,
  //   retry: 1,
  //   onSuccess: () => {
  //     showSnackbar("successMsg", "success");
  //     reset();
  //   },
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   onError: (error: any) => {
  //     showSnackbar(
  //       error.response.data.error || error.response.statusText,
  //       "error"
  //     );
  //   },
  // });

  // const { mutate: editMutate, isPending: isEditPending } = useMutation({
  //   mutationFn: editUser,
  //   retry: 1,
  //   onSuccess: () => {
  //     showSnackbar("successMsg", "success");
  //     reset();
  //   },
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   onError: (error: any) => {
  //     showSnackbar(
  //       error.response.data.error || error.response.statusText,
  //       "error"
  //     );
  //   },
  // });

  const t = useTranslations();

  // const onSubmit: SubmitHandler<User> = (data: User) => {
  //   if (isEdit) {
  //     data.id = user?.id;
  //     return editMutate(data);
  //   }

  //   addMutate(data);
  // };

  return (
    <div className="w-full sm:w-1/2 flex items-center justify-center">
      {/* <div className="dark:bg-dark w-full sm:w-11/12 lg:w-auto dark:text-secondary dark:border-light relative bg-white card z-10 font-bold border border-darkBackground">
        <div className="absolute top-0 left-0 w-full h-full bg-image -z-10"></div>
        <h2 className="text-2xl lg:text-3xl mb-5 font-semibold">
          {isEdit ? t("editUser") : t("newUser")}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="relative">
            <label
              htmlFor="base64Photo"
              className={`${
                errors.base64Photo && "text-primary"
              } block lowercase text-lg font-medium mb-1`}
            >
              {t("photo")}
            </label>
            <Controller
              control={control}
              name="base64Photo"
              defaultValue={""}
              render={({ field: { onChange, value } }) => (
                <ImagePicker onChange={onChange} value={value} />
              )}
            />
            {errors.base64Photo && (
              <p className="absolute left-0 text-sm text-primary">
                {t(errors.base64Photo?.message || "defaultError")}
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="username"
              className={`${
                errors.username && "text-primary"
              } block text-lg font-medium`}
            >
              {t("username")}
            </label>
            <Controller
              control={control}
              name="username"
              defaultValue={""}
              render={({ field: { onChange, value } }) => (
                <>
                  <input
                    type="text"
                    autoComplete="off"
                    disabled={isEdit}
                    value={value}
                    onChange={onChange}
                    id="username"
                    name="username"
                    className={`dark:bg-dark w-full z-10 p-2 border-b-2 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 ${
                      errors.username && "border-primary"
                    }`}
                  />
                  {value && value?.length > 0 && (
                    <p className="absolute right-0">
                      <span
                        className={`${value.length > 10 ? "text-primary" : ""}`}
                      >
                        {value.length}
                      </span>
                      /10
                    </p>
                  )}
                </>
              )}
            />
            {errors.username && (
              <p className="absolute left-0 text-sm text-primary">
                {t(errors.username?.message || "defaultError")}
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className={`${
                errors.password && "text-primary"
              } block text-lg font-medium`}
            >
              {t("password")}
            </label>
            <Controller
              control={control}
              name="password"
              defaultValue={""}
              render={({ field: { onChange, value } }) => (
                <>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={value}
                      onChange={onChange}
                      id="password"
                      name="password"
                      className={`dark:bg-dark w-full z-10 p-2 border-b-2 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 ${
                        errors.password && "border-primary"
                      }`}
                    />
                    <button
                      className="absolute top-0 text-sm right-0 w-10 h-full text-gray-500 focus:outline-none"
                      onClick={(e) => togglePasswordVisibility(e)}
                    >
                      {showPassword ? "🙈" : "🐵"}
                    </button>
                  </div>
                  {value && value?.length > 0 && (
                    <p className="absolute right-0">
                      <span
                        className={`${value.length > 10 ? "text-primary" : ""}`}
                      >
                        {value.length}
                      </span>
                      /10
                    </p>
                  )}
                </>
              )}
            />
            {errors.password && (
              <p className="absolute left-0 text-sm text-primary">
                {t(errors.password?.message || "defaultError")}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="role"
              className="lowercase block text-lg font-medium"
            >
              {t("role")}
            </label>
            <input
              type="text"
              disabled
              autoComplete="off"
              value={user?.role || "reader"}
              id="role"
              name="role"
              className="dark:bg-dark w-full z-10 p-2 border-b-2 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>

          <div className="flex w-full justify-end">
            <PrimaryButton
              type="submit"
              isDisabled={isEditPending || isAddPending}
              classname="py-3 lg:py-4 px-6 lg:px-8 bg-primary"
            >
              <div className="flex items-center gap-x-2">
                <p>
                  {isEditPending || isAddPending
                    ? t("Submitting")
                    : t("Submit")}
                </p>
                {(isEditPending || isAddPending) && <Spinner size={4} />}
              </div>
            </PrimaryButton>
          </div>
        </form>
      </div> */}
    </div>
  );
}
