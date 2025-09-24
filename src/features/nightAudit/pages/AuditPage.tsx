/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import TableWithActions from "./NightAuditTable";

// Example mock data
const roomAuditData = [
  {
    id: 1,
    roomNo: 101,
    guestName: "John Doe",
    service: "Laundry",
    roomTariff: 200,
    sCharge: 20,
    vatAmount: 15,
    total: 235,
    remarks: "VIP Guest",
  },
  {
    id: 2,
    roomNo: 102,
    guestName: "Alice Smith",
    service: "Room Cleaning",
    roomTariff: 220,
    sCharge: 22,
    vatAmount: 16,
    total: 258,
    remarks: "Needs Extra Towels",
  },
  {
    id: 3,
    roomNo: 103,
    guestName: "Robert Brown",
    service: "Mini Bar",
    roomTariff: 250,
    sCharge: 25,
    vatAmount: 18,
    total: 293,
    remarks: "Frequent Guest",
  },
];

const serviceAuditData = [
  {
    id: 4,
    roomNo: 201,
    guestName: "Jane Taylor",
    service: "Spa",
    roomTariff: 250,
    sCharge: 25,
    vatAmount: 18,
    total: 293,
    remarks: "Late Checkout",
  },
  {
    id: 5,
    roomNo: 202,
    guestName: "Chris Evans",
    service: "Gym",
    roomTariff: 200,
    sCharge: 20,
    vatAmount: 15,
    total: 235,
    remarks: "Trainer Requested",
  },
  {
    id: 6,
    roomNo: 203,
    guestName: "Sophia Green",
    service: "Laundry",
    roomTariff: 180,
    sCharge: 18,
    vatAmount: 14,
    total: 212,
    remarks: "Urgent Delivery",
  },
];

const restaurantAuditData = [
  {
    id: 7,
    roomNo: 301,
    guestName: "Michael Johnson",
    service: "Dinner",
    roomTariff: 300,
    sCharge: 30,
    vatAmount: 22,
    total: 352,
    remarks: "Frequent Visitor",
  },
  {
    id: 8,
    roomNo: 302,
    guestName: "Emma Davis",
    service: "Breakfast",
    roomTariff: 150,
    sCharge: 15,
    vatAmount: 12,
    total: 177,
    remarks: "Vegetarian",
  },
  {
    id: 9,
    roomNo: 303,
    guestName: "Liam Wilson",
    service: "Lunch",
    roomTariff: 200,
    sCharge: 20,
    vatAmount: 15,
    total: 235,
    remarks: "Allergic to Nuts",
  },
];

const banquetAuditData = [
  {
    id: 10,
    roomNo: 401,
    guestName: "Emily Clark",
    service: "Wedding Event",
    roomTariff: 180,
    sCharge: 15,
    vatAmount: 12,
    total: 207,
    remarks: "VIP Guest",
  },
  {
    id: 11,
    roomNo: 402,
    guestName: "Daniel Martinez",
    service: "Conference",
    roomTariff: 500,
    sCharge: 50,
    vatAmount: 40,
    total: 590,
    remarks: "Corporate Booking",
  },
  {
    id: 12,
    roomNo: 403,
    guestName: "Olivia Harris",
    service: "Birthday Party",
    roomTariff: 300,
    sCharge: 25,
    vatAmount: 20,
    total: 345,
    remarks: "Special Cake Ordered",
  },
];

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState("Room");

  const [selectedRows, setSelectedRows] = useState({
    Room: [] as number[],
    Service: [] as number[],
    Restaurant: [] as number[],
    Banquet: [] as number[],
  });

  const handleSelectedChange = (table: string, selectedIds: number[]) => {
    setSelectedRows((prev) => ({ ...prev, [table]: selectedIds }));
  };

  const renderTable = () => {
    switch (activeTab) {
      case "Room":
        return (
          <TableWithActions
            title="Room Audit"
            data={roomAuditData}
            selected={selectedRows.Room}
            onSelectedChange={(ids: any) => handleSelectedChange("Room", ids)}
          />
        );
      case "Service":
        return (
          <TableWithActions
            title="Service Audit"
            data={serviceAuditData}
            selected={selectedRows.Service}
            onSelectedChange={(ids: any) =>
              handleSelectedChange("Service", ids)
            }
          />
        );
      case "Restaurant":
        return (
          <TableWithActions
            title="Restaurant Audit"
            data={restaurantAuditData}
            selected={selectedRows.Restaurant}
            onSelectedChange={(ids: any) =>
              handleSelectedChange("Restaurant", ids)
            }
          />
        );
      case "Banquet":
        return (
          <TableWithActions
            title="Banquet Audit"
            data={banquetAuditData}
            selected={selectedRows.Banquet}
            onSelectedChange={(ids: any) =>
              handleSelectedChange("Banquet", ids)
            }
          />
        );
      default:
        return null;
    }
  };

  const handlePrintAll = () => {
    const allSelectedData = [
      ...roomAuditData.filter((d) => selectedRows.Room.includes(d.id)),
      ...serviceAuditData.filter((d) => selectedRows.Service.includes(d.id)),
      ...restaurantAuditData.filter((d) =>
        selectedRows.Restaurant.includes(d.id)
      ),
      ...banquetAuditData.filter((d) => selectedRows.Banquet.includes(d.id)),
    ];

    if (!allSelectedData.length) return;

    const newWindow = window.open("", "_blank");
    if (!newWindow) return;

    newWindow.document.write(`
      <html>
        <head>
          <title>Print Selected Records</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>Selected Records</h2>
          <table>
            <thead>
              <tr>
                <th>Room No</th>
                <th>Guest Name</th>
                <th>Service</th>
                <th>Room Tariff</th>
                <th>S. Charge</th>
                <th>VAT Amount</th>
                <th>Total</th>
                <th>Hotel Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${allSelectedData
                .map(
                  (d) => `
                <tr>
                  <td>${d.roomNo}</td>
                  <td>${d.guestName}</td>
                  <td>${d.service}</td>
                  <td>${d.roomTariff}</td>
                  <td>${d.sCharge}</td>
                  <td>${d.vatAmount}</td>
                  <td>${d.total}</td>
                  <td>${d.remarks}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 justify-center">
        {["Room", "Service", "Restaurant", "Banquet"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {tab} Audit
          </button>
        ))}
      </div>

      {/* Print All Button */}
      <div className="flex justify-end">
        <button
          onClick={handlePrintAll}
          disabled={
            !selectedRows.Room.length &&
            !selectedRows.Service.length &&
            !selectedRows.Restaurant.length &&
            !selectedRows.Banquet.length
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition"
        >
          Print All Selected
        </button>
      </div>

      {/* Active Table */}
      <div>{renderTable()}</div>
    </div>
  );
}
