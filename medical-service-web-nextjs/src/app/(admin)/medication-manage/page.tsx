"use client"

import {Loader} from "lucide-react";
import {useGetMedications} from "@/features/medications/hooks/useGetMedications";
import {useSearchMedications} from "@/features/medications/hooks/useSearchMedications";
import {useState} from "react";
import {
  HEADER_TABLE_MEDICATION,
  INIT_CREATE_MEDICATION_FORM,
  INIT_UPDATE_MEDICATION_FORM
} from "@/app/(admin)/medication-manage/values/constants";
import AdminTableLayout from "@/app/(admin)/_components/table/AdminTableLayout";
import ViewModal, { ViewField } from "@/app/(admin)/_components/view/ViewModal";
import {ActionAdminTable} from "@/app/(admin)/_components/table/AdminTable";
import {CreateMedicationInput, UpdateMedicationInput} from "@/types/medications";
import AdminForm from "@/app/(admin)/_components/forms/AdminForm";
import {useCreateMedication} from "@/features/medications/hooks/useCreateMedication";
import {useUpdateMedication} from "@/features/medications/hooks/useUpdateMedication";
import {useDeleteMedication} from "@/features/medications/hooks/useDeleteMedication";
import ConfirmationDialog from "@/app/(admin)/_components/dialog/ConfirmationDialog";
import {toast} from "react-toastify";
import {PaginationInput} from "@/types/pagination";
import { buildCrudRowOperations } from "@/app/(admin)/_libs/tableCrud";
import { useSession } from "next-auth/react";
import { getCrudAccess } from "@/app/(admin)/_libs/permissions";

export default function MedicationPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<ActionAdminTable["type"]>('view');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paginationInput] = useState<PaginationInput>({
    page: 1,
    limit: 20,
  });
  const { medications: medications, totalPage, loading: initLoading, error: errorMedications, refetch: refetchMedications } = useGetMedications(
    paginationInput.page, paginationInput.limit
  );
  const { medications: searchMedications, loading: searchLoading, } = useSearchMedications(searchTerm);
  const { create: createMedication, loading: createLoading, error: errorCreate } = useCreateMedication();
  const { update: updateMedication, loading: updateLoading, error: errorUpdate } = useUpdateMedication();
  const { delete: deleteMedication, loading: deleteLoading, error: errorDelete } = useDeleteMedication();

  const displayedMedications = (searchTerm && searchMedications.length > 0) ? searchMedications : medications;
  const loading = initLoading || searchLoading || createLoading || updateLoading || deleteLoading;
  const error = errorMedications || errorCreate || errorUpdate || errorDelete;
  const access = getCrudAccess(session, "medications");

  function handleAction(action: ActionAdminTable['type']) {
    setSelectedAction(action);
    setSelectedId(null); // clear selected item
  }
  function handleSelectedId(id: number | null) {
    if (id !== null && id >= 0) {
      setSelectedId(id);
    }
  }

  async function handleCreateSubmit(data: CreateMedicationInput) {
    try {
      if (await createMedication(data)) {
        await refetchMedications()
        toast.success("Tạo thành công", {toastId: "create-medication-success"})
        handleAction("view") // clear form after creation
      }
    } catch (error) {
      console.error("Create medication error:", error);
    }
  }

  async function handleUpdateSubmit(data: UpdateMedicationInput) {
    if (selectedId === null) return;
    try {
      await updateMedication(selectedId, data)
      await refetchMedications()
      toast.success("Cập nhật thành công", {toastId: "create-medication-success"})
      handleAction("update") // clear form and selectedId after update
    } catch (error) {
      console.error("Create medication error:", error);
    }
  }

  async function handleDeleteSubmit() {
    if (selectedId === null) return;
    try {
      await deleteMedication(selectedId)
      await refetchMedications()
      toast.success("Xóa thành công", {toastId: `create-medication-success-${selectedId}`})
      handleAction("delete") // clear form and selectedId after update
    } catch (error) {
      console.error("Create medication error:", error);
    }
  }

  const renderForm = () => {
    switch (selectedAction) {
      case "view":
        if (selectedId === null) return null;
        const selectedMed = displayedMedications.find(m => m.id === selectedId);
        if (!selectedMed) return null;
        const viewFields: ViewField[] = HEADER_TABLE_MEDICATION.map(h => ({ label: h.label, key: h.key }));
        return <ViewModal isOpen={true} item={selectedMed} title={`Chi tiết thuốc #${selectedId}`} fields={viewFields} onClose={() => handleAction("view")} />;
      case "create":
        return <AdminForm<CreateMedicationInput>
          { ...INIT_CREATE_MEDICATION_FORM }
          onClose={() => handleAction("view")}
          onSubmit={handleCreateSubmit}
        />

      case "update":
        if (selectedId === null) return null;
        return <AdminForm<UpdateMedicationInput>
          { ...INIT_UPDATE_MEDICATION_FORM }
          initialData={displayedMedications.find(medication => medication.id === selectedId)}
          onClose={() => handleAction("update")}
          onSubmit={handleUpdateSubmit}
        />

      case "delete":
        if (selectedId === null) return null;
        return <ConfirmationDialog
          isOpen={selectedAction === "delete"}
          message={"Bạn có chắc chắn muốn xóa thuốc này không?"}
          onClose={() => handleAction("delete")}
          onConfirm={handleDeleteSubmit}
          title={"Xác nhận xóa thuốc"}
        />

      default:
        return null;
    }
  }

  if (loading) return <Loader/>;
  if (error)
    return (
      <div>
        {error.name}: {error.message}
      </div>
    )

  return (
    <>
      {renderForm()}

      <AdminTableLayout
        searchProps={{placeholder: "Tìm kiếm thuốc", onSearch: (term) => {setSearchTerm(term)}}}
        tableProps={{
          headers: HEADER_TABLE_MEDICATION,
          items: displayedMedications,
          action: { type: selectedAction, onClick: (item) => handleSelectedId(item as number) },
          rowOperations: buildCrudRowOperations<{ id: number }, number>({
            idKey: "id",
            setSelectedId: (id) => setSelectedId(id),
            setSelectedAction: (action) => setSelectedAction(action),
            allow: { view: access.canView, update: access.canEdit, delete: access.canDelete },
          }),
          }}
        exportCsvProps={{
          enabled: true,
          filename: `medications_${new Date().toISOString().slice(0, 10)}.csv`,
        }}
        paginationProps={{
          state: {
            page: 1,
            limit: 20,
            total: totalPage,
          }
        }}
      />
    </>
  );
}

