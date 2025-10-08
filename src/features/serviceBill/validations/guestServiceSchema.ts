import z from "zod";

export const guestServiceSchema = z.object({
  guestType: z.string().nonempty({ message: "Guest type is required" }),
  registrationNumber: z
    .string()
    .nonempty({ message: "Registration number is required" }),
  fullName: z.string().nonempty({ message: "Full name is required" }),
  guestEmail: z.string().email({ message: "Invalid email" }),
  roomNumber: z.string().nonempty({ message: "Room number is required" }),
  serviceName: z.string().nonempty({ message: "Service name is required" }),
  serviceRate: z
    .number()
    .min(0, { message: "Service rate cannot be negative" }),

  serviceQuantity: z
    .number()
    .min(1, { message: "Quantity must be at least 1" }),
  vat: z.number().min(0, { message: "VAT cannot be negative" }).optional(),
  sdCharge: z
    .number()
    .min(0, { message: "SD Charge cannot be negative" })
    .optional(),
  additionalCharge: z
    .number()
    .min(0, { message: "Additional Charge cannot be negative" })
    .optional(),
  serviceCharge: z
    .number()
    .min(0, { message: "Service Charge cannot be negative" })
    .optional(),
  complimentary: z.string().nonempty({ message: "Complimentary is required" }),
  remarks: z.string().optional(),
  grandTotal: z.number(),
});

export type FormValues = z.infer<typeof guestServiceSchema>;

export type ChargeField =
  | "vat"
  | "sdCharge"
  | "additionalCharge"
  | "serviceCharge";
