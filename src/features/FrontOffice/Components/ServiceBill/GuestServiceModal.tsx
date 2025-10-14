/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { ServiceItem } from "../../types/ServiceBillTypes/guestServiceType";

interface GuestServiceModalProps {
  isOpen: boolean;
  editingItem: ServiceItem | null;
  setEditingItem: React.Dispatch<React.SetStateAction<ServiceItem | null>>;
  onClose: () => void;
  onSave: () => void;
}

export default function GuestServiceModal({
  isOpen,
  editingItem,
  setEditingItem,
  onClose,
  onSave,
}: GuestServiceModalProps) {
  // live recalc totalAmount
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

  if (!isOpen || !editingItem) return null;

  return (
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
                readOnly={field === "totalAmount"}
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <Button size="sm" className="bg-green-500" onClick={onSave}>
              Save
            </Button>
            <Button size="sm" variant="destructive" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
