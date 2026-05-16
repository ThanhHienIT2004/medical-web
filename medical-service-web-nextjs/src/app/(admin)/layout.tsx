import React from 'react';
import type {Metadata} from "next";
import {ToastContainer} from "react-toastify";
import ProtectedLayout from "@/app/(admin)/protectedLayout";
import AdminShell from './_components/layout/AdminShell';
import AppHeader from '@/components/layout/AppHeader';
import { AdminSearchProvider } from '@/components/context/AdminSearchContext';
import { SidebarProvider } from '@/components/context/SidebarContext';
import { ThemeProvider } from '@/components/context/ThemeContext';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';

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
      <ThemeProvider>
        <AdminSearchProvider>
          <SidebarProvider desktopMinWidth={1024}>
            <AdminShell header={<AppHeader />}>
              <PageBreadCrumb showHeading={false} />
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
            </AdminShell>
          </SidebarProvider>
        </AdminSearchProvider>
      </ThemeProvider>
      </ProtectedLayout>
  );
}
