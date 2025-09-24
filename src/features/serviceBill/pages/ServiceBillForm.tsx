// components/GuestServiceForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ServiceItem } from "./ServiceBillTable";
import GuestServiceTable from "./ServiceBillTable";
import { toast } from "sonner";
import TitleSubtitle from "../Components/TitleSubtitle";

export default function GuestServiceForm() {
  const [form, setForm] = useState({
    guestType: "",
    registrationNumber: "",
    fullName: "",
    guestEmail: "",
    roomNumber: "",
    serviceName: "",
    serviceRate: 0,
    serviceQuantity: 1,
    vat: 0,
    sdCharge: 0,
    additionalCharge: 0,
    serviceCharge: 0,
    totalServiceAmount: 0,
    complimentary: "No",
    remarks: "",
    grandTotal: 0,
  });

  const [tableData, setTableData] = useState<ServiceItem[]>([]);
  const [idCounter, setIdCounter] = useState(1);

  const [vatSelected, setVatSelected] = useState(false);
  const [serviceRateSelected, setServiceRateSelected] = useState(false);
  const [sdSelected, setSdSelected] = useState(false);
  const [additionalSelected, setAdditionalSelected] = useState(false);
  const [serviceSelected, setServiceSelected] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const computeTotalServiceAmount = () => {
    const total =
      form.serviceRate * form.serviceQuantity +
      form.vat +
      form.sdCharge +
      form.additionalCharge +
      form.serviceCharge;
    setForm((prev) => ({ ...prev, totalServiceAmount: total }));
  };

  const handleAddService = () => {
    setServiceSelected(false);
    setAdditionalSelected(false);
    setSdSelected(false);
    setServiceRateSelected(false);
    setVatSelected(false);
    setForm({
      ...form,
      guestType: "",
      registrationNumber: "",
      fullName: "",
      guestEmail: "",
      roomNumber: "",
      serviceName: "",
      serviceRate: 0,
      serviceQuantity: 1,
      vat: 0,
      sdCharge: 0,
      additionalCharge: 0,
      serviceCharge: 0,
      totalServiceAmount: 0,
      complimentary: "No",
      remarks: "",
      grandTotal: 0,
    });
    computeTotalServiceAmount();
    const newItem: ServiceItem = {
      id: idCounter,
      serviceName: form.serviceName,
      roomNumber: form.roomNumber,
      serviceRate: form.serviceRate,
      quantity: form.serviceQuantity,
      totalAmount: form.totalServiceAmount,
    };
    setTableData((prev) => [...prev, newItem]);
    setIdCounter((prev) => prev + 1);
    toast.success("Service added successfully!");
  };

  const handleCancelService = () => {
    setServiceSelected(false);
    setAdditionalSelected(false);
    setSdSelected(false);
    setServiceRateSelected(false);
    setVatSelected(false);
    setForm({
      ...form,
      guestType: "",
      registrationNumber: "",
      fullName: "",
      guestEmail: "",
      roomNumber: "",
      serviceName: "",
      serviceRate: 0,
      serviceQuantity: 1,
      vat: 0,
      sdCharge: 0,
      additionalCharge: 0,
      serviceCharge: 0,
      totalServiceAmount: 0,
      complimentary: "No",
      remarks: "",
      grandTotal: 0,
    });
    computeTotalServiceAmount();
    const newItem: ServiceItem = {
      id: idCounter,
      serviceName: form.serviceName,
      roomNumber: form.roomNumber,
      serviceRate: form.serviceRate,
      quantity: form.serviceQuantity,
      totalAmount: form.totalServiceAmount,
    };
    setTableData((prev) => [...prev, newItem]);
    setIdCounter((prev) => prev + 1);
    toast.error("Canceled!");
  };

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setForm((prev) => ({
      ...prev,
      grandTotal: prev.grandTotal + prev.totalServiceAmount,
    }));
    toast.success("Added to Grand Total!");
  };

  const handleGrandTotalChange = (value: number, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      grandTotal: checked ? prev.grandTotal + value : prev.grandTotal - value,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Title */}
      <TitleSubtitle
        title="Guest Service Form"
        subtitle="Add services and charges for your guests"
      />

      {/* Guest Info Section */}
      <div className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-6 gap-4">
        {[
          {
            label: "Guest Type",
            name: "guestType",
            type: "select",
            options: ["VIP", "Regular", "Walk-in"],
          },
          {
            label: "Registration Number",
            name: "registrationNumber",
            type: "text",
          },
          { label: "Full Name", name: "fullName", type: "text" },
          { label: "Guest Email", name: "guestEmail", type: "email" },
          { label: "Room", name: "roomNumber", type: "text" },
          { label: "Service Name", name: "serviceName", type: "text" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="mb-1 font-medium text-left">{field.label}</label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={
                  field.type === "number" ? handleNumberChange : handleChange
                }
                placeholder={`Enter ${field.label}`}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
              />
            )}
          </div>
        ))}
      </div>

      {/* Charges Section */}
      <div className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        {[
          {
            label: "Service Rate",
            name: "serviceRate",
            value: form.serviceRate,
            selected: serviceRateSelected,
            setSelected: setServiceRateSelected,
          },
          {
            label: "VAT",
            name: "vat",
            value: form.vat,
            selected: vatSelected,
            setSelected: setVatSelected,
          },
          {
            label: "SD Charge",
            name: "sdCharge",
            value: form.sdCharge,
            selected: sdSelected,
            setSelected: setSdSelected,
          },
          {
            label: "Additional Charge",
            name: "additionalCharge",
            value: form.additionalCharge,
            selected: additionalSelected,
            setSelected: setAdditionalSelected,
          },
          {
            label: "Service Charge",
            name: "serviceCharge",
            value: form.serviceCharge,
            selected: serviceSelected,
            setSelected: setServiceSelected,
          },
        ].map(({ label, name, value, selected, setSelected }) => (
          <div key={name} className="flex items-center space-x-2">
            <div className="flex-1 flex flex-col">
              <label className="text-left mb-1 font-medium">{label}</label>
              <input
                type="number"
                name={name}
                value={value}
                onChange={handleNumberChange}
                placeholder={`Enter ${label}`}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => {
                setSelected(e.target.checked);
                handleGrandTotalChange(Number(value), e.target.checked);
              }}
              className="w-6 h-6 mt-6"
            />
          </div>
        ))}
      </div>

      {/* Total & Remarks Section */}
      <div
        className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        onContextMenu={handleRightClick}
      >
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Total Service Amount</label>
          <input
            type="number"
            value={form.grandTotal}
            readOnly
            className="border p-2 rounded bg-gray-50"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Complimentary</label>
          <select
            name="complimentary"
            value={form.complimentary}
            onChange={handleChange}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Remarks</label>
          <input
            type="text"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          className="bg-green-500 hover:bg-green-600 text-white rounded shadow-md"
          onClick={handleAddService}
        >
          Add
        </Button>
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded shadow-md"
          onClick={handleCancelService}
        >
          Cancel
        </Button>
      </div>

      {/* Service Table */}
      <GuestServiceTable tableData={tableData} setTableData={setTableData} />
    </div>
  );
}
