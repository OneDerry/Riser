// SheetDB Service
// This service handles saving data to SheetDB

const SHEETDB_API_URL =
  import.meta.env.VITE_SHEETDB_API_URL ||
  "https://sheetdb.io/api/v1/ll7yrru73p0vm";

export interface EnrollmentData {
  // Parent Information
  parentPrefix: string;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  relationship_to_child: string;
  address: string;

  // Location Information
  State: string;
  Lga: string;

  // Enrollment Information
  academicYear: string;
  term: string;

  // Payment Information
  feeType: string;
  paymentMethod: string;
  amount: number;
  amountInKobo?: number;
  paymentReference?: string;
  paymentStatus?: string;

  // Additional Information
  additionalInfo?: string;

  // Student and Fee Data (JSON arrays)
  students?: Array<{
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    gradeLevel: string;
    fees: Array<{
      type: string;
      amount: number;
    }>;
  }>;
  fees?: Array<{
    type: string;
    amount: number;
    studentName: string;
  }>;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

// Save enrollment data to SheetDB
export const saveToSheetDB = async (
  data: EnrollmentData
): Promise<{ success: boolean; message: string }> => {
  try {
    // Add timestamps
    const dataWithTimestamps = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentStatus:
        data.paymentStatus ||
        (data.paymentMethod === "bank-transfer" ? "pending" : "pending"),
    };

    const response = await fetch(SHEETDB_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [dataWithTimestamps],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SheetDB Error:", errorText);
      throw new Error(`Failed to save data: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.created === 1 || result.created > 0) {
      return {
        success: true,
        message: "Enrollment data saved successfully",
      };
    } else {
      throw new Error("Failed to save data to SheetDB");
    }
  } catch (error) {
    console.error("Error saving to SheetDB:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const updateSheetDB = async (
  reference: string,
  updates: Partial<EnrollmentData>
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${SHEETDB_API_URL}/paymentReference/${reference}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update data: ${response.statusText}`);
    }

    return {
      success: true,
      message: "Enrollment data updated successfully",
    };
  } catch (error) {
    console.error("Error updating SheetDB:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
