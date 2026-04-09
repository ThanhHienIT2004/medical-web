import {ComponentType, ReactNode, useEffect, useState} from "react";
import {formatNumberWithCommas} from "@/libs/function/formatNumberWithCommas";
import Image from "next/image";
import ActionButtons from "@/app/(admin)/_components/table/ActionButtons";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	type RowSelectionState,
	useReactTable
} from "@tanstack/react-table";
import {Eye} from "lucide-react";

export interface HeaderAdminTable {
	label: string;
	key: string;
	type?: "text" | "number" | "date";
	align?: "left" | "center" | "right";
	renderCell?: (value: unknown, row: unknown) => ReactNode;
}

export interface ActionAdminTable {
	type:  "view" | "create" | "update" | "delete"; // action for a type of table
	onClick?: (item: unknown) => void; // callback for action when click button
}

export interface RowOperation<T> {
	type: "view" | "update" | "delete" | "custom";
	icon?: ComponentType<{ className?: string }>;
	label?: string;
	onClick: (row: T) => void | Promise<void>;
	enabled?: boolean;
}

export interface AdminTableProps<T> {
	headers: HeaderAdminTable[]; // headers for table
	items: T[]; // items for table
	action?: ActionAdminTable; // action for table
	enableSelection?: boolean;
	onSelectionChange?: (selectedIds: unknown[]) => void;
	rowOperations?: RowOperation<T>[];
	primaryAction?: {
		label: string;
		onClick: (row: T) => void;
	};
}

