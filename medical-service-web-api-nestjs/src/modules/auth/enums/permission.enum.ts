/**
 * Định nghĩa các quyền granular theo từng resource.
 * Format: RESOURCE_ACTION
 */
export enum Permission {
  // ─── USER ────────────────────────────────────────────────
  USER_READ = 'user:read',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // ─── DOCTOR ──────────────────────────────────────────────
  DOCTOR_READ = 'doctor:read',
  DOCTOR_CREATE = 'doctor:create',
  DOCTOR_UPDATE = 'doctor:update',
  DOCTOR_DELETE = 'doctor:delete',

  // ─── PATIENT ─────────────────────────────────────────────
  PATIENT_READ = 'patient:read',
  PATIENT_CREATE = 'patient:create',
  PATIENT_UPDATE = 'patient:update',
  PATIENT_DELETE = 'patient:delete',

  // ─── APPOINTMENT ─────────────────────────────────────────
  APPOINTMENT_READ = 'appointment:read',
  APPOINTMENT_CREATE = 'appointment:create',
  APPOINTMENT_UPDATE = 'appointment:update',
  APPOINTMENT_DELETE = 'appointment:delete',

  // ─── EXAMINATION REPORT ───────────────────────────────────
  EXAMINATION_READ = 'examination:read',
  EXAMINATION_CREATE = 'examination:create',
  EXAMINATION_UPDATE = 'examination:update',
  EXAMINATION_DELETE = 'examination:delete',

  // ─── BLOG POST ────────────────────────────────────────────
  BLOG_READ = 'blog:read',
  BLOG_CREATE = 'blog:create',
  BLOG_UPDATE = 'blog:update',
  BLOG_DELETE = 'blog:delete',

  // ─── MEDICATION ──────────────────────────────────────────
  MEDICATION_READ = 'medication:read',
  MEDICATION_CREATE = 'medication:create',
  MEDICATION_UPDATE = 'medication:update',
  MEDICATION_DELETE = 'medication:delete',

  // ─── TREATMENT PLAN ──────────────────────────────────────
  TREATMENT_PLAN_READ = 'treatment_plan:read',
  TREATMENT_PLAN_CREATE = 'treatment_plan:create',
  TREATMENT_PLAN_UPDATE = 'treatment_plan:update',
  TREATMENT_PLAN_DELETE = 'treatment_plan:delete',

  // ─── DOCUMENT ────────────────────────────────────────────
  DOCUMENT_READ = 'document:read',
  DOCUMENT_CREATE = 'document:create',
  DOCUMENT_UPDATE = 'document:update',
  DOCUMENT_DELETE = 'document:delete',

  // ─── DASHBOARD ───────────────────────────────────────────
  DASHBOARD_READ = 'dashboard:read',

  // ─── REGIMEN ─────────────────────────────────────────────
  REGIMEN_READ = 'regimen:read',
  REGIMEN_CREATE = 'regimen:create',
  REGIMEN_UPDATE = 'regimen:update',
  REGIMEN_DELETE = 'regimen:delete',
}
