import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Toaster } from "sonner";

import "./index.css";
import ErrorBoundary from "./shared/components/error_boundary";
import appRouter from "../src/config/routes";
import { store } from "./app/store";
const routes = createBrowserRouter(appRouter());
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <RouterProvider router={routes} />
        <Toaster position="top-right" richColors closeButton />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);
