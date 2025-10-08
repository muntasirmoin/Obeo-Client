/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { ServiceItem } from "../types/guestServiceType";
import GuestServiceModal from "../Components/GuestServiceModal";

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

    // Automatically recalc totalAmount
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

  // Update totalAmount live when fields change in modal
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

  return (
    <div className="w-full overflow-x-auto">
      {/* table */}
      <Table>
        <TableCaption>A list of Services Bill</TableCaption>
        <TableHeader>
          <TableRow className="bg-black hover:bg-gray-900 rounded-xl">
            <TableHead className="text-center text-white">
              Service Name
            </TableHead>
            <TableHead className="text-center text-white">Room</TableHead>
            <TableHead className="text-center text-white">Rate</TableHead>
            <TableHead className="text-center text-white">Qty</TableHead>
            <TableHead className="text-center text-white">
              Total Amount
            </TableHead>
            <TableHead className="text-center text-white">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tableData.map((item) => (
            <TableRow key={item.id} className="text-center">
              <TableCell>{item.serviceName}</TableCell>
              <TableCell>{item.roomNumber}</TableCell>
              <TableCell>{item.serviceRate}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.totalAmount}</TableCell>
              <TableCell className="flex gap-2 justify-center">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
