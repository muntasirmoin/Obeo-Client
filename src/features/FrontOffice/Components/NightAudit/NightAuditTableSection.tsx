import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Save } from "lucide-react";
import { toast } from "sonner";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type FilterFn,
} from "@tanstack/react-table";
import { initialData } from "../../types/NightAuditTypes/mockFetchDataNightAudit";
import type { AuditRow } from "../../types/NightAuditTypes/NightAuditDataType";

// Filter Function

const globalFilterFn: FilterFn<AuditRow> = (row, columnId, filterValue) => {
  const value = String(row.getValue(columnId)).toLowerCase();
  return value.includes(String(filterValue).toLowerCase());
};

//  Component

export default function NightAuditTableSection() {
  const [tableData, setTableData] = useState<AuditRow[]>(initialData);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("Room Audit");
  const [globalFilter, setGlobalFilter] = useState<string>("");

  // Filter data by audit type
  const filteredData = useMemo(
    () => tableData.filter((item) => item.audit === selectedFilter),
    [selectedFilter, tableData]
  );

  // ===================
  // ✅ Table Functions
  // ===================
  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
  };

  const handleSaveRow = (id: number) => {
    toast.success(`Row ${id} Saved Successfully`);
    setTableData((prev) => prev.filter((row) => row.id !== id));
    setSelectedRows((prev) => prev.filter((i) => i !== id));
  };

  const approveSelected = () => {
    if (!selectedRows.length) return toast.error("No rows selected");
    toast.success(`Approved Rows: ${selectedRows.join(", ")}`);
    setTableData((prev) =>
      prev.filter((row) => !selectedRows.includes(row.id))
    );
    setSelectedRows([]);
  };

  const approveAll = () => {
    toast.success("Approved All Rows");
    setTableData((prev) => prev.filter((row) => row.audit !== selectedFilter));
    setSelectedRows([]);
  };

  // Print Selected

  const handlePrintSelected = () => {
    const selectedData = filteredData.filter((row) =>
      selectedRows.includes(row.id)
    );
    if (!selectedData.length) {
      toast.error("No rows selected to print");
      return;
    }

    const newWindow = window.open("", "_blank");
    if (!newWindow) return;

    newWindow.document.write(`
      <html>
        <head>
          <title>Print Selected Rows</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>Selected ${selectedFilter} Rows</h2>
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
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${selectedData
                .map(
                  (d) => `<tr>
                    <td>${d.roomNo}</td>
                    <td>${d.guestName}</td>
                    <td>${d.service}</td>
                    <td>${d.roomTariff}</td>
                    <td>${d.sCharge}</td>
                    <td>${d.vatAmount}</td>
                    <td>${d.total}</td>
                    <td>${d.remarks}</td>
                  </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <script>window.onload = () => window.print()</script>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  // Table Columns

  const columnHelper = createColumnHelper<AuditRow>();

  const columns = [
    columnHelper.display({
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={
            selectedRows.length === filteredData.length &&
            filteredData.length > 0
          }
          onChange={toggleAllRows}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.original.id)}
          onChange={() => toggleRow(row.original.id)}
        />
      ),
    }),
    columnHelper.accessor("roomNo", { header: "Room No" }),
    columnHelper.accessor("guestName", { header: "Guest Name" }),
    columnHelper.accessor("service", { header: "Service" }),
    columnHelper.accessor("roomTariff", { header: "Room Tariff" }),
    columnHelper.accessor("sCharge", { header: "S. Charge" }),
    columnHelper.accessor("vatAmount", { header: "VAT Amount" }),
    columnHelper.accessor("total", { header: "Total" }),
    columnHelper.accessor("remarks", { header: "Remarks" }),
    columnHelper.display({
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleSaveRow(row.original.id)}
        >
          <Save className="w-4 h-4 text-blue-600" />
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn,
  });

  const filters = [
    "Room Audit",
    "Service Audit",
    "Restaurant Audit",
    "Banquet Audit",
  ];

  //  Render table

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden mt-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-4 border-b">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant="outline"
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 cursor-pointer font-medium ${
              selectedFilter === filter
                ? "bg-black text-white border-black"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b bg-gray-50 gap-3">
        <h2 className="text-lg font-semibold text-gray-800">
          {selectedFilter} Information
        </h2>
        <Button
          onClick={handlePrintSelected}
          disabled={selectedRows.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Print
        </Button>
      </div>

      {/* Table Section */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-center">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-muted/40">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {filteredData.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Action Buttons */}
      <div className="flex justify-start gap-3 p-4 border-t bg-gray-50">
        <Button
          onClick={approveSelected}
          disabled={selectedRows.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Approve Selected
        </Button>
        <Button
          onClick={approveAll}
          disabled={filteredData.length === 0}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Approve All
        </Button>
      </div>
    </div>
  );
}
