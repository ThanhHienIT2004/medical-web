// hooks/useProfileData.ts
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/libs/api/apiClient";

export function useProfileData() {
    const { data: session } = useSession();
    const patientId = session?.user?.id;

    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [form, setForm] = useState({
        full_name: "",
        date_of_birth: "",
        address: "",
        gender: "",
        phone: "",
    });

    const fetchPatient = async () => {
        if (!patientId) return;
        try {
            setLoading(true);
            const result = await apiClient(`/patients/${patientId}`);
            setPatient(result);
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatient();
    }, [patientId]);

    const user = patient?.user;

    useEffect(() => {
        if (user && patient) {
            setForm({
                full_name: user.full_name || "",
                date_of_birth: user.date_of_birth?.slice(0, 10) || "",
                address: user.address || "",
                gender: patient.gender || "",
                phone: user.phone || "",
            });
        }
    }, [user, patient]);

    const handleInputChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setUpdating(true);
            await apiClient(`/patients/${patientId}`, {
                method: 'PATCH',
                body: {
                    gender: form.gender,
                    user: {
                        full_name: form.full_name,
                        date_of_birth: form.date_of_birth,
                        address: form.address,
                        phone: form.phone,
                    },
                },
            });
            alert("Cập nhật thành công!");
            setEditMode(false);
            await fetchPatient();
        } catch (err: any) {
            alert(`Cập nhật thất bại: ${err.message}`);
        } finally {
            setUpdating(false);
        }
    };

    return {
        form,
        editMode,
        loading,
        error,
        updating,
        user,
        patient,
        setEditMode,
        handleInputChange,
        handleSubmit,
        setForm,
    };
}
