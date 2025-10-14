/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ServiceItem } from "../types/guestServiceType";
import GuestServiceModal from "./GuestServiceModal";

interface TableProps {
  tableData: ServiceItem[];
  setTableData: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
}

export default function GuestServiceTable({
  tableData,
  setTableData,
}: TableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);

  const handleDelete = (id: number) => {
    setTableData((prev) => prev.filter((item) => item.id !== id));
    toast.error("Deleted successfully!");
  };

  const handleSave = (id: number) => {
    setTableData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Save successfully!");
  };

  const handleEditClick = (item: ServiceItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    const total =
      editingItem.serviceRate * editingItem.quantity +
      editingItem.vat +
      editingItem.sdCharge +
      editingItem.additionalCharge +
      editingItem.serviceCharge;

    const updatedItem = { ...editingItem, totalAmount: total };

    setTableData((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );

    toast.success("Edited successfully!");
    setIsModalOpen(false);
    setEditingItem(null);
  };

  useEffect(() => {
    if (editingItem) {
      const total =
        editingItem.serviceRate * editingItem.quantity +
        editingItem.vat +
        editingItem.sdCharge +
        editingItem.additionalCharge +
        editingItem.serviceCharge;

      setEditingItem((prev) => (prev ? { ...prev, totalAmount: total } : prev));
    }
  }, [
    editingItem?.serviceRate,
    editingItem?.quantity,
    editingItem?.vat,
    editingItem?.sdCharge,
    editingItem?.additionalCharge,
    editingItem?.serviceCharge,
  ]);

  // TanStack Table columns
  const columnHelper = createColumnHelper<ServiceItem>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("serviceName", {
        header: "Service Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("roomNumber", {
        header: "Room",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("serviceRate", {
        header: "Rate",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("quantity", {
        header: "Qty",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("totalAmount", {
        header: "Total Amount",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Action",
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                className="bg-green-500"
                onClick={() => handleSave(item.id)}
              >
                Save
              </Button>
              <Button
                size="sm"
                className="bg-blue-600"
                onClick={() => handleEditClick(item)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </div>
          );
        },
      }),
    ],
    [tableData]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-black text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-center p-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="text-center border-t">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <GuestServiceModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
