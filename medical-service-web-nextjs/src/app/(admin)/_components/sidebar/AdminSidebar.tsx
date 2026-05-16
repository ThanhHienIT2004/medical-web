'use client';

import React, { ComponentType, useMemo, useState } from 'react';
import Link from 'next/link';
import {Moon, Search, Settings2, Stethoscope, LucideProps} from 'lucide-react';
import { usePathname } from 'next/navigation';

export interface SidebarItem {
  title: string;
  href: string;
  icon?: ComponentType<LucideProps>;
}

interface AdminSidebarProps {
  title: string;
  items: SidebarItem[];
}

export function AdminSidebar({
  title,
  items,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [menuSearchTerm, setMenuSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    const term = menuSearchTerm.trim().toLowerCase();

    if (!term) {
      return items;
    }

    return items.filter((item) => item.title.toLowerCase().includes(term));
  }, [items, menuSearchTerm]);
  
  return (
    <aside className="h-screen text-gray-800 dark:text-gray-100">
      <div className="h-full w-[300px] overflow-hidden border border-gray-200 bg-white/95 shadow-sm dark:border-gray-700 dark:bg-zinc-900">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-200">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold truncate">{title}</h2>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Tìm menu"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                value={menuSearchTerm}
                onChange={(event) => setMenuSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="h-[calc(100vh-210px)] overflow-y-auto p-3">
            <p className="text-xs text-gray-500 px-2 mb-2">Menu</p>
            <ul className="space-y-1">
              {filteredItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors ${
                      pathname === item.href
                        ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200"
                        : "hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {item.icon ? <item.icon className="w-4 h-4 shrink-0" /> : null}
                    <span className="truncate">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {filteredItems.length === 0 ? (
              <p className="px-3 py-2 text-sm text-gray-500">Không tìm thấy menu phù hợp.</p>
            ) : null}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/20 p-3 mb-3">
              <p className="text-xs text-gray-500">Current plan:</p>
              <p className="font-semibold">Pro trial</p>
            </div>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm">
                <Settings2 className="w-4 h-4" /> Preferences
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm">
                <Moon className="w-4 h-4" /> Dark mode
              </button>
            </div>
          </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
