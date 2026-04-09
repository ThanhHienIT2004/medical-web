import TableSearch, {TableSearchProps} from "@/app/(admin)/_components/table/TableSearch";
import TableDropdownActions, {
	TableDropdownActionsProps
} from "@/app/(admin)/_components/table/TableDropdownActions";
import AdminTable, {AdminTableProps} from "@/app/(admin)/_components/table/AdminTable";
import React from "react";
import {TablePagination, TablePaginationProps} from "@/app/(admin)/_components/table/TablePagination";
import { downloadCsv } from "@/app/(admin)/_libs/table/csv";
import { Download } from "lucide-react";

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
			<div className="flex flex-col gap-4">
				<div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm">
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

				<AdminTable {...tableProps} />
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