"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  FileText,
  Loader2,
  RefreshCw,
  Rss,
} from "lucide-react";

import PostCard from "@/components/cards/PostCard";
import { useGetAllPost } from "@/features/posts/hooks/useGetPost";

export default function Home() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const { posts, total, loading: getLoading, error: getError, refetch: refetchPosts } = useGetAllPost({
    page,
    pageSize,
  });

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (getLoading && page === 1) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-500" />
          <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
            <Rss className="h-5 w-5" />
            <p>Đang tải bài viết...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (getError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 p-6 text-center shadow-lg"
        >
          <div className="mb-3 flex items-center justify-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p className="text-lg font-semibold">Lỗi: {getError.message}</p>
          </div>
          <button
            onClick={() => refetchPosts()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </button>
        </motion.div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-gray-100 p-6 text-center shadow-lg"
        >
          <div className="mb-3 flex items-center justify-center gap-2 text-gray-600">
            <FileText className="h-5 w-5" />
            <p className="text-lg font-semibold">Chưa có bài viết nào</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            <RefreshCw className="h-4 w-4" />
            Tải lại trang
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-center gap-3 text-center">
          <Rss className="h-7 w-7 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Bài viết nổi bật</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Trước
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`rounded-lg px-4 py-2 transition-colors ${
                    p === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
