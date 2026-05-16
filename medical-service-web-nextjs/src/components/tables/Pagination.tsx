type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const safeTotalPages = Math.max(1, totalPages);
  const startPage = Math.max(1, Math.min(currentPage - 1, safeTotalPages - 2));
  const pages = Array.from(
    { length: Math.min(3, safeTotalPages) },
    (_, index) => startPage + index
  );

  return (
    <nav className="flex flex-wrap items-center justify-end gap-3" aria-label="Phân trang">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Trang {currentPage} / {safeTotalPages}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          Trước
        </button>

        <div className="flex items-center gap-1">
          {startPage > 1 && <span className="px-2 text-gray-500">...</span>}
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                currentPage === page
                  ? "border border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {page}
            </button>
          ))}
          {startPage + pages.length - 1 < safeTotalPages && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === safeTotalPages}
          className="flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          Sau
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
