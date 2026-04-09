import type {
  ActionAdminTable,
  RowOperation,
} from "@/app/(admin)/_components/table/AdminTable";

type CrudFlags = {
  view?: boolean;
  update?: boolean;
  delete?: boolean;
};

type BuildCrudRowOperationsParams<TRow extends Record<string, unknown>, TId> = {
  idKey: keyof TRow;
  setSelectedId: (id: TId) => void;
  setSelectedAction: (action: ActionAdminTable["type"]) => void;
  allow?: CrudFlags;
};

export function buildCrudRowOperations<
  TRow extends Record<string, unknown>,
  TId = unknown
>({
  idKey,
  setSelectedId,
  setSelectedAction,
  allow,
}: BuildCrudRowOperationsParams<TRow, TId>): RowOperation<TRow>[] {
  const resolveId = (row: TRow) => row[idKey] as TId;
  const operations: RowOperation<TRow>[] = [];

  if (allow?.view !== false) {
    operations.push({
      type: "view",
      label: "Xem",
      onClick: (row) => {
        setSelectedId(resolveId(row));
        setSelectedAction("view");
      },
    });
  }

  if (allow?.update !== false) {
    operations.push({
      type: "update",
      label: "Sua",
      onClick: (row) => {
        setSelectedId(resolveId(row));
        setSelectedAction("update");
      },
    });
  }

  if (allow?.delete !== false) {
    operations.push({
      type: "delete",
      label: "Xoa",
      onClick: (row) => {
        setSelectedId(resolveId(row));
        setSelectedAction("delete");
      },
    });
  }

  return operations;
}
