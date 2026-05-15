"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/libs/api/apiClient";
import type { Patient } from "@/types/patient";
import AdminTableLayout from "../_components/organisms/table/AdminTableLayout";

type PatientRow = {
  patient_id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar?: string;
};

export default function PatientManagePage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<Patient[]>("/patients");
      setPatients(Array.isArray(result) ? result : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Khong the tai danh sach benh nhan");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const rows = useMemo<PatientRow[]>(
    () =>
      patients.map((patient) => ({
        patient_id: patient.patient_id,
        full_name: patient.user?.full_name ?? "",
        email: patient.user?.email ?? "",
        phone: patient.user?.phone ?? "",
        avatar: patient.user?.avatar ?? "",
      })),
    [patients]
  );

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      [row.patient_id, row.full_name, row.email, row.phone].join(" ").toLowerCase().includes(term)
    );
  }, [rows, searchTerm]);

  const total = filteredRows.length;
  const pagedRows = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredRows.slice(start, start + limit);
  }, [filteredRows, page, limit]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý bệnh nhân</h1>
      {loading ? <p className="mb-3 text-sm text-gray-500">Dang tai du lieu...</p> : null}
      {error ? <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
      <AdminTableLayout
        searchProps={{
          placeholder: "Tim theo ID, ten, email, so dien thoai",
          onSearch: (value) => {
            setSearchTerm(value);
            setPage(1);
          },
        }}
        tableProps={{
          headers: [
            { label: "Patient ID", key: "patient_id" },
            { label: "Photo", key: "avatar" },
            { label: "Họ tên", key: "full_name" },
            { label: "Email", key: "email" },
            { label: "SĐT", key: "phone" },
          ],
          items: pagedRows,
          action: { type: "view", onClick: () => {} },
        }}
        paginationProps={{
          state: { page, limit, total },
          onPageChange: setPage,
          onLimitChange: (nextLimit) => {
            setLimit(nextLimit);
            setPage(1);
          },
        }}
      />
    </div>
  );
}