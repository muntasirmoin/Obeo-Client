import { useState } from "react";
import TitleSubtitle from "@/features/serviceBill/Components/TitleSubtitle";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface AuditRow {
  id: number;
  roomNo: number;
  guestName: string;
  service: string;
  roomTariff: number;
  sCharge: number;
  vatAmount: number;
  total: number;
  remarks: string;
}

interface AuditTableProps {
  title: string;
  data: AuditRow[];
  selected: number[];
  onSelectedChange: (selectedIds: number[]) => void;
}

const TableWithActions = ({
  title,
  data,
  selected,
  onSelectedChange,
}: AuditTableProps) => {
  const [search, setSearch] = useState("");
  const selectAll = selected.length === data.length;

  const toggleSelect = (id: number) => {
    const newSelected = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];
    onSelectedChange(newSelected);
  };

  const toggleSelectAll = () => {
    const newSelected = selectAll ? [] : filteredData.map((d) => d.id);
    onSelectedChange(newSelected);
  };

  const handlePrint = () => {
    const selectedData = filteredData.filter((d) => selected.includes(d.id));
    if (!selectedData.length) return;

    const newWindow = window.open("", "_blank");
    if (!newWindow) return;

    newWindow.document.write(`
      <html>
        <head>
          <title>Print ${title}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f5f5f5; }
            h2 { text-align: center; margin-bottom: 10px; }
            p { text-align: center; margin-bottom: 20px; color: gray; }
          </style>
        </head>
        <body>
          <h2>${title}</h2>
          <p>Night Audit Information</p>
          <table>
            <thead>
              <tr>
                <th>Room No</th>
                <th>Guest Name</th>
                <th>Service</th>
                <th>Room Tariff</th>
                <th>S. Charge</th>
                <th>VAT Amount</th>
                <th>Total</th>
                <th>Hotel Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${selectedData
                .map(
                  (d) => `
                <tr>
                  <td>${d.roomNo}</td>
                  <td>${d.guestName}</td>
                  <td>${d.service}</td>
                  <td>${d.roomTariff}</td>
                  <td>${d.sCharge}</td>
                  <td>${d.vatAmount}</td>
                  <td>${d.total}</td>
                  <td>${d.remarks}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  const approveSelected = () => {
    if (!selected.length) return;
    toast.success(`${title} → Approved Selected: ${selected.join(", ")}`);
  };

  const approveAll = () => {
    toast.success(`${title} → Approved All Records`);
  };

  // Filtered data based on search input
  const filteredData = data.filter((row) =>
    row.roomNo.toString().includes(search)
  );

  return (
    <div className="p-4 space-y-4 border rounded-lg shadow-sm bg-white mb-8">
      <TitleSubtitle title={title} subtitle="Night Audit Information" />

      {/* Search */}
      <div className="flex justify-end mb-2">
        <input
          type="text"
          placeholder="Search Room No"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              {[
                "Room No",
                "Guest Name",
                "Service",
                "Room Tariff",
                "S. Charge",
                "VAT Amount",
                "Total",
                "Hotel Remarks",
                "Action",
              ].map((col, idx) => (
                <th key={idx} className="px-3 py-2 font-medium text-center">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                  />
                </td>
                <td className="px-3 py-2">{row.roomNo}</td>
                <td className="px-3 py-2">{row.guestName}</td>
                <td className="px-3 py-2">{row.service}</td>
                <td className="px-3 py-2">{row.roomTariff}</td>
                <td className="px-3 py-2">{row.sCharge}</td>
                <td className="px-3 py-2">{row.vatAmount}</td>
                <td className="px-3 py-2">{row.total}</td>
                <td className="px-3 py-2">{row.remarks}</td>
                <td className="px-3 py-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Save size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={approveSelected}
          disabled={!selected.length}
          className="px-4 py-2 bg-green-600 text-white rounded-md disabled:bg-gray-400 hover:bg-green-700 transition"
        >
          Approve Selected
        </button>
        <button
          onClick={approveAll}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
        >
          Approve All
        </button>
        <button
          onClick={handlePrint}
          disabled={!selected.length}
          className="px-4 py-2 disabled:cursor-not-allowed cursor-pointer bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition"
        >
          Print {title}
        </button>
      </div>
    </div>
  );
};

export default TableWithActions;
