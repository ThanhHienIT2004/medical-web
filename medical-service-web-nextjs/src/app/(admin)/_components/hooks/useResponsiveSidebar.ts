"use client";

import { useEffect, useState } from "react";

export function useResponsiveSidebar(defaultDesktopOpen = true, desktopMinWidth = 1024) {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isOpen, setIsOpen] = useState(defaultDesktopOpen);

  useEffect(() => {
    const updateFromWidth = (width: number) => {
      setWindowWidth(width);
      setIsOpen(width >= desktopMinWidth ? defaultDesktopOpen : false);
    };

    updateFromWidth(window.innerWidth);
    const onResize = () => updateFromWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [defaultDesktopOpen, desktopMinWidth]);

  return {
    isOpen,
    setIsOpen,
    windowWidth,
    isDesktop: windowWidth >= desktopMinWidth,
  };
}
