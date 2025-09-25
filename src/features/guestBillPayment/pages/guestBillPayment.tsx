/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useMemo, useState } from "react";
import GuestBillPaymentTable, { type BillRow } from "./guestBillPaymentTable";
import GuestBillPaymentForm, {
  type Guest,
  type Room,
} from "./guestBillPaymentForm";

// Mock data and API helpers — replace with real API calls
const MOCK_ROOMS: Room[] = [
  { id: "r1", name: "101" },
  { id: "r2", name: "102" },
  { id: "r3", name: "103" },
  { id: "r4", name: "201" },
  { id: "r5", name: "202" },
  { id: "r6", name: "203" },
  { id: "r7", name: "301" },
  { id: "r8", name: "302" },
  { id: "r9", name: "303" },
  { id: "r10", name: "401" },
];

const MOCK_GUESTS: Guest[] = [
  { regNo: "REG-1001", name: "Amir", roomId: "r1" },
  { regNo: "REG-1002", name: "Ali", roomId: "r2" },
  { regNo: "REG-1003", name: "Kobir", roomId: "r3" },
  { regNo: "REG-1004", name: "Sara", roomId: "r4" },
  { regNo: "REG-1005", name: "Nabila", roomId: "r5" },
  { regNo: "REG-1006", name: "Rashed", roomId: "r6" },
  { regNo: "REG-1007", name: "Tania", roomId: "r7" },
  { regNo: "REG-1008", name: "Farhan", roomId: "r8" },
  { regNo: "REG-1009", name: "Jamil", roomId: "r9" },
  { regNo: "REG-1010", name: "Laila", roomId: "r10" },
];

async function fetchGuestByRoomApi(roomId: string): Promise<Guest | null> {
  // simulate async
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_GUESTS.find((g) => g.roomId === roomId) ?? null;
}

export const GuestBillPaymentPage: React.FC = () => {
  const [rows, setRows] = useState<BillRow[]>(() => {
    // initial empty
    return [];
  });

  const rooms = useMemo(() => MOCK_ROOMS, []);

  const handleAddPayment = useCallback((payload: any) => {
    const newRow: BillRow = {
      id: String(Date.now()),
      date: payload.date,
      invoiceNumber: payload.invoiceNumber,
      guestName: payload.guest.name,
      room: payload.guest.room,
      regNo: payload.guest.regNo,
      paymentType: payload.paymentType,
      paymentMode: payload.paymentMode,
      amount: payload.amount,
      remarks: payload.remarks,
    };
    setRows((prev) => [newRow, ...prev]);
  }, []);

  const handleEdit = useCallback((row: BillRow) => {
    // if you want to persist edits to a backend, call API here
    setRows((prev) => prev.map((r) => (r.id === row.id ? row : r)));
  }, []);

  return (
    <div className="space-y-6 m-3">
      <GuestBillPaymentForm
        rooms={rooms}
        onAddPayment={handleAddPayment}
        fetchGuestByRoom={fetchGuestByRoomApi}
      />
      <GuestBillPaymentTable
        data={rows}
        onEdit={handleEdit}
        entriesOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default GuestBillPaymentPage;
