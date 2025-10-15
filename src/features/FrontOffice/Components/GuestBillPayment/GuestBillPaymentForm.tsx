import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
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

type FormValues = {
  roomNo: string;
  registrationNo: string;
  paymentType: string;
  paymentMode: string;
  currencyType: string;
  paymentAmount: string;
  remarks: string;
};

const roomOptions = ["Room 101", "Room 102", "Room 103"];
const paymentTypeOptions = ["Service", "Deposit", "Other"];
const paymentModeOptions = ["Cash", "Card", "Online"];
const currencyOptions = ["USD", "BDT", "EUR"];

export default function GuestBillPaymentForm() {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      roomNo: "",
      registrationNo: "",
      paymentType: "",
      paymentMode: "",
      currencyType: "",
      paymentAmount: "",
      remarks: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const paymentAmountNumber = Number(data.paymentAmount);
    toast.success(
      `💳 Payment of ${paymentAmountNumber} submitted successfully!`
    );
    handleClear();
  };

  // Reset helper for all fields
  const handleClear = () => {
    reset({
      roomNo: "",
      registrationNo: "",
      paymentType: "",
      paymentMode: "",
      currencyType: "",
      paymentAmount: "",
      remarks: "",
    });

    // Explicitly clear controlled selects’ values
    setValue("roomNo", "");
    setValue("paymentType", "");
    setValue("paymentMode", "");
    setValue("currencyType", "");
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-8 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-3xl text-left font-semibold tracking-tight mb-6 border-b pb-2">
        Search Information
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room No */}
          <div className="flex flex-col">
            <Label
              htmlFor="roomNo"
              className="mb-1 ml-1 font-medium text-gray-700"
            >
              Room No
            </Label>
            <Controller
              control={control}
              name="roomNo"
              rules={{ required: "Room No is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    clearErrors("roomNo");
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition">
                    <SelectValue placeholder="-- Please Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomOptions.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.roomNo && (
              <p className="text-red-500 text-xs mt-1 ml-1 text-left ">
                {errors.roomNo.message}
              </p>
            )}
          </div>

          {/* Registration Number */}
          <div className="flex flex-col">
            <Label
              htmlFor="registrationNo"
              className="mb-1 font-medium text-gray-700 ml-1 "
            >
              Registration Number
            </Label>
            <Input
              id="registrationNo"
              placeholder="Enter Registration Number"
              className="h-8 w-full rounded-lg border-gray-300  "
              {...register("registrationNo", {
                required: "Registration Number is required",
                onChange: () => clearErrors("registrationNo"),
              })}
            />
            {errors.registrationNo && (
              <p className="text-red-500 text-xs mt-1 text-left ml-1">
                {errors.registrationNo.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Payment Type */}
          <div className="flex flex-col">
            <Label
              htmlFor="paymentType"
              className="mb-1 font-medium text-gray-700 ml-1 "
            >
              Payment Type
            </Label>
            <Controller
              control={control}
              name="paymentType"
              rules={{ required: "Payment Type is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    clearErrors("paymentType");
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition">
                    <SelectValue placeholder="-- Please Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paymentType && (
              <p className="text-red-500 text-xs mt-1 text-left ml-1">
                {errors.paymentType.message}
              </p>
            )}
          </div>

          {/* Payment Mode */}
          <div className="flex flex-col">
            <Label
              htmlFor="paymentMode"
              className="mb-1 font-medium text-gray-700 ml-1 "
            >
              Payment Mode
            </Label>
            <Controller
              control={control}
              name="paymentMode"
              rules={{ required: "Payment Mode is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    clearErrors("paymentMode");
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition">
                    <SelectValue placeholder="-- Please Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentModeOptions.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paymentMode && (
              <p className="text-red-500 text-xs mt-1 text-left ml-1">
                {errors.paymentMode.message}
              </p>
            )}
          </div>

          {/* Currency Type */}
          <div className="flex flex-col">
            <Label
              htmlFor="currencyType"
              className="mb-1 font-medium text-gray-700 ml-1 "
            >
              Currency Type
            </Label>
            <Controller
              control={control}
              name="currencyType"
              rules={{ required: "Currency Type is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    clearErrors("currencyType");
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition">
                    <SelectValue placeholder="-- Please Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((cur) => (
                      <SelectItem key={cur} value={cur}>
                        {cur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.currencyType && (
              <p className="text-red-500 text-xs mt-1 text-left ml-1">
                {errors.currencyType.message}
              </p>
            )}
          </div>

          {/* Payment Amount */}
          <div className="flex flex-col">
            <Label
              htmlFor="paymentAmount"
              className="mb-1 font-medium text-gray-700 ml-1 "
            >
              Payment Amount
            </Label>
            <Input
              id="paymentAmount"
              placeholder="Enter Amount"
              className="h-8 w-full  border-gray-300  "
              {...register("paymentAmount", {
                required: "Payment Amount is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Enter a valid number",
                },
                onChange: () => clearErrors("paymentAmount"),
              })}
            />
            {errors.paymentAmount && (
              <p className="text-red-500 text-xs mt-1 text-left ml-1">
                {errors.paymentAmount.message}
              </p>
            )}
          </div>
        </div>

        {/* Remarks */}
        <div className="flex flex-col">
          <Label
            htmlFor="remarks"
            className="mb-1 font-medium text-gray-700 ml-1 "
          >
            Remarks
          </Label>
          <Input
            id="remarks"
            placeholder="Enter remarks (optional)"
            className="h-10 w-full  border-gray-300  "
            {...register("remarks", {
              onChange: () => clearErrors("remarks"),
            })}
          />
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-end mt-2">
          <div className="flex gap-3">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-2 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Pay
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-2 rounded-lg shadow-md hover:shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
            >
              Clear
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
