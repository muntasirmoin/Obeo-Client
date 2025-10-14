/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import TitleSubtitle from "@/Features/FrontOffice/Components/ServiceBill/TitleSubtitle";

export type Room = { id: string; name: string };
export type Guest = { regNo: string; name: string; roomId: string };

type Props = {
  rooms: Room[];
  onAddPayment: (payload: any) => void;
  fetchGuestByRoom: (roomId: string) => Promise<Guest | null>;
};

export const GuestBillPaymentForm: React.FC<Props> = ({
  rooms,
  onAddPayment,
  fetchGuestByRoom,
}) => {
  const [roomId, setRoomId] = useState<string>("");
  const [guest, setGuest] = useState<Guest | null>(null);
  const [paymentType, setPaymentType] = useState<string>("payment");
  const [paymentMode, setPaymentMode] = useState<string>("cash");
  const [amount, setAmount] = useState<number | "">("");
  const [remarks, setRemarks] = useState<string>("");

  useEffect(() => {
    if (!roomId) return setGuest(null);
    let mounted = true;
    fetchGuestByRoom(roomId).then((g) => {
      if (mounted) setGuest(g);
    });
    return () => {
      mounted = false;
    };
  }, [roomId, fetchGuestByRoom]);

  function clearForm() {
    setRoomId("");
    setGuest(null);
    setPaymentType("payment");
    setPaymentMode("cash");
    setAmount("");
    setRemarks("");

    toast.success(`From cleared`, {
      position: "bottom-center", // <-- set bottom
    });
  }

  function handlePay() {
    setRoomId("");
    setGuest(null);
    setPaymentType("payment");
    setPaymentMode("cash");
    setAmount("");
    setRemarks("");
    if (!roomId) {
      toast.error("Please select a room before making payment", {
        position: "bottom-center", // <-- set bottom
      });
      return;
    }

    const payload = {
      date: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now()}`,
      guest: guest
        ? {
            name: guest.name,
            room: rooms.find((r) => r.id === roomId)?.name ?? "",
            regNo: guest.regNo,
          }
        : { name: "-", room: "-", regNo: "-" },
      paymentType,
      paymentMode,
      amount: Number(amount) || 0,
      remarks,
    };

    onAddPayment(payload);

    toast.success(`Payment recorded: ${payload.invoiceNumber}`, {
      position: "bottom-center", // <-- set bottom
    });
    setRoomId("");
    setGuest(null);
    setPaymentType("payment");
    setPaymentMode("cash");
    setAmount("");
    setRemarks("");
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-6 bg-white rounded-2xl shadow-md space-y-6">
        {/* <h3 className="text-xl font-bold text-gray-800">Guest Bill Payment</h3> */}
        <TitleSubtitle
          title="Guest Bill Payment Here"
          subtitle="Search Information"
        />

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Room No</Label>
            <Select value={roomId} onValueChange={(v: string) => setRoomId(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Registration No.</Label>
            <Input
              readOnly
              value={guest?.regNo ?? ""}
              placeholder="Auto-filled"
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Guest Name</Label>
            <Input
              readOnly
              value={guest?.name ?? ""}
              placeholder="Auto-filled"
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Payment Type</Label>
            <Select
              value={paymentType}
              onValueChange={(v: any) => setPaymentType(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="due">Due</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Payment Mode</Label>
            <Select
              value={paymentMode}
              onValueChange={(v: any) => setPaymentMode(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount as any}
              onChange={(e: any) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 space-y-1.5">
            <Label>Remarks</Label>
            <Textarea
              value={remarks}
              onChange={(e: any) => setRemarks(e.target.value)}
              placeholder="Optional notes..."
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end md:justify-start">
            <Button
              onClick={handlePay}
              className="w-1/2 md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Pay
            </Button>
            <Button
              variant="outline"
              onClick={clearForm}
              className="w-1/2 md:w-auto"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestBillPaymentForm;
