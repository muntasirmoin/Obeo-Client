/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
// import TitleSubtitle from "../Components/TitleSubtitle";
import type { ServiceItem } from "./ServiceBillTable";
import GuestServiceTable from "./ServiceBillTable";

type FormValues = {
  guestType: string;
  registrationNumber: string;
  fullName: string;
  guestEmail: string;
  roomNumber: string;
  serviceName: string;
  serviceRate: number;
  serviceQuantity: number;
  vat: number;
  sdCharge: number;
  additionalCharge: number;
  serviceCharge: number;
  complimentary: string;
  remarks: string;
  grandTotal: number;
};
const fieldLabels: Record<string, string> = {
  registrationNumber: "Registration Number",
  fullName: "Full Guest Name",
  guestEmail: "Guest Email",
};
// MOCK fetch function - replace with actual API
const mockFetchGuestByRoom = async (roomNumber: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const guests = [
    {
      guestType: "Regular",
      registrationNumber: "REG-002",
      fullName: "Jane Smith",
      guestEmail: "jane.smith@example.com",
      roomNumber: "101",
      serviceName: "Laundry Service",
      serviceRate: 15,
      quantity: 2,
      vat: 1.5,
      sdCharge: 0.5,
      additionalCharge: 0,
      serviceCharge: 0,
      complimentary: "No",
      remarks: "Wash & fold only",
      grandTotal: 32,
    },
    {
      guestType: "VIP",
      registrationNumber: "REG-001",
      fullName: "John Doe",
      guestEmail: "john.doe@example.com",
      roomNumber: "101",
      serviceName: "Room Cleaning",
      serviceRate: 20,
      quantity: 1,
      vat: 2,
      sdCharge: 1,
      additionalCharge: 0,
      serviceCharge: 0,
      complimentary: "No",
      remarks: "Requested early service",
      grandTotal: 23,
    },
  ];
  return guests.find((g) => g.roomNumber === roomNumber) || null;
};

