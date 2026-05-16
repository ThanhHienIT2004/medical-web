"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

import AdminTableLayout from "@/app/(admin)/_components/table/AdminTableLayout";
import type { ActionAdminTable } from "@/app/(admin)/_components/table/AdminTable";
import AdminForm, { type AdminFormProps } from "@/app/(admin)/_components/forms/AdminForm";
import ViewModal, { ViewField } from "@/app/(admin)/_components/view/ViewModal";
import ConfirmationDialog from "@/app/(admin)/_components/dialog/ConfirmationDialog";
import { apiClient } from "@/libs/api/apiClient";
import { useSession } from "next-auth/react";
import { logAdminAction } from "@/app/(admin)/_libs/auditLog";
import { buildCrudRowOperations } from "@/app/(admin)/_libs/tableCrud";
import { getCrudAccess } from "@/app/(admin)/_libs/permissions";

import type { CreateBlogPostInput, PaginatedBlogPosts, UpdateBlogPostInput } from "@/types/blogPosts";

export default function BlogPostManagePage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<ActionAdminTable["type"]>("view");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [data, setData] = useState<PaginatedBlogPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const access = getCrudAccess(session, "blog-posts");

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<PaginatedBlogPosts>(`/blog-posts?page=${page}&pageSize=${pageSize}`);
      setData(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Không thể tải bài viết"));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const posts = useMemo(() => data?.items ?? [], [data]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter((p) => {
      const parts = [
        p.id,
        p.title,
        p.category,
        p.author?.user?.full_name ?? "",
        p.author_id,
      ]
        .join(" ")
        .toLowerCase();
      return parts.includes(term);
    });
  }, [posts, searchTerm]);

  const selected = useMemo(
    () => (selectedId ? posts.find((p) => p.id === selectedId) ?? null : null),
    [posts, selectedId]
  );

  const createFields: AdminFormProps<CreateBlogPostInput>["fields"] = [
    { label: "Tiêu đề", key: "title", type: "text", required: true },
    { label: "Nội dung", key: "content", type: "text", required: true },
    { label: "Danh mục", key: "category", type: "text", required: true },
    { label: "Author ID", key: "author_id", type: "text", required: true },
  ];

  const updateFields: AdminFormProps<UpdateBlogPostInput>["fields"] = [
    { label: "Tiêu đề", key: "title", type: "text" },
    { label: "Nội dung", key: "content", type: "text" },
    { label: "Danh mục", key: "category", type: "text" },
  ];

  const renderForm = () => {
    if (selectedAction === "create") {
      return (
        <AdminForm<CreateBlogPostInput>
          title="Tạo bài viết"
          submitLabel="Tạo"
          fields={createFields}
          onClose={() => setSelectedAction("view")}
          onSubmit={async (payload) => {
            try {
              await apiClient("/blog-posts", { method: "POST", body: payload });
              toast.success("Tạo bài viết thành công", { toastId: "admin-create-post" });
              logAdminAction({
                action: "create",
                resource: "blog-posts",
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
                meta: { title: payload.title, category: payload.category },
              });
              await fetchPosts();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Tạo thất bại: ${msg}`, { toastId: "admin-create-post-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "update" && selected) {
      const initial: UpdateBlogPostInput = {
        title: selected.title,
        content: selected.content,
        category: selected.category,
      };

      return (
        <AdminForm<UpdateBlogPostInput>
          title={`Cập nhật bài viết #${selected.id}`}
          submitLabel="Lưu"
          initialData={initial}
          fields={updateFields}
          onClose={() => setSelectedAction("view")}
          onSubmit={async (payload) => {
            try {
              await apiClient(`/blog-posts/${selected.id}`, { method: "PATCH", body: payload });
              toast.success("Cập nhật thành công", { toastId: "admin-update-post" });
              logAdminAction({
                action: "update",
                resource: "blog-posts",
                resourceId: selected.id,
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
              });
              await fetchPosts();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Cập nhật thất bại: ${msg}`, { toastId: "admin-update-post-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "delete" && selected) {
      return (
        <ConfirmationDialog
          isOpen={true}
          title="Xác nhận xóa bài viết"
          message={`Bạn có chắc muốn xóa bài viết ${selected.id} không?`}
          onClose={() => setSelectedAction("view")}
          onConfirm={async () => {
            try {
              await apiClient(`/blog-posts/${selected.id}`, { method: "DELETE" });
              toast.success("Xóa bài viết thành công", { toastId: "admin-delete-post" });
              logAdminAction({
                action: "delete",
                resource: "blog-posts",
                resourceId: selected.id,
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
              });
              await fetchPosts();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Xóa thất bại: ${msg}`, { toastId: "admin-delete-post-error" });
            }
          }}
        />
      );
    }
    if (selectedAction === "view" && selected) {
      const fields: ViewField[] = [
        { label: "ID", key: "id" },
        { label: "Tiêu đề", key: "title" },
        { label: "Danh mục", key: "category" },
        { label: "Tạo lúc", key: "created_at" },
      ];
      return <ViewModal isOpen={true} item={selected} title={`Chi tiết bài viết ${selected.id}`} fields={fields} onClose={() => setSelectedAction("view")} />;
    }

    return null;
  };

  if (loading) return <Loader className="w-8 h-8 animate-spin mx-auto mt-10" />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      {renderForm()}
      <h1 className="text-2xl font-bold mb-4">Quản lý bài viết</h1>
      <AdminTableLayout
        searchProps={{
          placeholder: "Tìm theo tiêu đề/danh mục/author...",
          onSearch: (t) => setSearchTerm(t),
        }}
        tableProps={{
          headers: [
            { label: "ID", key: "id", type: "text" as const },
            { label: "Tiêu đề", key: "title", type: "text" as const },
            { label: "Danh mục", key: "category", type: "text" as const },
            { label: "Tạo lúc", key: "created_at", type: "date" as const },
          ],
          items: filtered,
          action: { type: selectedAction, onClick: (item) => setSelectedId(item as string) },
          rowOperations: buildCrudRowOperations<{ id: string }, string>({
            idKey: "id",
            setSelectedId: (id) => setSelectedId(id),
            setSelectedAction: (action) => setSelectedAction(action),
            allow: { view: access.canView, update: access.canEdit, delete: access.canDelete },
          }),
        }}
        exportCsvProps={{
          enabled: true,
          filename: `blog_posts_${new Date().toISOString().slice(0, 10)}.csv`,
          onExport: () =>
            logAdminAction({
              action: "export_csv",
              resource: "blog-posts",
              actorId: session?.user?.id,
              actorRole: session?.user?.role,
              meta: { count: filtered.length },
            }),
        }}
        paginationProps={{
          state: { page: data?.page ?? page, limit: data?.pageSize ?? pageSize, total: data?.total ?? filtered.length },
          onPageChange: setPage,
          onLimitChange: (l) => {
            setPageSize(l);
            setPage(1);
          },
        }}
      />
    </div>
  );
}



