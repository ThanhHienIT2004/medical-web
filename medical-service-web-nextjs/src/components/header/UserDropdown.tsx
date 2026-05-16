"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ChevronDown, CircleHelp, LogOut, Settings, UserCircle2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

function toDisplayName(name?: string | null, email?: string | null) {
  const cleanName = name?.trim();

  if (cleanName && cleanName.length > 1) {
    return cleanName;
  }

  const emailPrefix = email?.split("@")[0]?.trim();

  if (!emailPrefix) {
    return "Người dùng";
  }

  return emailPrefix
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitial(name?: string | null, email?: string | null) {
  const source = toDisplayName(name, email);
  return source.charAt(0).toUpperCase();
}

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { data: session } = useSession();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const menuIconClass =
    "h-5 w-5 text-gray-500 transition-colors group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300";
  const userName = toDisplayName(session?.user?.name, session?.user?.email);
  const userEmail = session?.user?.email?.trim() || "Chưa có email";
  const userAvatar = session?.user?.image?.trim() || "";
  const showAvatarImage = Boolean(userAvatar) && !imageError;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-sm font-semibold text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
          {showAvatarImage ? (
            <Image
              width={44}
              height={44}
              src={userAvatar}
              alt={userName}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            getInitial(session?.user?.name, session?.user?.email)
          )}
        </span>

        <span className="mr-1 max-w-[140px] truncate font-medium text-theme-sm">{userName}</span>

        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 dark:text-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {userName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {userEmail}
          </span>
        </div>

        <ul className="flex flex-col gap-1 border-b border-gray-200 pb-3 pt-4 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <UserCircle2 className={menuIconClass} />
              Hồ sơ
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <Settings className={menuIconClass} />
              Cài đặt tài khoản
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <CircleHelp className={menuIconClass} />
              Hỗ trợ
            </DropdownItem>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: "/login" })}
          className="group mt-3 flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <LogOut className={menuIconClass} />
          Đăng xuất
        </button>
      </Dropdown>
    </div>
  );
}
