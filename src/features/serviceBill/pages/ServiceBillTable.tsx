// components/GuestServiceTable.tsx
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface ServiceItem {
  id: number;
  serviceName: string;
  roomNumber: string;
  serviceRate: number;
  quantity: number;
  totalAmount: number;
}

interface TableProps {
  tableData: ServiceItem[];
  setTableData: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
}

export default function GuestServiceTable({
  tableData,
  setTableData,
}: TableProps) {
  const handleDelete = (id: number) => {
    setTableData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Service Name</th>
            <th className="border p-2">Room</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.serviceName}</td>
              <td className="border p-2">{item.roomNumber}</td>
              <td className="border p-2">{item.serviceRate}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.totalAmount}</td>
              <td className="border p-2 space-x-5">
                <Button
                  className="bg-green-500 cursor-pointer"
                  size="sm"
                  onClick={() => toast.success("Saved successfully!")}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  onClick={() => toast.message("Edit action triggered")}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    handleDelete(item.id);
                    toast.error("Deleted successfully!");
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
