"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/features/store";
import { logoutUser } from "src/features/slices/auth";
import { useRouter } from "next/navigation";
import { useSnackbar } from "src/contexts/snackbarContext";

export function UserProfileDropdown() {
  const { user, errorMessage } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const locale = useLocale();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLImageElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 150);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.replace(`/${locale}`);
    } catch (error: any) {
      showSnackbar(errorMessage || error?.message, "error");
    }
  };

  return (
    <div className="relative">
      <div
        ref={dropdownRef}
        tabIndex={0}
        onBlur={handleBlur}
        onClick={toggleDropdown}
        className="flex cursor-pointer w-8 h-8 relative"
      >
        {user && (
          <Image
            src={user.base64Photo}
            alt="User Profile"
            fill
            className="object-cover rounded-full cursor-pointer"
          />
        )}
      </div>
      {isOpen && (
        <div className="font-primary text-center rounded shadow-custom absolute right-0 mt-2 w-40 bg-white border border-darkBackground">
          <div className="px-4 py-2">
            <span className="block text-gray-700">{user?.username}</span>
          </div>
          <div className="border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="text-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 hover:rounded"
            >
              {t("Logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
