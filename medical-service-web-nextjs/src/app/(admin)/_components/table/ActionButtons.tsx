"use client";

import { useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";

export type ActionButtonsProps = {
  onView?: () => void | Promise<void>;
  onEdit?: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  confirmDelete?: boolean;
  confirmTitle?: string;
  confirmMessage?: string;
};

export default function ActionButtons({
  onView,
  onEdit,
  onDelete,
  canView = true,
  canEdit = true,
  canDelete = true,
  confirmDelete = true,
  confirmTitle = "Xac nhan xoa",
  confirmMessage = "Ban co chac chan muon xoa ban ghi nay khong?",
}: ActionButtonsProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
      setOpenConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {canView && onView ? (
          <button
            type="button"
            onClick={() => void onView()}
            title="Xem"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-violet-200 text-violet-600 hover:bg-violet-50"
          >
            <Eye size={16} />
          </button>
        ) : null}

        {canEdit && onEdit ? (
          <button
            type="button"
            onClick={() => void onEdit()}
            title="Sua"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-violet-200 text-violet-600 hover:bg-violet-50"
          >
            <Pencil size={16} />
          </button>
        ) : null}

        {canDelete && onDelete ? (
          <button
            type="button"
            onClick={() => {
              if (confirmDelete) {
                setOpenConfirm(true);
                return;
              }
              void handleDelete();
            }}
            title="Xoa"
            disabled={deleting}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            <Trash size={16} />
          </button>
        ) : null}
      </div>

      {openConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">{confirmTitle}</h3>
            <p className="mt-2 text-sm text-gray-600">{confirmMessage}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpenConfirm(false)}
                disabled={deleting}
                className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Dang xoa..." : "Xac nhan"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
