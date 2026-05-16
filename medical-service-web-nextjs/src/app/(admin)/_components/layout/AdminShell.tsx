"use client";

import React, { useEffect, useState } from "react";

import { ADMIN_SIDEBAR_ITEMS } from "@/app/(admin)/_values/constants";
import { useSidebar } from "@/components/context/SidebarContext";
import AdminSidebar from "@/app/(admin)/_components/sidebar/AdminSidebar";

interface AdminShellProps {
  header?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminShell({ header, children }: AdminShellProps) {
  const { isExpanded, isMobileOpen, toggleMobileSidebar } = useSidebar();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const syncWidth = () => setWindowWidth(window.innerWidth);
    syncWidth();
    window.addEventListener("resize", syncWidth);
    return () => window.removeEventListener("resize", syncWidth);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isSidebarVisible = isDesktop ? isExpanded : isMobileOpen;
  const sidebarWidthClass = isSidebarVisible ? "w-[300px]" : "w-0";

  return (
    <div className="min-h-screen bg-zinc-700/5 dark:bg-zinc-900">
      <div className="flex">
        <div
          className={`${sidebarWidthClass} fixed left-0 top-0 z-30 h-screen overflow-hidden transition-all duration-300`}
        >
          <AdminSidebar title="Quản lí phòng khám" items={ADMIN_SIDEBAR_ITEMS} />
        </div>

        <main
          className={`${isSidebarVisible ? "ml-[300px]" : "ml-0"} min-w-0 flex-1 transition-all duration-300`}
          onClick={() => {
            if (!isDesktop && isMobileOpen) toggleMobileSidebar();
          }}
        >
          {header}
          <div className="w-full overflow-x-auto px-4 pb-8 pt-0 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
