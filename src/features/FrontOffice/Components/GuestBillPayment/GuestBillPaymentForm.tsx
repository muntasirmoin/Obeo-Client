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
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    const paymentAmountNumber = Number(data.paymentAmount);

    // Show success toast
    toast.success(`Payment of ${paymentAmountNumber} submitted successfully!`);

    console.log({ ...data, paymentAmount: paymentAmountNumber });
    reset(); // Reset form after submission
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold mb-4">Search Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label htmlFor="roomNo">Room No:</Label>
            <Controller
              control={control}
              name="roomNo"
              rules={{ required: "Room is required" }}
              render={({ field }) => (
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select" />
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
              <p className="text-red-500 text-xs mt-1">
                {errors.roomNo.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="registrationNo">Registration Number:</Label>
            <Input
              id="registrationNo"
              placeholder="Enter Registration Number"
              {...register("registrationNo", {
                required: "Registration Number is required",
              })}
            />
            {errors.registrationNo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.registrationNo.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <Label htmlFor="paymentType">Payment Type:</Label>
            <Controller
              control={control}
              name="paymentType"
              rules={{ required: "Payment Type is required" }}
              render={({ field }) => (
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select" />
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
              <p className="text-red-500 text-xs mt-1">
                {errors.paymentType.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="paymentMode">Payment Mode:</Label>
            <Controller
              control={control}
              name="paymentMode"
              rules={{ required: "Payment Mode is required" }}
              render={({ field }) => (
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select" />
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
              <p className="text-red-500 text-xs mt-1">
                {errors.paymentMode.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="currencyType">Currency Type:</Label>
            <Controller
              control={control}
              name="currencyType"
              rules={{ required: "Currency Type is required" }}
              render={({ field }) => (
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select" />
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
              <p className="text-red-500 text-xs mt-1">
                {errors.currencyType.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2 gap-4 items-end">
          <div className="flex flex-col">
            <Label htmlFor="paymentAmount">Payment Amount:</Label>
            <Input
              id="paymentAmount"
              placeholder="Enter Amount"
              {...register("paymentAmount", {
                required: "Payment Amount is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Enter a valid number",
                },
              })}
            />
            {errors.paymentAmount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.paymentAmount.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              Pay
            </Button>
            <Button
              type="button"
              className="bg-yellow-400 hover:bg-yellow-500"
              onClick={() => reset()}
            >
              Clear
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
