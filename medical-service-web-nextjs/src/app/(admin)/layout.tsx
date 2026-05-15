import React from 'react';
import type {Metadata} from "next";
import {ToastContainer} from "react-toastify";
import ProtectedLayout from "@/app/(admin)/protectedLayout";
import AdminClientWrapper from './_components/organisms/adminClientWrapper/AdminClientWrapper';

export const metadata: Metadata = {
  title: "Quản lí phòng khám",
  description: "Nền tảng quản lý sức khỏe, hỗ trợ đặt lịch khám và theo dõi bệnh án dễ dàng.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <ProtectedLayout>
      <AdminClientWrapper>
        {children}
        <ToastContainer
          position={"top-right"}
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme={"light"}
        />
      </AdminClientWrapper>
      </ProtectedLayout>
  );
}