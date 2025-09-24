import { useState } from "react";

export default function AuditDateForm() {
  const [auditDate, setAuditDate] = useState("");

  return (
    <div className="mx-auto p-4 space-y-3 border rounded shadow-sm">
      {/* First Div - Audit Date Input */}
      <div className="flex justify-center items-center py-3">
        <div className="w-full sm:w-2/3 md:w-1/3 lg:w-1/4 bg-white p-4 rounded-lg shadow-md border">
          <label
            htmlFor="auditDate"
            className="block mb-2 text-sm font-medium text-gray-700 text-left"
          >
            Audit Date
          </label>
          <input
            id="auditDate"
            type="date"
            value={auditDate}
            onChange={(e) => setAuditDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Second Div - Auto-filled Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          "Current Room Date",
          "Current Service Date",
          "Current Restaurant Date",
          "Current Banquet Date",
        ].map((label, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-white shadow-sm rounded-lg p-3 border hover:shadow-md transition"
          >
            <label className="mb-1 font-medium text-sm text-gray-700 text-left">
              {label}
            </label>
            <input
              type="date"
              value={auditDate}
              readOnly
              className="border p-2 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
