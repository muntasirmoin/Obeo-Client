import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  guestServiceSchema,
  type ChargeField,
  type FormValues,
} from "../validations/guestServiceSchema";
import type { ServiceItem } from "../types/guestServiceType";
import { mockFetchGuestByRoom } from "../types/mockFetchData";
import GuestServiceTable from "./ServiceBillTable";

const fieldLabels: Record<string, string> = {
  registrationNumber: "Registration Number",
  fullName: "Full Guest Name",
  guestEmail: "Guest Email",
};
const fields = Object.keys(fieldLabels);

// ----------------- GuestServiceForm -----------------
export default function GuestServiceForm() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(guestServiceSchema),
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

  const [tableData, setTableData] = useState<ServiceItem[]>([]);
  const [idCounter, setIdCounter] = useState(1);

  const [checkedCharges, setCheckedCharges] = useState<
    Record<ChargeField, boolean>
  >({
    vat: false,
    sdCharge: false,
    additionalCharge: false,
    serviceCharge: false,
  });

  const watchedFields = useWatch({
    control,
    name: [
      "serviceRate",
      "serviceQuantity",
      "vat",
      "sdCharge",
      "additionalCharge",
      "serviceCharge",
    ],
  });

  // Live Grand Total
  useEffect(() => {
    const total =
      (Number(getValues("serviceRate")) || 0) *
        (Number(getValues("serviceQuantity")) || 1) +
      (checkedCharges.vat ? Number(getValues("vat") || 0) : 0) +
      (checkedCharges.sdCharge ? Number(getValues("sdCharge") || 0) : 0) +
      (checkedCharges.additionalCharge
        ? Number(getValues("additionalCharge") || 0)
        : 0) +
      (checkedCharges.serviceCharge
        ? Number(getValues("serviceCharge") || 0)
        : 0);
    setValue("grandTotal", total);
  }, [watchedFields, checkedCharges, getValues, setValue]);

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
      complimentary: data.complimentary || "",
      remarks: data.remarks || "",
      vat: data.vat || 0,
      sdCharge: data.sdCharge || 0,
      additionalCharge: data.additionalCharge || 0,
      serviceCharge: data.serviceCharge || 0,
    };

    // ----- set Table Data during add service ----------
    setTableData((prev) => [...prev, newItem]);
    setIdCounter((prev) => prev + 1);
    toast.success("Service added successfully!");
    // ------- reset from ------------
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

  // ----------------- Render Charges -----------------
  const renderChargeWithCheckbox = (label: string, fieldName: ChargeField) => {
    const checked = checkedCharges[fieldName];
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
              <Input
                type="text" // take input as string
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const stringValue = e.target.value; // get string first

                  // allow empty string while typing
                  if (stringValue === "") {
                    field.onChange("");
                    setCheckedCharges((prev) => ({
                      ...prev,
                      [fieldName]: false,
                    }));
                    return;
                  }

                  // convert to number and prevent negative numbers
                  const numValue = Math.max(Number(stringValue), 0);
                  field.onChange(numValue);

                  setCheckedCharges((prev) => ({
                    ...prev,
                    [fieldName]: numValue > 0,
                  }));
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
            {errors[fieldName] && (
              <span className="text-red-500 text-xs mt-0.5">
                {errors[fieldName]?.message?.toString() ===
                "Invalid input: expected number, received string"
                  ? "Expected number"
                  : errors[fieldName]?.message?.toString()}
              </span>
            )}
          </div>
        )}
      />
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto p-2 space-y-0"
    >
      <div className="bg-black p-2">
        <h1 className="font-extrabold text-left ml-3 text-white">
          Service Bill
        </h1>
      </div>

      <div className="bg-white shadow-md  p-5 space-y-0 border border-gray-200">
        {/* Guest & Service Info */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          {/* Guest Type */}
          <Controller
            control={control}
            name="guestType"
            rules={{ required: "Guest Type is required" }} // <-- add validation
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
                {errors.guestType && (
                  <span className="text-red-500 text-xs mt-0.5">
                    {errors.guestType.message}
                  </span>
                )}
              </div>
            )}
          />
          {/* ---------------------"registrationNumber", "fullName", "guestEmail"--------------- */}
          {fields.map((field) => (
            <div key={field} className="flex flex-col space-y-0">
              <label className="text-left ml-0.5 mb-0.5 text-xs font-medium text-gray-600">
                {fieldLabels[field] || field}
                <span className="text-red-500">*</span>
              </label>
              <Input
                type={field === "guestEmail" ? "email" : "text"}
                {...register(field as keyof FormValues)}
                className="h-9 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder={`Enter ${
                  field === "fullName" ? "Full Guest Name" : field
                }`}
              />
              {errors[field as keyof FormValues] && (
                <span className="text-red-500 text-xs mt-0.5">
                  {errors[field as keyof FormValues]?.message?.toString()}
                </span>
              )}
            </div>
          ))}

          {/* Room Number */}
          <div className="flex flex-col space-y-0">
            <label className="text-left ml-0.5 mb-0.5 text-xs font-medium text-gray-600">
              Room Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              {...register("roomNumber")}
              placeholder="Enter room number"
              className="h-9 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
            />
            {errors.roomNumber && (
              <span className="text-red-500 text-xs mt-0.5">
                {errors.roomNumber.message}
              </span>
            )}
          </div>

          {/* Search Button */}
          <div className="flex flex-col justify-end space-y-0">
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
                    guestType: guestData.guestType,
                    registrationNumber: guestData.registrationNumber,
                    fullName: guestData.fullName,
                    guestEmail: guestData.guestEmail,
                    roomNumber: guestData.roomNumber,
                    serviceName: guestData.serviceName,
                    serviceRate: guestData.serviceRate,
                    quantity: guestData.quantity,
                    totalAmount: totalServiceAmount,
                    complimentary: guestData.complimentary,
                    remarks: guestData.remarks ?? "",
                    vat: guestData.vat,
                    sdCharge: guestData.sdCharge,
                    additionalCharge: guestData.additionalCharge,
                    serviceCharge: guestData.serviceCharge,
                  },
                ]);
                setIdCounter((prev) => prev + 1);
                setValue("grandTotal", totalServiceAmount);

                toast.success("Guest service added from room search!");
              }}
            >
              Search
            </Button>
            {(errors.roomNumber ||
              errors.guestType ||
              errors.registrationNumber ||
              errors.fullName ||
              errors.guestEmail) && <div className="h-4" />}
          </div>

          {/* Service Name */}
          <Controller
            control={control}
            name="serviceName"
            rules={{ required: "Service Name is required" }} // <-- add this
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
                {errors.serviceName && (
                  <span className="text-red-500 text-xs mt-0.5">
                    {errors.serviceName.message}
                  </span>
                )}
              </div>
            )}
          />

          {/* Complimentary */}
          <Controller
            control={control}
            name="complimentary"
            rules={{ required: "Please select  complimentary" }} // <-- validation rule
            render={({ field }) => (
              <div className="flex flex-col space-y-0">
                <label className="text-left ml-0.5 mb-0.5 text-xs font-medium text-gray-600">
                  Complimentary Item <span className="text-red-500">*</span>
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
                {errors.complimentary && (
                  <span className="text-red-500 text-xs mt-0.5">
                    {errors.complimentary.message}
                  </span>
                )}
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
              placeholder="Enter remarks"
              className="h-9 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Service Rate */}
          <Controller
            control={control}
            name="serviceRate"
            render={({ field }) => (
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-left mb-0.5 ml-0.5 font-medium text-gray-600">
                  Service Rate <span className="text-red-500">*</span>
                </label>
                {/* <Input
                  type="number"
                  {...field}
                  min={0}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? "" : Number(val));
                  }}
                  className="h-9 w-full"
                /> */}
                <Input
                  type="text" // take input as string
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const stringValue = e.target.value; // get string
                    const numberValue =
                      stringValue === "" ? "" : Number(stringValue); // convert to number
                    field.onChange(numberValue);
                  }}
                  className="h-9 w-full"
                />

                {errors.serviceRate && (
                  <span className="text-red-500 text-xs">
                    {errors.serviceRate.message ===
                    "Invalid input: expected number, received string"
                      ? "Expected number"
                      : errors.serviceRate.message}
                  </span>
                )}
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
                  type="text" // take input as string
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const stringValue = e.target.value; // get string
                    if (stringValue === "") {
                      // Allow empty string for erasing
                      field.onChange("");
                    } else {
                      const numValue = Number(stringValue);
                      // Only accept >= 1
                      field.onChange(numValue < 1 ? 1 : numValue);
                    }
                  }}
                  // onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()} // prevent scroll
                />

                {errors.serviceQuantity && (
                  <span className="text-red-500 text-xs">
                    {errors.serviceQuantity.message ===
                    "Invalid input: expected number, received string"
                      ? "Expected number"
                      : errors.serviceQuantity.message}
                  </span>
                )}
              </div>
            )}
          />
        </div>

        {/* Charges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          {(
            [
              "vat",
              "sdCharge",
              "additionalCharge",
              "serviceCharge",
            ] as ChargeField[]
          ).map((c) => renderChargeWithCheckbox(c.toUpperCase(), c))}
        </div>

        {/* Grand Total */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mt-1">
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
          {/* Buttons */}
          <div className="mt-3 flex space-x-2">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Add Service
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleCancelService}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-5">
        <GuestServiceTable tableData={tableData} setTableData={setTableData} />
      </div>
    </form>
  );
}
