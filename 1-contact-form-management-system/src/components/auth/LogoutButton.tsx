"use client";

import { CiLogout } from "react-icons/ci";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "src/features/store";
import { useSnackbar } from "src/contexts/snackbarContext";
import { logoutUser } from "src/features/slices/auth";

export function LogoutButton() {
  const t = useTranslations();

  const { errorMessage, status } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch: AppDispatch = useDispatch();
  const locale = useLocale();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.replace(`/${locale}`);
    } catch (error: any) {
      showSnackbar(errorMessage || error?.message, "error");
    }
  };

  return (
    <button
      disabled={status === "loading"}
      onClick={handleLogout}
      className={`font-primary flex flex-row justify-center items-center p-2 border-2 text-primary border-primary font-bold hover:text-white hover:bg-primary text-sm duration-300 cursor-pointer`}
    >
      <CiLogout size={20} />
      <span className="ml-2">
        {status === "loading" ? t("Logging Out") : t("Logout")}
      </span>
    </button>
  );
}
