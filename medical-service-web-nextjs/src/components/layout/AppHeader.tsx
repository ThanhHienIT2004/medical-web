"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import { useAdminSearch } from "@/components/context/AdminSearchContext";
import UserDropdown from "@/components/header/UserDropdown";
import NotificationDropdown from "../header/NotificationDropdown";
import { useSidebar } from "../context/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Menu, MoreHorizontal, Search, X } from "lucide-react";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { tableSearchTerm, setTableSearchTerm } = useAdminSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-99999 flex w-full border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="grow lg:px-6">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
            <button
              className="z-99999 hidden h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400 lg:flex"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
              type="button"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="lg:hidden">
              <Image
                width={154}
                height={32}
                className="dark:hidden"
                src="./images/logo/logo.svg"
                alt="Logo"
              />
              <Image
                width={154}
                height={32}
                className="hidden dark:block"
                src="./images/logo/logo-dark.svg"
                alt="Logo"
              />
            </Link>

            <button
              onClick={toggleApplicationMenu}
              type="button"
              className="z-99999 flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            <div className="hidden lg:block">
              <form onSubmit={(event) => event.preventDefault()}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={tableSearchTerm}
                    onChange={(event) => setTableSearchTerm(event.target.value)}
                    placeholder="Tìm trong bảng hiện tại..."
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                  />

                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
                  >
                    <span>⌘</span>
                    <span>K</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div
            className={`${
              isApplicationMenuOpen ? "flex" : "hidden"
            } w-full items-center justify-between gap-4 px-5 py-4 shadow-theme-md lg:flex lg:justify-end lg:px-0 lg:shadow-none`}
          >
            <div className="flex items-center gap-2 2xsm:gap-3">
              <ThemeToggleButton />
              <NotificationDropdown />
            </div>
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
