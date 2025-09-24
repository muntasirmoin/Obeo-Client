import App from "@/App";
import NightAudit from "@/features/nightAudit/pages/NightAudit";
import serviceBillPage from "@/features/serviceBill/pages/serviceBillPage";
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
    ],
  },
]);