export default function GuestServiceForm() {
  const { register, handleSubmit, control, setValue, getValues, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
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
        complimentary: "",
        remarks: "",
        grandTotal: 0,
      },
    });

  const [
    guestType,
    registrationNumber,
    fullName,
    guestEmail,
    roomNumber,
    serviceName,
    serviceRate,
    serviceQuantity,
  ] = useWatch({
    control,
    name: [
      "guestType",
      "registrationNumber",
      "fullName",
      "guestEmail",
      "roomNumber",
      "serviceName",
      "serviceRate",
      "serviceQuantity",
    ],
  });

  const [tableData, setTableData] = useState<ServiceItem[]>([]);
  const [idCounter, setIdCounter] = useState(1);

  const isAddDisabled =
    !guestType ||
    !registrationNumber ||
    !fullName ||
    !guestEmail ||
    !roomNumber ||
    !serviceName ||
    !serviceRate ||
    !serviceQuantity;

  // Charges checkboxes
  const [checkedCharges, setCheckedCharges] = useState({
    vat: false,
    sdCharge: false,
    additionalCharge: false,
    serviceCharge: false,
  });

  // Live grandTotal calculation
  useEffect(() => {
    const total =
      (Number(serviceRate) || 0) * (Number(serviceQuantity) || 1) +
      (checkedCharges.vat ? Number(getValues("vat") || 0) : 0) +
      (checkedCharges.sdCharge ? Number(getValues("sdCharge") || 0) : 0) +
      (checkedCharges.additionalCharge
        ? Number(getValues("additionalCharge") || 0)
        : 0) +
      (checkedCharges.serviceCharge
        ? Number(getValues("serviceCharge") || 0)
        : 0);

    setValue("grandTotal", total);
  }, [
    serviceRate,
    serviceQuantity,
    watch("vat"),
    watch("sdCharge"),
    watch("additionalCharge"),
    watch("serviceCharge"),
    checkedCharges,
    setValue,
    getValues,
  ]);

  const onSubmit = (data: FormValues) => {
    const newItem: ServiceItem = {
      id: idCounter,
      guestType: data.guestType,
      registrationNumber: data.registrationNumber,
      fullName: data.fullName,
      guestEmail: data.guestEmail,
      roomNumber: data.roomNumber,
      serviceName: data.serviceName,
      serviceRate: data.serviceRate,
      quantity: data.serviceQuantity,
      totalAmount: data.grandTotal,
      complimentary: data.complimentary,
      remarks: data.remarks,
      vat: data.vat,
      sdCharge: data.sdCharge,
      additionalCharge: data.additionalCharge,
      serviceCharge: data.serviceCharge,
    };

    setTableData((prev) => [...prev, newItem]);
    setIdCounter((prev) => prev + 1);
    toast.success("Service added successfully!");

    reset({
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
      complimentary: "",
      remarks: "",
      grandTotal: 0,
    });

    setCheckedCharges({
      vat: false,
      sdCharge: false,
      additionalCharge: false,
      serviceCharge: false,
    });
  };

  const handleCancelService = () => {
    toast.error("Canceled!");
    reset();
    setCheckedCharges({
      vat: false,
      sdCharge: false,
      additionalCharge: false,
      serviceCharge: false,
    });
  };

  const renderChargeWithCheckbox = (
    label: string,
    fieldName: keyof FormValues
  ) => {
    const checked = checkedCharges[fieldName as keyof typeof checkedCharges];
    return (
      <Controller
        key={fieldName}
        control={control}
        name={fieldName}
        render={({ field }) => (
          <div className="flex flex-col">
            <label className="mb-0.5 ml-0.5 text-left text-xs font-medium text-gray-600">
              {label}
            </label>
            <div className="flex items-center p-1 bg-gray-50 border border-gray-300 rounded-md shadow-sm">
              {/* <Input
                type="number"
                {...field}
                value={field.value ?? 0}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  field.onChange(val);
                  if (
                    val > 0 &&
                    !checkedCharges[fieldName as keyof typeof checkedCharges]
                  ) {
                    setCheckedCharges((prev) => ({
                      ...prev,
                      [fieldName]: true,
                    }));
                  } else if (
                    val === 0 &&
                    checkedCharges[fieldName as keyof typeof checkedCharges]
                  ) {
                    setCheckedCharges((prev) => ({
                      ...prev,
                      [fieldName]: false,
                    }));
                  }
                }}
                className="flex-1 h-8 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 mr-1"
              /> */}
              <Input
                type="number"
                {...field}
                value={field.value ?? ""} // allow empty input
                onChange={(e) => {
                  const valStr = e.target.value;
                  const valNum = valStr === "" ? "" : Number(valStr); // keep empty or convert

                  field.onChange(valNum);

                  // Update checkedCharges only if numeric
                  if (
                    valNum !== "" &&
                    valNum > 0 &&
                    !checkedCharges[fieldName as keyof typeof checkedCharges]
                  ) {
                    setCheckedCharges((prev) => ({
                      ...prev,
                      [fieldName]: true,
                    }));
                  } else if (
                    valNum === 0 &&
                    checkedCharges[fieldName as keyof typeof checkedCharges]
                  ) {
                    setCheckedCharges((prev) => ({
                      ...prev,
                      [fieldName]: false,
                    }));
                  }
                }}
                className="flex-1 h-8 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 mr-1"
              />

              <Checkbox
                checked={checked}
                onCheckedChange={(val) =>
                  setCheckedCharges((prev) => ({ ...prev, [fieldName]: val }))
                }
                className="h-4 w-4 text-blue-600"
              />
            </div>
          </div>
        )}
      />
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-7xl mx-auto p-2 space-y-0"
    >
      {/* <TitleSubtitle
        title="Service Bill"
        // subtitle="Add services and charges for your guests"
      /> */}

      <div className="bg-black p-2 rounded-xl">
        <h1 className="font-extrabold text-left ml-3 text-white">
          Service Bill
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-5 space-y-0 border border-gray-200">
        {/* Guest & Service Info */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          {/* Guest Type */}
          <Controller
            control={control}
            name="guestType"
            render={({ field }) => (
              <div className="flex flex-col space-y-0">
                <label className="text-left ml-0.5 mb-0.5 text-xs font-medium text-gray-600">
                  Guest Types <span className="text-red-500">*</span>
                </label>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm">
                    <SelectValue placeholder="Select Guest Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md shadow text-sm">
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {["registrationNumber", "fullName", "guestEmail"].map((field) => (
            <div key={field} className="flex flex-col space-y-0">
              <label className="text-left ml-0.5 mb-0.5 text-xs font-medium text-gray-600">
                {fieldLabels[field] || field}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type={field === "guestEmail" ? "email" : "text"}
                {...register(field as keyof FormValues, { required: true })}
                className="h-9 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder={`Enter ${
                  field === "fullName" ? "Full Guest Name" : field
                }`}
              />
            </div>
          ))}

          {/* Room Number */}
          <div className="flex flex-col space-y-0">
            <label className="text-left ml-0.5 mb-0.5 text-xs font-medium text-gray-600">
              Room Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              {...register("roomNumber", { required: true })}
              placeholder="Enter room number"
              className="h-9 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Search Button */}
          <div className="flex flex-col justify-end">
            <Button
              type="button"
              className="h-10 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm shadow-sm"
              onClick={async () => {
                const roomNum = getValues("roomNumber");
                if (!roomNum) return;
                const guestData = await mockFetchGuestByRoom(roomNum);
                if (!guestData) {
                  toast.error("No guest found for this room!");
                  return;
                }

                const totalServiceAmount =
                  (Number(guestData.serviceRate) || 0) *
                    (Number(guestData.quantity) || 1) +
                  (Number(guestData.vat) || 0) +
                  (Number(guestData.sdCharge) || 0) +
                  (Number(guestData.additionalCharge) || 0) +
                  (Number(guestData.serviceCharge) || 0);

                setTableData((prev) => [
                  ...prev,
                  {
                    id: idCounter,
                    guestType: guestData.guestType ?? "",
                    registrationNumber: guestData.registrationNumber ?? "",
                    fullName: guestData.fullName ?? "",
                    guestEmail: guestData.guestEmail ?? "",
                    roomNumber: guestData.roomNumber ?? "",
                    serviceName: guestData.serviceName ?? "",
                    serviceRate: Number(guestData.serviceRate) || 0,
                    quantity: Number(guestData.quantity) || 1,
                    totalAmount: totalServiceAmount,
                    complimentary: guestData.complimentary ?? "",
                    remarks: guestData.remarks ?? "",
                    vat: Number(guestData.vat) || 0,
                    sdCharge: Number(guestData.sdCharge) || 0,
                    additionalCharge: Number(guestData.additionalCharge) || 0,
                    serviceCharge: Number(guestData.serviceCharge) || 0,
                  },
                ]);
                setIdCounter((prev) => prev + 1);
                setValue("grandTotal", totalServiceAmount);

                toast.success("Guest service added from room search!");
              }}
            >
              Search
            </Button>
          </div>

          {/* Service Name */}
          <Controller
            control={control}
            name="serviceName"
            render={({ field }) => (
              <div className="flex flex-col space-y-0">
                <label className="text-left ml-0.5 mb-0.5 text-xs font-medium text-gray-600">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md shadow text-sm">
                    <SelectItem value="Room Cleaning">Room Cleaning</SelectItem>
                    <SelectItem value="Laundry Service">
                      Laundry Service
                    </SelectItem>
                    <SelectItem value="Food Delivery">Food Delivery</SelectItem>
                    <SelectItem value="Spa Treatment">Spa Treatment</SelectItem>
                    <SelectItem value="Airport Pickup">
                      Airport Pickup
                    </SelectItem>
                    <SelectItem value="Minibar">Minibar</SelectItem>
                    <SelectItem value="Extra Bed">Extra Bed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {/* Complimentary */}
          <Controller
            control={control}
            name="complimentary"
            render={({ field }) => (
              <div className="flex flex-col space-y-0">
                <label className="text-left ml-0.5 mb-0.5 text-xs font-medium text-gray-600">
                  Complimentary Item
                </label>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm">
                    <SelectValue placeholder="Select Complimentary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {/* Remarks */}
          <div className="flex flex-col space-y-0 md:col-span-2">
            <label className="text-left ml-0.5 mb-0.5 text-xs font-medium text-gray-600">
              Remarks
            </label>
            <Input
              type="text"
              {...register("remarks")}
              className="h-9 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
              placeholder="Enter remarks"
            />
          </div>

          {/* Service Rate */}
          <Controller
            control={control}
            name="serviceRate"
            render={({ field }) => (
              <div className="flex flex-col space-y-0">
                <label className="text-xs text-left mb-0.5 ml-0.5 font-medium text-gray-600">
                  Service Rate <span className="text-red-500">*</span>
                </label>
                {/* <Input
                  type="number"
                  {...field}
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  className="h-9 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                /> */}
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ""} // allow empty string
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? "" : Number(val)); // keep empty string if erased
                  }}
                  className="h-9 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            )}
          />

          {/* Service Quantity */}
          <Controller
            control={control}
            name="serviceQuantity"
            render={({ field }) => (
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-left mb-0.5 ml-0.5 font-medium text-gray-600">
                  Service Quantity <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  value={field.value ?? 1}
                  onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                />
              </div>
            )}
          />
        </div>

        {/* Charges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2 mb-2">
          {renderChargeWithCheckbox("VAT", "vat")}
          {renderChargeWithCheckbox("SD Charge", "sdCharge")}
          {renderChargeWithCheckbox("Additional Charge", "additionalCharge")}
          {renderChargeWithCheckbox("Service Charge", "serviceCharge")}
        </div>

        {/* Total & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col space-y-0">
            <label className="text-xs mb-0.5 ml-0.5 text-left font-medium text-gray-600">
              Total Amount
            </label>
            <Input
              type="number"
              {...register("grandTotal")}
              readOnly
              className="bg-gray-50 h-9 w-full border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium opacity-0">Add</label>
            <Button
              type="submit"
              disabled={isAddDisabled}
              className={`h-9 text-sm w-full rounded-md shadow-sm ${
                isAddDisabled
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 cursor-pointer"
              }`}
            >
              Add
            </Button>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium opacity-0">Cancel</label>
            <Button
              type="button"
              className="h-9 text-sm w-full rounded-md shadow-sm bg-red-500 hover:bg-red-600"
              onClick={handleCancelService}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Guest Service Table */}
      <div className="mt-4">
        <GuestServiceTable tableData={tableData} setTableData={setTableData} />
      </div>
    </form>
  );
}
