"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ChevronRight, House } from "lucide-react";

interface BreadcrumbProps {
  pageTitle?: string;
  showHeading?: boolean;
}

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Quản trị",
  "user-manage": "Quản lý người dùng",
  "doctor-manage": "Danh sách bác sĩ",
  "patient-manage": "Danh sách bệnh nhân",
  "admin-appointment-manage": "Quản lý lịch hẹn",
  "blog-post-manage": "Quản lý bài viết",
  "document-manage": "Quản lý tài liệu",
  "examination-report-manage": "Báo cáo khám",
  "medication-manage": "Danh sách thuốc",
  "regimen-manage": "Phác đồ thuốc",
  "slot-manage": "Khung giờ",
  "treatment-plan-manage": "Phác đồ điều trị",
  "schedule-manage": "Lịch làm việc",
  profile: "Hồ sơ",
  create: "Tạo mới",
  edit: "Chỉnh sửa",
};

function formatSegment(segment: string) {
  const normalized = segment.toLowerCase();
  if (SEGMENT_LABELS[normalized]) return SEGMENT_LABELS[normalized];
  return segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  showHeading = true,
}) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items = segments.map((segment, index) => ({
    label: formatSegment(segment),
    href: `/${segments.slice(0, index + 1).join("/")}`,
  }));

  const currentTitle = pageTitle || items[items.length - 1]?.label || "Trang";
  const wrapperClass = showHeading
    ? "mb-6 flex flex-wrap items-center justify-between gap-3"
    : "mb-3 flex items-center";

  return (
    <div className={wrapperClass}>
      {showHeading ? (
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {currentTitle}
        </h2>
      ) : null}

      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              href="/admin-dashboard"
            >
              <House className="h-4 w-4" />
              <span>Trang chủ</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href} className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {isLast ? (
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {pageTitle || item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
