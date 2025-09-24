import App from "@/App";
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
    ],
  },
]);
