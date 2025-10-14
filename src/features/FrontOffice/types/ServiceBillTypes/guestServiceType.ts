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
