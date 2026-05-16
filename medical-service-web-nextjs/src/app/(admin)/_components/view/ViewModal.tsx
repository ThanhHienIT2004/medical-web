"use client";

import React from "react";

export type ViewField = { label: string; key: string };

export interface ViewModalProps<T = Record<string, unknown>> {
  isOpen: boolean;
  item?: T | null;
  title?: string;
  fields?: ViewField[];
  renderContent?: (item: T) => React.ReactNode;
  onClose: () => void;
}

export default function ViewModal<T = Record<string, unknown>>({
  isOpen,
  item,
  title = "Chi tiết",
  fields,
  renderContent,
  onClose,
}: ViewModalProps<T>) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-6 py-4 bg-violet-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Đóng
            </button>
          </div>
        </div>

        <div className="space-y-3 px-6 py-5">
          {renderContent ? (
            renderContent(item)
          ) : fields && fields.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-600">{f.label}</p>
                  <p className="mt-1 text-base text-gray-900">{String(((item as Record<string, unknown>)[f.key] ?? "-"))}</p>
                </div>
              ))}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{JSON.stringify(item, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
