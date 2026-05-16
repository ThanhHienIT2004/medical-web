"use client";

import { useEffect, useMemo, useState } from "react";
import { readAuditLog, type AuditLogEntry, writeAuditLog } from "@/app/(admin)/_libs/auditLog";

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setEntries(readAuditLog());
  }, []);

  const rows = useMemo(() => entries, [entries]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Audit log</h1>
        <button
          className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
          onClick={() => {
            writeAuditLog([]);
            setEntries([]);
          }}
        >
          Xóa log
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Thời gian</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Resource</th>
              <th className="p-3 text-left">Resource ID</th>
              <th className="p-3 text-left">Actor</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-500" colSpan={5}>
                  Chưa có log.
                </td>
              </tr>
            ) : (
              rows.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{new Date(e.at).toLocaleString()}</td>
                  <td className="p-3">{e.action}</td>
                  <td className="p-3">{e.resource}</td>
                  <td className="p-3">{e.resourceId ?? ""}</td>
                  <td className="p-3">
                    {e.actorRole ?? ""} {e.actorId ? `(${e.actorId})` : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

