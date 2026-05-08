import type { Session } from "next-auth";
const normalizeRole = (role?: string): Role => {
  const normalized = role?.trim().toUpperCase();
  if (normalized === "ADMIN" || normalized === "DOCTOR" || normalized === "USER") {
    return normalized;
  }
  return "GUEST";
};

export function isAdmin(session: Session | null | undefined): boolean {
  return normalizeRole(session?.user?.role) === "ADMIN";
}

type Role = "ADMIN" | "DOCTOR" | "USER" | "GUEST";
type Permission =
  | "user:read" | "user:list" | "user:create" | "user:update" | "user:delete"
  | "doctor:read" | "doctor:create" | "doctor:update" | "doctor:delete"
  | "patient:read" | "patient:create" | "patient:update" | "patient:delete"
  | "appointment:read" | "appointment:create" | "appointment:update" | "appointment:delete"
  | "examination:read" | "examination:create" | "examination:update" | "examination:delete"
  | "blog:read" | "blog:create" | "blog:update" | "blog:delete"
  | "medication:read" | "medication:create" | "medication:update" | "medication:delete"
  | "treatment_plan:read" | "treatment_plan:create" | "treatment_plan:update" | "treatment_plan:delete"
  | "document:read" | "document:create" | "document:update" | "document:delete"
  | "dashboard:read"
  | "regimen:read" | "regimen:create" | "regimen:update" | "regimen:delete";

export type AdminResource =
  | "users"
  | "doctors"
  | "patients"
  | "appointments"
  | "examinations"
  | "blog-posts"
  | "medications"
  | "treatment-plans"
  | "documents"
  | "regimens"
  | "slots";

export type CrudAccess = {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    "user:read","user:list","user:create","user:update","user:delete",
    "doctor:read","doctor:create","doctor:update","doctor:delete",
    "patient:read","patient:create","patient:update","patient:delete",
    "appointment:read","appointment:create","appointment:update","appointment:delete",
    "examination:read","examination:create","examination:update","examination:delete",
    "blog:read","blog:create","blog:update","blog:delete",
    "medication:read","medication:create","medication:update","medication:delete",
    "treatment_plan:read","treatment_plan:create","treatment_plan:update","treatment_plan:delete",
    "document:read","document:create","document:update","document:delete",
    "dashboard:read",
    "regimen:read","regimen:create","regimen:update","regimen:delete",
  ],
  DOCTOR: [
    "doctor:read",
    "user:read","user:list",
    "patient:read",
    "appointment:read","appointment:update",
    "examination:read","examination:create","examination:update","examination:delete",
    "document:read","document:create","document:update",
    "blog:read","blog:create","blog:update","blog:delete",
    "medication:read",
    "regimen:read",
    "treatment_plan:read","treatment_plan:create","treatment_plan:update",
    "dashboard:read",
  ],
  USER: [
    "doctor:read",
    "user:read","user:update",
    "patient:read","patient:update",
    "appointment:read","appointment:create","appointment:update",
    "document:read","document:create",
    "blog:read",
    "medication:read",
    "regimen:read",
    "treatment_plan:read",
    "examination:read",
  ],
  GUEST: ["blog:read","doctor:read","medication:read"],
};

const RESOURCE_PERMISSION_PREFIX: Record<AdminResource, string> = {
  users: "user",
  doctors: "doctor",
  patients: "patient",
  appointments: "appointment",
  examinations: "examination",
  "blog-posts": "blog",
  medications: "medication",
  "treatment-plans": "treatment_plan",
  documents: "document",
  regimens: "regimen",
  slots: "appointment",
};

export function getCrudAccess(session: Session | null | undefined, resource: AdminResource): CrudAccess {
  const role = normalizeRole(session?.user?.role);
  const permissions = new Set<Permission>(ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS.GUEST);
  const prefix = RESOURCE_PERMISSION_PREFIX[resource];

  return {
    canView: permissions.has(`${prefix}:read` as Permission),
    canCreate: permissions.has(`${prefix}:create` as Permission),
    canEdit: permissions.has(`${prefix}:update` as Permission),
    canDelete: permissions.has(`${prefix}:delete` as Permission),
  };
}

