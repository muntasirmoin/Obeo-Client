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

type Payment = {
  date: string;
  invoiceNo: string;
  guestInfo: string;
  paymentType: string;
  paymentMode: string;
  totalAmount: number;
  remarks: string;
};

const mockData: Payment[] = [
  {
    date: "2025-10-15",
    invoiceNo: "INV-1001",
    guestInfo: "John Doe (Room 101)",
    paymentType: "Service",
    paymentMode: "Cash",
    totalAmount: 120,
    remarks: "Paid in full",
  },
  {
    date: "2025-10-14",
    invoiceNo: "INV-1002",
    guestInfo: "Jane Smith (Room 102)",
    paymentType: "Deposit",
    paymentMode: "Card",
    totalAmount: 300,
    remarks: "Partial",
  },
  {
    date: "2025-10-13",
    invoiceNo: "INV-1003",
    guestInfo: "Alex Brown (Room 103)",
    paymentType: "Service",
    paymentMode: "Online",
    totalAmount: 180,
    remarks: "Pending confirmation",
  },
  {
    date: "2025-10-12",
    invoiceNo: "INV-1004",
    guestInfo: "Sara Lee (Room 104)",
    paymentType: "Deposit",
    paymentMode: "Cash",
    totalAmount: 500,
    remarks: "Advance",
  },
  {
    date: "2025-10-11",
    invoiceNo: "INV-1005",
    guestInfo: "David Kim (Room 105)",
    paymentType: "Service",
    paymentMode: "Card",
    totalAmount: 240,
    remarks: "Paid fully",
  },
];

export default function BillPaymentDetailsTable() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = React.useState<Payment[]>(mockData);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [entries, setEntries] = React.useState("2");

  const columns = React.useMemo<ColumnDef<Payment>[]>(
    () => [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "invoiceNo", header: "Invoice No" },
      { accessorKey: "guestInfo", header: "Guest Information" },
      { accessorKey: "paymentType", header: "Payment Type" },
      { accessorKey: "paymentMode", header: "Payment Mode" },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
        cell: ({ row }) => (
          <span className="font-medium text-gray-700">
            ${row.original.totalAmount.toFixed(2)}
          </span>
        ),
      },
      { accessorKey: "remarks", header: "Remarks" },
      {
        id: "actions",
        header: "Action",
        cell: () => (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-blue-50 text-blue-600"
            >
              <Edit size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-green-50 text-green-600"
            >
              <Save size={18} />
            </Button>
          </div>
        ),
      },
    ],
    []
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

  // handle show entries
  React.useEffect(() => {
    table.setPageSize(Number(entries));
  }, [entries]);

  return (
    <Card className="p-6 shadow-lg border border-gray-100 rounded-2xl bg-white">
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-4 text-left border-b pb-2">
        Bill Payment Details
      </h2>

      {/* Row 2: Show entries + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show</span>
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

      {/* Table */}
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
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
