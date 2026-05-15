
import React from "react";
import { Download } from "lucide-react";
import AdminTable, { AdminTableProps } from "./AdminTable";
import TableDropdownActions, { TableDropdownActionsProps } from "./TableDropdownActions";
import { TablePagination, TablePaginationProps } from "./TablePagination";
import TableSearch, { TableSearchProps } from "./TableSearch";
import { downloadCsv } from "@/app/(admin)/_libs/csv";

interface AdminTableLayoutProps {
	searchProps: TableSearchProps;
	dropdownProps?: TableDropdownActionsProps;
	tableProps: AdminTableProps<unknown>;
	paginationProps?: TablePaginationProps;
	exportCsvProps?: {
		enabled?: boolean;
		filename?: string;
		onExport?: () => void;
	};
}
export default function AdminTableLayout(
	{ searchProps, dropdownProps, tableProps, paginationProps, exportCsvProps }: AdminTableLayoutProps
){
	return (
			<div className="flex flex-col gap-4 w-full">
				<div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm w-full">
					<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
					<TableSearch placeholder={searchProps.placeholder} onSearch={searchProps.onSearch} />
					<div className="flex items-center justify-end gap-2">
						{exportCsvProps?.enabled ? (
							<button
								type="button"
								className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100 hover:text-violet-800"
								onClick={() => {
									const filename = exportCsvProps.filename || "export.csv";
									downloadCsv(
										filename,
										(tableProps.items as unknown as Record<string, unknown>[]),
										tableProps.headers.map((h) => ({ key: h.key, label: h.label })),
									);
									exportCsvProps.onExport?.();
								}}
							>
								<Download size={16} />
								Export CSV
							</button>
						) : null}
						{dropdownProps ? (
							<TableDropdownActions onItemSelected={dropdownProps.onItemSelected} />
						) : null}
					</div>
				</div>
				</div>

				<div className="w-full overflow-x-auto">
					<AdminTable {...tableProps} />
				</div>
				{paginationProps ? (
					<TablePagination
						state={paginationProps.state}
						onPageChange={paginationProps.onPageChange}
						onLimitChange={paginationProps.onLimitChange}
					/>
				) : null}
			</div>
	);
}