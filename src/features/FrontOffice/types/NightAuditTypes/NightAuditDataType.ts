export interface AuditRow {
  id: number;
  roomNo: number;
  guestName: string;
  service: string;
  roomTariff: number;
  sCharge: number;
  vatAmount: number;
  total: number;
  remarks: string;
  audit: "Room Audit" | "Service Audit" | "Restaurant Audit" | "Banquet Audit";
}
