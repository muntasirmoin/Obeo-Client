import BillPaymentDetailsTable from "../Components/GuestBillPayment/BillPaymentDetailsTable";
import GuestBillPaymentForm from "../Components/GuestBillPayment/GuestBillPaymentForm";

const GuestBillPaymentPage = () => {
  return (
    <div className="p-6  mx-auto space-y-6">
      <GuestBillPaymentForm />
      <BillPaymentDetailsTable />
    </div>
  );
};

export default GuestBillPaymentPage;
