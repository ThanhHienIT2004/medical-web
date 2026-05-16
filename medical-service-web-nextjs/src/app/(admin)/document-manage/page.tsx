"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";


import ViewModal, { ViewField } from "@/app/(admin)/_components/view/ViewModal";


import type { CreateDocumentInput, Document, UpdateDocumentInput } from "@/types/documents";
import { apiClient } from "@/libs/api/apiClient";
import ConfirmationDialog from "@/app/(admin)/_components/dialog/ConfirmationDialog";
import AdminForm, { AdminFormProps } from "@/app/(admin)/_components/forms/AdminForm";
import { ActionAdminTable } from "@/app/(admin)/_components/table/AdminTable";
import AdminTableLayout from "@/app/(admin)/_components/table/AdminTableLayout";
import { logAdminAction } from "@/app/(admin)/_libs/auditLog";
import { getCrudAccess } from "@/app/(admin)/_libs/permissions";
import { buildCrudRowOperations } from "@/app/(admin)/_libs/tableCrud";

export default function DocumentManagePage() {
  const { data: session } = useSession();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<ActionAdminTable["type"]>("view");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<unknown[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const access = getCrudAccess(session, "documents");

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<Document[]>("/documents");
      setDocuments(Array.isArray(result) ? result : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Không thể tải tài liệu"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return documents;
    return documents.filter((d) => {
      const parts = [d.document_id, d.title, d.category, d.file_url, d.uploaded_by_id].join(" ").toLowerCase();
      return parts.includes(term);
    });
  }, [documents, searchTerm]);

  const total = filtered.length;
  const paged = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const selected = useMemo(
    () => (selectedId ? documents.find((d) => d.document_id === selectedId) ?? null : null),
    [documents, selectedId]
  );

  const createFields: AdminFormProps<CreateDocumentInput>["fields"] = [
    { label: "Tiêu đề", key: "title", type: "text", required: true },
    { label: "Category", key: "category", type: "text", required: true },
    { label: "File URL", key: "file_url", type: "text", required: true },
    { label: "Uploaded by (user id)", key: "uploaded_by_id", type: "text", required: true },
  ];

  const updateFields: AdminFormProps<UpdateDocumentInput>["fields"] = [
    { label: "Tiêu đề", key: "title", type: "text" },
    { label: "Category", key: "category", type: "text" },
    { label: "File URL", key: "file_url", type: "text" },
  ];

  const uploadFile = async (file: File): Promise<string> => {
    if (!session?.user?.accessToken) throw new Error("Chưa đăng nhập");
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";
    const url = `${base}/api/upload`;
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: form,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Upload failed: ${res.status}`);
    }
    const json = (await res.json()) as unknown;
    const fileUrl =
      typeof json === "object" &&
      json !== null &&
      "data" in json &&
      typeof (json as { data?: unknown }).data === "object" &&
      (json as { data?: { url?: unknown } }).data !== null &&
      typeof (json as { data: { url?: unknown } }).data.url === "string"
        ? (json as { data: { url: string } }).data.url
        : typeof json === "object" && json !== null && "url" in json && typeof (json as { url?: unknown }).url === "string"
          ? (json as { url: string }).url
          : "";
    if (!fileUrl) throw new Error("Upload không trả về url");
    return fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
  };

  const renderForm = () => {
    if (selectedAction === "create") {
      const uploaderId = session?.user?.id ?? "";
      return (
        <AdminForm<CreateDocumentInput>
          title="Tạo tài liệu"
          submitLabel="Tạo"
          initialData={{ title: "", category: "", file_url: "", uploaded_by_id: uploaderId }}
          fields={createFields}
          onClose={() => setSelectedAction("view")}
          onSubmit={async (payload) => {
            try {
              await apiClient("/documents", { method: "POST", body: payload });
              toast.success("Tạo tài liệu thành công", { toastId: "admin-create-doc" });
              logAdminAction({
                action: "create",
                resource: "documents",
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
                meta: { title: payload.title, category: payload.category },
              });
              await fetchDocuments();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Tạo thất bại: ${msg}`, { toastId: "admin-create-doc-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "update" && selected) {
      const initial: UpdateDocumentInput = {
        title: selected.title,
        category: selected.category,
        file_url: selected.file_url,
      };
      return (
        <AdminForm<UpdateDocumentInput>
          title={`Cập nhật tài liệu #${selected.document_id}`}
          submitLabel="Lưu"
          initialData={initial}
          fields={updateFields}
          onClose={() => setSelectedAction("view")}
          onSubmit={async (payload) => {
            try {
              await apiClient(`/documents/${selected.document_id}`, { method: "PATCH", body: payload });
              toast.success("Cập nhật thành công", { toastId: "admin-update-doc" });
              logAdminAction({
                action: "update",
                resource: "documents",
                resourceId: selected.document_id,
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
              });
              await fetchDocuments();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Cập nhật thất bại: ${msg}`, { toastId: "admin-update-doc-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "delete" && selected) {
      return (
        <ConfirmationDialog
          isOpen={true}
          title="Xác nhận xóa tài liệu"
          message={`Bạn có chắc muốn xóa tài liệu ${selected.document_id} không?`}
          onClose={() => setSelectedAction("view")}
          onConfirm={async () => {
            try {
              await apiClient(`/documents/${selected.document_id}`, { method: "DELETE" });
              toast.success("Xóa tài liệu thành công", { toastId: "admin-delete-doc" });
              logAdminAction({
                action: "delete",
                resource: "documents",
                resourceId: selected.document_id,
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
              });
              await fetchDocuments();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Xóa thất bại: ${msg}`, { toastId: "admin-delete-doc-error" });
            }
          }}
        />
      );
    }

    return null;
  };

  // view branch: show document details when action is 'view'
  if (selectedAction === "view" && selected) {
    const fields: ViewField[] = [
      { label: "ID", key: "document_id" },
      { label: "Tiêu đề", key: "title" },
      { label: "Category", key: "category" },
      { label: "URL", key: "file_url" },
      { label: "Tạo lúc", key: "created_at" },
    ];
    return <ViewModal isOpen={true} item={selected} title={`Chi tiết tài liệu`} fields={fields} onClose={() => setSelectedAction("view")} />;
  }

  if (loading) return <Loader className="w-8 h-8 animate-spin mx-auto mt-10" />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      {renderForm()}
      <h1 className="text-2xl font-bold mb-4">Quản lý tài liệu</h1>

      <div className="mb-4 flex items-center gap-3">
        <input
          type="file"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const url = await uploadFile(file);
              toast.success(`Upload OK: ${url}`, { toastId: "admin-upload-ok" });
              logAdminAction({
                action: "upload",
                resource: "uploads",
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
                meta: { url, filename: file.name, size: file.size },
              });
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Upload thất bại: ${msg}`, { toastId: "admin-upload-error" });
            } finally {
              e.target.value = "";
            }
          }}
          className="block"
        />
        <button
          className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
          onClick={() => fetchDocuments()}
        >
          Tải lại
        </button>
      </div>

      <AdminTableLayout
        searchProps={{
          placeholder: "Tìm theo title/category/url/uploader...",
          onSearch: (t) => {
            setSearchTerm(t);
            setPage(1);
          },
        }}
        tableProps={{
          headers: [
            { label: "ID", key: "document_id", type: "text" as const },
            { label: "Tiêu đề", key: "title", type: "text" as const },
            { label: "Category", key: "category", type: "text" as const },
            { label: "URL", key: "file_url", type: "text" as const },
            { label: "Tạo lúc", key: "created_at", type: "date" as const },
          ],
          items: paged,
          action: { type: selectedAction, onClick: (item) => setSelectedId(item as string) },
          enableSelection: true,
          onSelectionChange: setSelectedIds,
          rowOperations: buildCrudRowOperations<{ document_id: string }, string>({
            idKey: "document_id",
            setSelectedId: (id) => setSelectedId(id),
            setSelectedAction: (action) => setSelectedAction(action),
            allow: { view: access.canView, update: access.canEdit, delete: access.canDelete },
          }),
        }}
        exportCsvProps={{
          enabled: true,
          filename: `documents_${new Date().toISOString().slice(0, 10)}.csv`,
          onExport: () =>
            logAdminAction({
              action: "export_csv",
              resource: "documents",
              actorId: session?.user?.id,
              actorRole: session?.user?.role,
              meta: { count: paged.length },
            }),
        }}
        paginationProps={{
          state: { page, limit, total },
          onPageChange: setPage,
          onLimitChange: (l) => {
            setLimit(l);
            setPage(1);
          },
        }}
      />
      {selectedIds.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="text-sm text-gray-600">
            Đã chọn: <b>{selectedIds.length}</b> hàng
          </div>
          <button
            className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-50"
            disabled={bulkDeleting}
            onClick={async () => {
              if (!confirm(`Xóa hàng loạt ${selectedIds.length} tài liệu?`)) return;
              const ids = selectedIds.map((x) => String(x)).filter(Boolean);
              setBulkDeleting(true);
              let failed = 0;
              for (const id of ids) {
                try {
                  await apiClient(`/documents/${id}`, { method: "DELETE" });
                } catch {
                  failed += 1;
                }
              }
              setBulkDeleting(false);
              toast.success(`Bulk delete xong. Lỗi: ${failed}`, { toastId: "bulk-doc-delete" });
              logAdminAction({
                action: "bulk_delete",
                resource: "documents",
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
                meta: { count: ids.length, failed },
              });
              await fetchDocuments();
            }}
          >
            Bulk delete
          </button>
        </div>
      ) : null}
    </div>
  );
}