const AdminTable = <T,>(
	{ headers, items, action, enableSelection, onSelectionChange, rowOperations, primaryAction }: AdminTableProps<T>
) => {
	const [isUpdate, setIsUpdate] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [tableData, setTableData] = useState<T[]>(items);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	useEffect(() => {
		setIsUpdate(action?.type === "update");
		setIsDelete(action?.type === "delete");
		setTableData(items);
	}, [action, items]);
	
	const columns: ColumnDef<T>[] = [
		...(enableSelection ? [{
			id: "__select",
			header: ({ table }) => (
				<input
					type="checkbox"
					checked={table.getIsAllRowsSelected()}
					onChange={table.getToggleAllRowsSelectedHandler()}
				/>
			),
			cell: ({ row }) => (
				<input
					type="checkbox"
					checked={row.getIsSelected()}
					disabled={!row.getCanSelect()}
					onChange={row.getToggleSelectedHandler()}
				/>
			),
			enableSorting: false,
		}] as ColumnDef<T>[] : []),
		...headers.map((header) => ({
			header: header.label,
			accessorKey: header.key,
			enableSorting: true,
			cell: (info) => {
				const value = info.getValue();
				if (header.renderCell) {
					return header.renderCell(value, info.row.original);
				}
				return (
					<span className={"truncate block"}>
						{renderCellValue(value, header.type, header.key)}
					</span>
				);
			},
			meta: {
				align: header.align ?? "left",
			},
		})),
		...(rowOperations && rowOperations.length > 0
			? [{
					header: "Operation",
					id: "__operation",
					enableSorting: false,
					cell: (info) => {
						const viewOp = rowOperations.find((operation) => operation.type === "view");
						const updateOp = rowOperations.find((operation) => operation.type === "update");
						const deleteOp = rowOperations.find((operation) => operation.type === "delete");
						const customOps = rowOperations.filter((operation) => operation.type === "custom");

						return (
							<div className="flex items-center gap-2">
								<ActionButtons
									canView={Boolean(viewOp && viewOp.enabled !== false)}
									canEdit={Boolean(updateOp && updateOp.enabled !== false)}
									canDelete={Boolean(deleteOp && deleteOp.enabled !== false)}
									onView={viewOp ? () => viewOp.onClick(info.row.original) : undefined}
									onEdit={updateOp ? () => updateOp.onClick(info.row.original) : undefined}
									onDelete={deleteOp ? () => deleteOp.onClick(info.row.original) : undefined}
									confirmDelete={true}
								/>
								{customOps.map((operation, idx) => {
									if (operation.enabled === false) return null;
									const Icon = operation.icon ?? Eye;
									return (
										<button
											key={`${operation.type}-${idx}`}
											type="button"
											onClick={() => void operation.onClick(info.row.original)}
											title={operation.label ?? operation.type}
											className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-violet-200 text-violet-600 hover:bg-violet-50"
										>
											<Icon className="h-3.5 w-3.5" />
										</button>
									);
								})}
							</div>
						);
					},
				}] as ColumnDef<T>[]
			: []),
		...(primaryAction
			? [{
					header: "Action",
					id: "__primaryAction",
					enableSorting: false,
					cell: (info) => (
						<button
							type="button"
							onClick={() => primaryAction.onClick(info.row.original)}
							className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500"
						>
							{primaryAction.label}
						</button>
					),
				}] as ColumnDef<T>[]
			: []),
		...(action && (isUpdate || isDelete)
			? [{
					header: "Hành động",
					id: "action",
					cell: (info) => {
						const item = info.row.original;
						return (
							<button
								onClick={() => action.onClick && action.onClick(item[headers[0].key as keyof T])}
								className={"container p-2 rounded-xl shadow-md outline outline-violet-500 dark:outline dark:outline-white/40 bg-zinc-50 hover:bg-violet-300  hover:text-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-gray-100"}
							>
								{ isUpdate ? "Cập nhật" : "Xóa" }
							</button>
						);
					}
				}] : []),
	];
	
	const renderBadge = (text: string, tone: "gray" | "green" | "red" | "amber" | "blue") => {
		const tones: Record<string, string> = {
			gray: "bg-gray-100 text-gray-800 ring-gray-200",
			green: "bg-emerald-100 text-emerald-800 ring-emerald-200",
			red: "bg-rose-100 text-rose-800 ring-rose-200",
			amber: "bg-amber-100 text-amber-800 ring-amber-200",
			blue: "bg-sky-100 text-sky-800 ring-sky-200",
		};
		return (
			<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>
				{text}
			</span>
		);
	};

	const renderCellValue = (value: unknown, type?: "text" | "number" | "date", key?: string) => {
		if (value == null) return "N/A";
		if ((key === "photo" || key === "avatar" || key === "image") && typeof value === "string") {
			return (
				<Image
					src={value}
					alt="avatar"
					width={32}
					height={32}
					className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200"
				/>
			);
		}
		// status badges
		if (key === "status" && typeof value === "string") {
			if (value === "PENDING") return renderBadge("Pending", "amber");
			if (value === "COMPLETED" || value.toUpperCase() === "ACTIVE") return renderBadge("Active", "green");
			if (value === "CANCELLED" || value.toUpperCase() === "INACTIVE") return renderBadge("Inactive", "red");
			return renderBadge(value, "gray");
		}
		// booleans
		if (typeof value === "boolean") {
			return value ? renderBadge("YES", "green") : renderBadge("NO", "gray");
		}
		// common numeric-as-boolean fields
		if ((key === "is_default" || key === "is_HIV" || key === "is_done") && typeof value === "number") {
			return value ? renderBadge("YES", "green") : renderBadge("NO", "gray");
		}
		if (type === "number" && typeof value === "number") {
			return formatNumberWithCommas(String(value));
		}
		if (type === "date") {
			return new Date(value as string).toLocaleString();
		}
		return String(value);
	}
	
	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		enableRowSelection: enableSelection,
		state: { sorting, rowSelection },
	})

	useEffect(() => {
		if (!enableSelection || !onSelectionChange) return;
		const idKey = headers[0]?.key;
		if (!idKey) return;
		const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
		const selectedIds = selectedRows.map((row) => (row as Record<string, unknown>)[idKey]);
		onSelectionChange(selectedIds);
	}, [enableSelection, onSelectionChange, headers, rowSelection, table]);

	return (
		<div className={"container mx-auto overflow-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"}>
			<table className={
				"table-auto border-collapse min-w-full " +
				"text-xs md:text-sm font-medium text-zinc-800"
			}>
				<thead className={"bg-gray-50 text-gray-500"}>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="w-auto p-3 text-left font-semibold truncate border-b border-gray-100 cursor-pointer select-none"
									onClick={header.column.getToggleSortingHandler()}
								>
									{flexRender(header.column.columnDef.header, header.getContext())}
									{{
										asc: " 🔼",
										desc: " 🔽",
									}[header.column.getIsSorted() as string] ?? null}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}
						    className={"bg-white hover:bg-gray-50" }
						>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}
								    className="py-2.5 px-3 border-b border-gray-100 text-xs md:text-sm text-gray-700"
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default AdminTable;