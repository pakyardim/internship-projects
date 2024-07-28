import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "src/contexts/authContext";

export function UserProfileDropdown() {
  const {
    functions: { logout },
    values: { user },
  } = useAuthContext();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLImageElement>(null);
  const queryClient = useQueryClient();

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
    queryClient.invalidateQueries();
    await logout();
    navigate("/");
  };

  return (
    <div className="relative">
      <div
        ref={dropdownRef}
        tabIndex={0}
        onBlur={handleBlur}
        onClick={toggleDropdown}
        className="flex cursor-pointer w-8 h-8"
      >
        <img
          src={user?.base64Photo}
          alt="User Profile"
          className="object-cover w-full h-full rounded-full cursor-pointer"
        />
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
