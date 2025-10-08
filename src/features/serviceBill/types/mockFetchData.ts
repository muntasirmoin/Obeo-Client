export const mockFetchGuestByRoom = async (roomNumber: string) => {
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
