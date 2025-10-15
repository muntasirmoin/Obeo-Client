import type { Payment } from "./guestBillDataTypes";

export const mockData: Payment[] = [
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
