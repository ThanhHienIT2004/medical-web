export type AuditLogEntry = {
  id: string;
  at: string; // ISO
  actorId?: string;
  actorRole?: string;
  action: 'create' | 'update' | 'delete' | 'bulk_delete' | 'export_csv' | 'upload';
  resource: string;
  resourceId?: string;
  meta?: Record<string, unknown>;
};

const KEY = 'admin_audit_log_v1';

export function readAuditLog(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AuditLogEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeAuditLog(entries: AuditLogEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, 500)));
}

export function logAdminAction(entry: Omit<AuditLogEntry, 'id' | 'at'>) {
  const entries = readAuditLog();
  const full: AuditLogEntry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    at: new Date().toISOString(),
    ...entry,
  };
  writeAuditLog([full, ...entries]);
}

