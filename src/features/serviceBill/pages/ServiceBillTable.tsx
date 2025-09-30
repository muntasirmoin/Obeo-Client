/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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

export interface ServiceItem {
  id: number;
  guestType: string;
  registrationNumber: string;
  fullName: string;
  guestEmail: string;
  roomNumber: string;
  serviceName: string;
  serviceRate: number;
  quantity: number;
  totalAmount: number;
  complimentary: string;
  remarks: string;
  vat: number;
  sdCharge: number;
  additionalCharge: number;
  serviceCharge: number;
}

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
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit Service</h2>
            <div className="flex flex-col gap-0">
              <label className="text-left font-bold ml-2 capitalize">
                Guest Type
              </label>
              <Select
                value={editingItem.guestType}
                onValueChange={(val) =>
                  setEditingItem({ ...editingItem, guestType: val })
                }
              >
                <SelectTrigger className="h-9 w-full border border-gray-300 rounded-md text-sm">
                  <SelectValue placeholder="Select Guest Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Walk-in">Walk-in</SelectItem>
                </SelectContent>
              </Select>

              {[
                "registrationNumber",
                "fullName",
                "guestEmail",
                "roomNumber",
                "serviceName",
                "complimentary",
                "remarks",
              ].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-left font-bold ml-2 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  {field === "serviceName" || field === "complimentary" ? (
                    <Select
                      value={editingItem[field as keyof ServiceItem] as string}
                      onValueChange={(val) =>
                        setEditingItem({ ...editingItem, [field]: val })
                      }
                    >
                      <SelectTrigger className="h-9 w-full border border-gray-300 rounded-md text-sm">
                        <SelectValue placeholder={`Select ${field}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field === "serviceName" && (
                          <>
                            <SelectItem value="Room Cleaning">
                              Room Cleaning
                            </SelectItem>
                            <SelectItem value="Laundry Service">
                              Laundry Service
                            </SelectItem>
                            <SelectItem value="Food Delivery">
                              Food Delivery
                            </SelectItem>
                            <SelectItem value="Spa Treatment">
                              Spa Treatment
                            </SelectItem>
                            <SelectItem value="Airport Pickup">
                              Airport Pickup
                            </SelectItem>
                            <SelectItem value="Minibar">Minibar</SelectItem>
                            <SelectItem value="Extra Bed">Extra Bed</SelectItem>
                          </>
                        )}
                        {field === "complimentary" && (
                          <>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="Yes">Yes</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={editingItem[field as keyof ServiceItem] as string}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          [field]: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}

              {/* Numeric fields */}
              {[
                "serviceRate",
                "quantity",
                "vat",
                "sdCharge",
                "additionalCharge",
                "serviceCharge",
                "totalAmount",
              ].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-left font-bold ml-2 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <Input
                    type="number"
                    value={editingItem[field as keyof ServiceItem] as number}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        [field]: Number(e.target.value),
                      })
                    }
                    readOnly={field === "totalAmount"} // totalAmount calculated automatically
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="sm"
                  className="bg-green-500"
                  onClick={handleSaveEdit}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
