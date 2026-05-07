'use client';

import React from 'react';
import Link from 'next/link';
import { useGetDoctors } from '@/features/doctors/hooks/useGetDoctors';

interface DoctorPageProps {
    limit?: number;
}

function DoctorPage({ limit }: DoctorPageProps) {
    const { doctors, loading, error } = useGetDoctors();
    
    let displayedDoctors = doctors;
    if (limit && limit > 0) {
        displayedDoctors = doctors.slice(0, limit);
    }

    if (loading) {
        return (
            <div className="py-20 flex items-center justify-center bg-gray-50 w-full">
                <div className="flex items-center gap-3 text-gray-600 animate-pulse">
                    <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-lg font-medium">Đang tải dữ liệu...</span>
                </div>
            </div>
        );
    }
    if (error) return <p>Lỗi: {error.message}</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {displayedDoctors.map((doctor, index) => {
                const avatarSrc =
                    doctor.avatar?.startsWith('http') ? doctor.avatar : '/doctor-placeholder.jpg';

                return (
                    <div
                        key={doctor.id || index}
                        className="bg-white rounded-xl shadow-lg hover:scale-105 transition overflow-hidden group"
                    >

                        {/* Ảnh và nút chồng lên nhau */}
                        <div className="relative w-full h-72">
                            <img
                                src={avatarSrc}
                                alt={doctor.full_name || 'Bác sĩ'}
                                className="w-full h-full object-cover"
                            />

                            {/* Nút hiện gần dưới ảnh khi hover */}
                            <div
                                className="absolute inset-0 flex items-end justify-center  bg-opacity-30
                                     opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0
                                     transition-all duration-300"
                            >
                                <Link
                                    href={`/booking/${doctor.user_id}`}
                                    className="mb-4 bg-gradient-to-r from-blue-400 to-sky-300 text-white font-semibold
                                   text-sm px-5 py-2 rounded-full shadow-md hover:from-blue-600 hover:to-sky-500
                                   hover:scale-105 transition-transform duration-300"
                                >
                                    🩺 Hẹn khám với bác sĩ này
                                </Link>
                            </div>

                        </div>


                        {/* Nội dung dưới ảnh */}
                        <div className="p-4 text-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {doctor.full_name || 'Không rõ'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {doctor.hospital || 'Không rõ'}
                            </p>
                            <p className="text-sm text-gray-500">
                                {doctor.specialty || 'Không rõ'}
                            </p>
                            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                                Phí khám: {doctor.default_fee ? `${doctor.default_fee.toLocaleString()} VNĐ` : 'Chưa rõ'}
                            </div>
                        </div>
                    </div>

                );
            })}
        </div>
    );
}

export default DoctorPage;
