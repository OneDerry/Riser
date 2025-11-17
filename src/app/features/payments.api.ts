import { api } from "../api";
import type { EnrollmentData } from "../services/sheet_db.service";
const SHEETDB_API_URL =
  import.meta.env.VITE_SHEETDB_API_URL ||
  "https://sheetdb.io/api/v1/ll7yrru73p0vm";

interface SheetDBResponse {
  created: number;
}

export type SubmitEnrollmentPayload = EnrollmentData;

export const paymentsApi = api.injectEndpoints({
  endpoints: (build) => ({
    submitEnrollment: build.mutation<
      { success: boolean; message: string },
      SubmitEnrollmentPayload
    >({
      query: (payload) => ({
        url: SHEETDB_API_URL,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          data: [
            {
              ...payload,
              createdAt: payload.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              paymentStatus:
                payload.paymentStatus ||
                (payload.paymentMethod === "bank-transfer"
                  ? "pending"
                  : "pending"),
            },
          ],
        },
      }),
      transformResponse: (response: SheetDBResponse) => ({
        success: response.created >= 1,
        message: "Enrollment data saved successfully",
      }),
    }),
  }),
});

export const { useSubmitEnrollmentMutation } = paymentsApi;
