/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // notifications
import TitleSubtitle from "@/features/serviceBill/Components/TitleSubtitle";

export type BillRow = {
  id: string;
  date: string;
  invoiceNumber: string;
  guestName: string;
  room: string;
  regNo: string;
  paymentType: string;
  paymentMode: string;
  amount: number;
  remarks?: string;
};

type Props = {
  data?: BillRow[];
  onEdit?: (row: BillRow) => void;
  entriesOptions?: number[];
};

export const GuestBillPaymentTable: React.FC<Props> = ({
  data,
  onEdit = (row) => console.log("Edited row:", row),
  entriesOptions = [5, 10, 25, 50, 100],
}) => {
  // 5 static dummy data
  const staticData: BillRow[] = [
    {
      id: "1",
      date: new Date().toISOString(),
      invoiceNumber: "INV-1001",
      guestName: "John Doe",
      room: "101",
      regNo: "REG001",
      paymentType: "payment",
      paymentMode: "cash",
      amount: 250,
      remarks: "No remarks",
    },
    {
      id: "2",
      date: new Date().toISOString(),
      invoiceNumber: "INV-1002",
      guestName: "Jane Smith",
      room: "102",
      regNo: "REG002",
      paymentType: "due",
      paymentMode: "card",
      amount: 500,
      remarks: "Late payment",
    },
    {
      id: "3",
      date: new Date().toISOString(),
      invoiceNumber: "INV-1003",
      guestName: "Michael Brown",
      room: "103",
      regNo: "REG003",
      paymentType: "payment",
      paymentMode: "bank",
      amount: 350,
      remarks: "",
    },
    {
      id: "4",
      date: new Date().toISOString(),
      invoiceNumber: "INV-1004",
      guestName: "Emily Davis",
      room: "104",
      regNo: "REG004",
      paymentType: "due",
      paymentMode: "cash",
      amount: 450,
      remarks: "Advance paid",
    },
    {
      id: "5",
      date: new Date().toISOString(),
      invoiceNumber: "INV-1005",
      guestName: "William Johnson",
      room: "105",
      regNo: "REG005",
      paymentType: "payment",
      paymentMode: "card",
      amount: 600,
      remarks: "",
    },
  ];

  const [entries, setEntries] = useState<number>(entriesOptions[0]);
  const [page, setPage] = useState<number>(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [localRows, setLocalRows] = useState<BillRow[]>(data ?? staticData);

  // Only update rows if actual data is passed
  useEffect(() => {
    if (data && data.length > 0) {
      setLocalRows(data);
    }
  }, [data]);

  const pageCount = Math.max(1, Math.ceil(localRows.length / entries));

  const visibleRows = useMemo(() => {
    const start = (page - 1) * entries;
    return localRows.slice(start, start + entries);
  }, [localRows, page, entries]);

  function handleSave(row: BillRow) {
    setLocalRows((prev) => prev.map((r) => (r.id === row.id ? row : r)));
    setEditingId(null);
    onEdit(row);

    toast.success(`Row saved successfully!`, {
      position: "bottom-center", // <-- set bottom
    });
  }

  function handleEdit(row: BillRow) {
    setEditingId(row.id);

    toast.success(`Edit mode enabled`, {
      position: "bottom-center", // <-- set bottom
    });
  }

  return (
    <div className="mt-6 bg-white p-4 rounded-2xl shadow-md">
      <TitleSubtitle title="" subtitle="Guest Bill Payment Details" />
      {/* Entries & Total */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <Select
            value={String(entries)}
            onValueChange={(v: any) => {
              setEntries(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {entriesOptions.map((o) => (
                <SelectItem key={o} value={String(o)}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>entries</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {localRows.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr className="text-center">
              <th className="py-2 px-2">Date</th>
              <th className="px-2">Invoice No</th>
              <th className="px-2">Guest (Name • Room • Reg#)</th>
              <th className="px-2">Payment Type</th>
              <th className="px-2">Mode</th>
              <th className="py-2 px-2 text-right">Amount</th>
              <th className="px-2">Remarks</th>
              <th className="px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="py-2 px-2">
                  {editingId === row.id ? (
                    <Input
                      readOnly
                      value={row.date}
                      onChange={(e: any) =>
                        setLocalRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id ? { ...r, date: e.target.value } : r
                          )
                        )
                      }
                    />
                  ) : (
                    new Date(row.date).toLocaleString()
                  )}
                </td>

                <td className="px-2">
                  {editingId === row.id ? (
                    <Input
                      value={row.invoiceNumber}
                      readOnly
                      onChange={(e: any) =>
                        setLocalRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id
                              ? { ...r, invoiceNumber: e.target.value }
                              : r
                          )
                        )
                      }
                    />
                  ) : (
                    row.invoiceNumber
                  )}
                </td>

                <td className="px-2">
                  {editingId === row.id ? (
                    <div className="grid gap-1">
                      <Input
                        value={row.guestName}
                        onChange={(e: any) =>
                          setLocalRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id
                                ? { ...r, guestName: e.target.value }
                                : r
                            )
                          )
                        }
                      />
                      <div className="flex gap-2 items-center text-sm">
                        <Input
                          value={row.room}
                          onChange={(e: any) =>
                            setLocalRows((prev) =>
                              prev.map((r) =>
                                r.id === row.id
                                  ? { ...r, room: e.target.value }
                                  : r
                              )
                            )
                          }
                        />
                        <Input
                          value={row.regNo}
                          onChange={(e: any) =>
                            setLocalRows((prev) =>
                              prev.map((r) =>
                                r.id === row.id
                                  ? { ...r, regNo: e.target.value }
                                  : r
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      {row.guestName} • {row.room} • {row.regNo}
                    </div>
                  )}
                </td>

                <td className="px-2">
                  {editingId === row.id ? (
                    <Select
                      value={row.paymentType}
                      onValueChange={(v: any) =>
                        setLocalRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id ? { ...r, paymentType: v } : r
                          )
                        )
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="due">Due</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    row.paymentType
                  )}
                </td>

                <td className="px-2">
                  {editingId === row.id ? (
                    <Select
                      value={row.paymentMode}
                      onValueChange={(v: any) =>
                        setLocalRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id ? { ...r, paymentMode: v } : r
                          )
                        )
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank">Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    row.paymentMode
                  )}
                </td>

                <td className="text-right px-2">
                  {editingId === row.id ? (
                    <Input
                      type="number"
                      value={String(row.amount)}
                      onChange={(e: any) =>
                        setLocalRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id
                              ? { ...r, amount: Number(e.target.value) }
                              : r
                          )
                        )
                      }
                    />
                  ) : (
                    row.amount.toFixed(2)
                  )}
                </td>

                <td className="px-2">
                  {editingId === row.id ? (
                    <Input
                      value={row.remarks ?? ""}
                      onChange={(e: any) =>
                        setLocalRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id
                              ? { ...r, remarks: e.target.value }
                              : r
                          )
                        )
                      }
                    />
                  ) : (
                    row.remarks
                  )}
                </td>

                <td className="px-2">
                  {editingId === row.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(row)}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => handleEdit(row)}>
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))}

            {visibleRows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-6 text-center text-muted-foreground"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-2">
        <div className="text-sm">
          Showing {(page - 1) * entries + 1} to{" "}
          {Math.min(page * entries, localRows.length)} of {localRows.length}{" "}
          entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <div className="px-3">
            {page} / {pageCount}
          </div>
          <Button
            variant="ghost"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestBillPaymentTable;
