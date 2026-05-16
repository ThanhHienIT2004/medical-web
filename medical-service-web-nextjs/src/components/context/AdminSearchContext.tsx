"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type AdminSearchContextValue = {
  tableSearchTerm: string;
  setTableSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const AdminSearchContext = createContext<AdminSearchContextValue | null>(null);

export function AdminSearchProvider({ children }: { children: React.ReactNode }) {
  const [tableSearchTerm, setTableSearchTerm] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    setTableSearchTerm("");
  }, [pathname]);

  const value = useMemo(
    () => ({
      tableSearchTerm,
      setTableSearchTerm,
    }),
    [tableSearchTerm]
  );

  return <AdminSearchContext.Provider value={value}>{children}</AdminSearchContext.Provider>;
}

export function useAdminSearch() {
  const context = useContext(AdminSearchContext);

  if (!context) {
    throw new Error("useAdminSearch must be used within an AdminSearchProvider");
  }

  return context;
}
