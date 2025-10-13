import App from "@/App";
import GuestBillPaymentPage from "@/Features/guestBillPayment/pages/guestBillPayment";
import NightAudit from "@/Features/nightAudit/pages/NightAudit";
import serviceBillPage from "@/Features/serviceBill/pages/serviceBillPage";

import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: serviceBillPage,
        index: true,
      },
      {
        Component: NightAudit,
        path: "night-audit",
      },
      {
        Component: GuestBillPaymentPage,
        path: "guest-bill-payment",
      },
    ],
  },
]);
