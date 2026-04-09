"use client";

import { useState } from "react";
import { Loader, View, Pencil, Trash2 } from "lucide-react";
import { INIT_BLOG_TABLE } from "@/app/(doctor)/blog/m_resource/constants";
import { useUpdatePost } from "@/features/posts/hooks/useUpdatePost";
import { useCreatePost } from "@/features/posts/hooks/useCreatePost";
import { useGetAllPost } from "@/features/posts/hooks/useGetPost";
import { useDeletePost } from "@/features/posts/hooks/useDeletePost";
import { Post } from "@/types/posts";
import { useSession } from "next-auth/react";
import ConfirmationDialog from "@/app/(admin)/_components/molecules/dialog/ConfirmationDialog";

export default function BlogPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedAction, setSelectedAction] = useState<"view" | "create" | "update" | "delete">("view");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const { data: session } = useSession();
    const authorId = session.user.id;
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "",
    });

    const {
        posts,
        total,
        loading: getLoading,
        error: getError,
        refetch: refetchPosts,
    } = useGetAllPost({ page, pageSize });

    const { create: createPostInput, loading: createLoading, error: createError } = useCreatePost();
    const { update: updatePostFn, loading: updateLoading, error: updateError } = useUpdatePost();
    const { delete: deletePost, loading: deleteLoading, error: deleteError } = useDeletePost();

    const loading = getLoading || createLoading || updateLoading || deleteLoading;
    const error = getError || createError || updateError || deleteError;


    const displayedPosts = posts;

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "--";
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }


    function handleAction(action: "view" | "create" | "update" | "delete", id?: number) {
        setSelectedAction(action);
        setSelectedId(id || null);
        if (action === "update" && id) {
            const selectedPost = displayedPosts.find(post => post.id === id);
            if (selectedPost) {
                setFormData({
                    title: selectedPost.title,
                    content: selectedPost.content,
                    category: selectedPost.category,
                });
            }
        }
    }

    function handleSelectedId(id: number | null) {
        if (id !== null) {
            setSelectedId(id);
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleCreateSubmit() {
        if (!formData.title || !formData.content || !formData.category) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        try {
            await createPostInput({
                title: formData.title,
                content: formData.content,
                category: formData.category,
                author_id: authorId,
            });
            await refetchPosts();
            setFormData({ title: "", content: "", category: "" });
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error("Create post error:", message, err);
        }
    }

    async function handleUpdateSubmit() {
        if (selectedId === null) return;
        try {
            await updatePostFn({
                id: Number(selectedId),
                data: {
                    title: formData.title,
                    content: formData.content,
                    category: formData.category,
                },
            });
            await refetchPosts();
            handleAction("view");
            setFormData({ title: "", content: "", category: "" });
        } catch (error: any) {
            console.error("Update post error:", error.message);
        }

    }

    async function handleDeleteSubmit() {
        if (selectedId === null) return;
        try {
            await deletePost(Number(selectedId));
            await refetchPosts();
            handleAction("view");
        } catch (error) {
            console.error("Delete post error:", error);
        }
    }
    const renderActions = (post: Post) => (
        <div className="flex space-x-2">
            <button
                className="p-1 text-blue-500 hover:text-blue-700"
                onClick={() => handleAction("view", post.id)}
                title="Xem"
            >
                <View className="w-5 h-5" />
            </button>
            <button
                className="p-1 text-yellow-500 hover:text-yellow-700"
                onClick={() => handleAction("update", post.id)}
                title="Sửa"
            >
                <Pencil className="w-5 h-5" />
            </button>
            <button
                className="p-1 text-red-500 hover:text-red-700"
                onClick={() => handleAction("delete", post.id)}
                title="Xóa"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );

    const renderForm = () => {
        switch (selectedAction) {
            case "delete":
                if (selectedId === null) return null;
                return (
                    <ConfirmationDialog
                        isOpen={selectedAction === "delete"}
                        message={"Bạn có chắc chắn muốn xóa bài viết này không?"}
                        onClose={() => handleAction("view")}
                        onConfirm={handleDeleteSubmit}
                        title={"Xác nhận xóa bài viết"}
                    />
                );
            case "update":
                if (selectedId === null) return null;
                return (
                    <ConfirmationDialog
                        isOpen={selectedAction === "update"}
                        message={
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-gray-700">Tiêu đề</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="p-2 border border-gray-300 rounded-lg w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Nội dung</label>
                                    <input
                                        type="text"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        className="p-2 border border-gray-300 rounded-lg w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Danh mục</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="p-2 border border-gray-300 rounded-lg w-full"
                                    >
                                        <option value="">-- Chọn loại --</option>
                                        <option value="Chính trị">Chính trị</option>
                                        <option value="Khoa học">Khoa học</option>
                                        <option value="Giáo dục">Giáo dục</option>
                                    </select>
                                </div>
                            </div>
                        }
                        onClose={() => handleAction("view")}
                        onConfirm={handleUpdateSubmit}
                        title={"Cập nhật bài viết"}
                        confirmText="Chắc chắn"
                        cancelText="Hủy"
                    />
                );
            default:
                return null;
        }
    };

    if (loading) return <Loader className="w-8 h-8 animate-spin mx-auto mt-10" />;
    if (error)
        return (
            <div className="text-red-500 text-center mt-10">
                {error.name}: {error.message}
            </div>
        );

    return (
        <div className="min-h-screen flex flex-col gap-6 p-6 bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 Tạo bài viết mới</h2>
                <div className="grid grid-cols-3 gap-3 bg-gray-100 p-3 rounded-lg font-medium text-gray-700">
                    <p>Tiêu đề</p>
                    <p>Mô tả</p>
                    <p>Thuộc loại</p>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3 items-center">
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Nhập tiêu đề"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Nhập mô tả"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">-- Chọn loại --</option>
                        <option value="Chính trị">Chính trị</option>
                        <option value="Khoa học">Khoa học</option>
                        <option value="Giáo dục">Giáo dục</option>
                    </select>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleCreateSubmit}
                        className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200"
                        disabled={createLoading}
                    >
                        {createLoading ? "Đang tạo..." : "Tạo bài viết"}
                    </button>
                </div>
            </div>

            <div className="container mx-auto p-6">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    {renderForm()}
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                {INIT_BLOG_TABLE.map((header, index) => (
                                    <th key={index} className="p-4 text-left font-medium">
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedPosts.map((item, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="border-t hover:bg-gray-50"
                                    onClick={() => typeof item.id === "string" && handleSelectedId(item.id)}
                                >
                                    {INIT_BLOG_TABLE.map((header, colIndex) => (
                                        <td key={colIndex} className="p-4 text-gray-600">
                                            {header.key === "action" ? (
                                                renderActions(item)
                                            ) : header.type === "date" && item[header.key] ? (
                                                <span>{formatDate(item[header.key])}</span>
                                            ) : (
                                                <span>{item[header.key] || "--"}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    ← Trang trước
                </button>
                <span>Trang {page}</span>
                <button
                    onClick={() => setPage(prev => (prev * pageSize < total ? prev + 1 : prev))}
                    disabled={page * pageSize >= total}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Trang sau →
                </button>
            </div>
        </div>
    );
}