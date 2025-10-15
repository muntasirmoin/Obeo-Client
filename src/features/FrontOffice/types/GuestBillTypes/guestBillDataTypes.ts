export type Payment = {
  date: string;
  invoiceNo: string;
  guestInfo: string;
  paymentType: string;
  paymentMode: string;
  totalAmount: number;
  remarks: string;
};

//
export type FormValues = {
  roomNo: string;
  registrationNo: string;
  paymentType: string;
  paymentMode: string;
  currencyType: string;
  paymentAmount: string;
  remarks: string;
};

export const roomOptions = ["Room 101", "Room 102", "Room 103"];
export const paymentTypeOptions = ["Service", "Deposit", "Other"];
export const paymentModeOptions = ["Cash", "Card", "Online"];
export const currencyOptions = ["USD", "BDT", "EUR"];
