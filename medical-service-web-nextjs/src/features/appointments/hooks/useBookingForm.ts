// hooks/useBookingForm.ts
import React, { useState, useEffect } from 'react';
import type { Patient } from '@/types/patient';

type BookingUser = Patient['user'];

export const useBookingForm = (user?: BookingUser | null, patient?: Patient | null) => {
    const [form, setForm] = useState({
        fullName: '',
        gender: '',
        dob: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        symptoms: '',
    });

    useEffect(() => {
        if (user) {
            setForm({
                fullName: user.full_name || '',
                gender: patient.gender || 'OTHER',
                dob: user.date_of_birth?.slice(0, 10) || '',
                phone: user.phone || '',
                province: '',
                district: '',
                ward: '',
                symptoms: '',
            });
        }
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const resetForm = () => {
        setForm({
            fullName: '',
            gender: '',
            dob: '',
            phone: '',
            province: '',
            district: '',
            ward: '',
            symptoms: '',
        });
    };

    return { form, handleChange, resetForm };
};
