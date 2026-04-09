import { Role } from '../../role/role.enum';
import { Permission } from '../enums/permission.enum';

/**
 * Bảng ánh xạ Role → Danh sách Permissions được phép.
 *
 * ADMIN    → toàn quyền (tất cả permissions)
 * DOCTOR   → đọc/ghi trong phạm vi chuyên môn
 * USER     → chỉ đọc thông tin cá nhân & tương tác appointment
 * GUEST    → chỉ đọc thông tin công khai
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  // ─── ADMIN: toàn quyền ──────────────────────────────────────
  [Role.ADMIN]: Object.values(Permission),

  // ─── DOCTOR: quyền chuyên môn ───────────────────────────────
  [Role.DOCTOR]: [
    // Xem thông tin bác sĩ
    Permission.DOCTOR_READ,

    // Xem thông tin bệnh nhân & user (chi tiết); danh sách user cần USER_LIST
    Permission.USER_READ,
    Permission.USER_LIST,
    Permission.PATIENT_READ,

    // Quản lý lịch hẹn
    Permission.APPOINTMENT_READ,
    Permission.APPOINTMENT_UPDATE,

    // Báo cáo khám bệnh - toàn quyền
    Permission.EXAMINATION_READ,
    Permission.EXAMINATION_CREATE,
    Permission.EXAMINATION_UPDATE,
    Permission.EXAMINATION_DELETE,

    // Tài liệu
    Permission.DOCUMENT_READ,
    Permission.DOCUMENT_CREATE,
    Permission.DOCUMENT_UPDATE,

    // Blog - toàn quyền bài của mình
    Permission.BLOG_READ,
    Permission.BLOG_CREATE,
    Permission.BLOG_UPDATE,
    Permission.BLOG_DELETE,

    // Thuốc & phác đồ - chỉ đọc
    Permission.MEDICATION_READ,
    Permission.REGIMEN_READ,

    // Kế hoạch điều trị
    Permission.TREATMENT_PLAN_READ,
    Permission.TREATMENT_PLAN_CREATE,
    Permission.TREATMENT_PLAN_UPDATE,

    // Dashboard cơ bản
    Permission.DASHBOARD_READ,
  ],

  // ─── USER (bệnh nhân): quyền cơ bản ────────────────────────
  [Role.USER]: [
    // Xem danh sách bác sĩ
    Permission.DOCTOR_READ,

    // Thông tin cá nhân
    Permission.USER_READ,
    Permission.USER_UPDATE,

    // Thông tin bệnh nhân của chính mình
    Permission.PATIENT_READ,
    Permission.PATIENT_UPDATE,

    // Đặt & xem lịch hẹn
    Permission.APPOINTMENT_READ,
    Permission.APPOINTMENT_CREATE,
    Permission.APPOINTMENT_UPDATE,

    // Tài liệu cá nhân
    Permission.DOCUMENT_READ,
    Permission.DOCUMENT_CREATE,

    // Đọc blog công khai
    Permission.BLOG_READ,

    // Đọc thông tin thuốc & phác đồ
    Permission.MEDICATION_READ,
    Permission.REGIMEN_READ,

    // Kế hoạch điều trị - chỉ đọc
    Permission.TREATMENT_PLAN_READ,

    // Xem báo cáo khám của mình
    Permission.EXAMINATION_READ,
  ],

  // ─── GUEST: chỉ đọc thông tin công khai ─────────────────────
  [Role.GUEST]: [
    Permission.BLOG_READ,
    Permission.DOCTOR_READ,
    Permission.MEDICATION_READ,
  ],
};
