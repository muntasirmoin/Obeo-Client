/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { mockData } from "../../types/GuestBillTypes/mockFetchData";
import {
  paymentModeOptions,
  paymentTypeOptions,
  type Payment,
} from "../../types/GuestBillTypes/guestBillDataTypes";

export default function BillPaymentDetailsTable() {
  const [data, setData] = React.useState<Payment[]>(mockData);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [entries, setEntries] = React.useState("2");
  const [editingRow, setEditingRow] = React.useState<string | null>(null);
  const [editedRow, setEditedRow] = React.useState<Partial<Payment>>({});

  const handleEdit = (rowId: string, rowData: Payment) => {
    setEditingRow(rowId);
    setEditedRow({ ...rowData });
  };

  const handleSaveEdit = (rowId: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.invoiceNo === rowId ? { ...item, ...editedRow } : item
      )
    );
    toast.success("Edit saved successfully!");
    setEditingRow(null);
    setEditedRow({});
  };

  const handleSaveData = (rowId: string) => {
    setData((prev) => prev.filter((item) => item.invoiceNo !== rowId));
    toast.success("Payment saved successfully!");
  };

  const columns = React.useMemo<ColumnDef<Payment>[]>(
    () => [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "invoiceNo", header: "Invoice No" },
      { accessorKey: "guestInfo", header: "Guest Information" },
      {
        accessorKey: "paymentType",
        header: "Payment Type",
        cell: ({ row }) =>
          editingRow === row.original.invoiceNo ? (
            <Select
              value={editedRow.paymentType}
              onValueChange={(value) =>
                setEditedRow((prev) => ({ ...prev, paymentType: value }))
              }
            >
              <SelectTrigger className="h-8 w-full text-sm">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {paymentTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            row.original.paymentType
          ),
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Mode",
        cell: ({ row }) =>
          editingRow === row.original.invoiceNo ? (
            <Select
              value={editedRow.paymentMode}
              onValueChange={(value) =>
                setEditedRow((prev) => ({ ...prev, paymentMode: value }))
              }
            >
              <SelectTrigger className="h-8 w-full text-sm">
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent>
                {paymentModeOptions.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            row.original.paymentMode
          ),
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
        cell: ({ row }) =>
          editingRow === row.original.invoiceNo ? (
            <Input
              type="text" // keep as string
              value={editedRow.totalAmount}
              onChange={(e) =>
                setEditedRow((prev) => ({
                  ...prev,
                  totalAmount: Number(e.target.value), // convert string to number in state
                }))
              }
              className="h-8 text-sm"
            />
          ) : (
            `${row.original.totalAmount.toFixed(2)}`
          ),
      },
      {
        accessorKey: "remarks",
        header: "Remarks",
        cell: ({ row }) =>
          editingRow === row.original.invoiceNo ? (
            <Input
              value={editedRow.remarks}
              onChange={(e) =>
                setEditedRow((prev) => ({ ...prev, remarks: e.target.value }))
              }
              className="h-8 text-sm"
            />
          ) : (
            row.original.remarks
          ),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            {editingRow === row.original.invoiceNo ? (
              <Button
                size="sm"
                onClick={() => handleSaveEdit(row.original.invoiceNo)}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Save
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-50 text-blue-600"
                  onClick={() =>
                    handleEdit(row.original.invoiceNo, row.original)
                  }
                >
                  <Edit size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSaveData(row.original.invoiceNo)}
                  className="hover:bg-green-50 text-green-600"
                >
                  <Save size={18} />
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [editingRow, editedRow]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  React.useEffect(() => {
    table.setPageSize(Number(entries));
  }, [entries]);

  return (
    <Card className="p-3 shadow-lg border border-gray-100 rounded-2xl bg-white">
      <h2 className="text-2xl font-semibold mb-2 text-left border-b pb-2">
        Bill Payment Details
      </h2>

      {/* show entries */}

      <div className="flex flex-col md:flex-row justify-between items-center  gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 ml-1">Show</span>
          <Select value={entries} onValueChange={setEntries}>
            <SelectTrigger className="w-20 h-8 text-sm">
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">entries</span>
        </div>

        <Input
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:w-64 h-9"
        />
      </div>

      {/* table */}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-sm font-semibold text-gray-700 text-center"
                  >
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 transition-all"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-sm text-gray-700">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination */}

      <div className="flex justify-end items-center gap-3 mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {Array.from({ length: table.getPageCount() }).map((_, i) => (
            <Button
              key={i}
              variant={
                table.getState().pagination.pageIndex === i
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}
