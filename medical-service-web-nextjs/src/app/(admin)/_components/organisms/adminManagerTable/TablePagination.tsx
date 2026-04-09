
export interface TablePaginationProps {
	state: { page: number; limit: number; total: number };
	onPageChange?: (page: number) => void;
	onLimitChange?: (limit: number) => void;
}

export function TablePagination(
	{ state, onPageChange, onLimitChange }: TablePaginationProps,
) {
	const totalPages = Math.max(1, Math.ceil(state.total / Math.max(1, state.limit)));
	const canPrev = state.page > 1;
	const canNext = state.page < totalPages;

	return (
		<div className={"container max-w-screen mx-auto flex justify-center p-2 space-x-4  rounded-b-xl shadow-lg " +
			"outline-1 outline-black/10 dark:outline-1 dark:outline-white " +
			"text-xs sm:text-sm md:text-base dark:text-white " +
			"bg-white dark:bg-gray-800 "}>
			<section className="container flex items-center">
				<span className="">
					{"Giới hạn"}
				</span>
				<input
					type="number"
					min={1}
					max={50}
					value={state.limit}
					onChange={(e) => onLimitChange?.(e.target.valueAsNumber || 1)}
					className="w-14 p-2 ml-2 text-center bg-gray-50 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:focus:ring-violet-400"
				/>
			</section>
			<div className="flex items-center gap-2">
				<span className="px-2 py-1 text-gray-700 dark:text-gray-200">
					Trang {state.page}/{totalPages} • Tổng: {state.total}
				</span>
			</div>
			
			<div className="flex justify-between items-center gap-2 ">
				<button
					disabled={!canPrev}
					onClick={() => onPageChange?.(Math.max(1, state.page - 1))}
					className="px-4 py-2 cursor-pointer bg-gray-50 shadow-sm rounded-md disabled:opacity-50 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
				>
					{ " < "}
				</button>
				<span className="px-4 py-2 border bg-gray-50 shadow-sm rounded-md text-sm md:text-base">
					{ state.page }
				</span>
				<button
					disabled={!canNext}
					onClick={() => onPageChange?.(Math.min(totalPages, state.page + 1))}
					className="px-4 py-2 cursor-pointer bg-gray-50 shadow-sm rounded-md disabled:opacity-50 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
				>
					{ " > "}
				</button>
			</div>
		</div>
	);
}