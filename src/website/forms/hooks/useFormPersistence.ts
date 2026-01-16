import { useEffect } from "react";
import { FormValues } from "../validations";

const STORAGE_KEY = "riser_enrollment_form_data";

export function saveFormDataToStorage(data: Partial<FormValues>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save form data to localStorage:", error);
  }
}

export function loadFormDataFromStorage(): Partial<FormValues> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn("Failed to load form data from localStorage:", error);
    return null;
  }
}

export function clearFormDataFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear form data from localStorage:", error);
  }
}

export function useFormPersistence(
  formData: FormValues,
  setFormData: (data: FormValues) => void,
  isSubmitting: boolean,
  isSuccess: boolean
) {
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (!isSubmitting && !isSuccess) {
      saveFormDataToStorage(formData);
    }
  }, [formData, isSubmitting, isSuccess]);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadFormDataFromStorage();
    if (savedData) {
      // Only restore if form is empty (new form)
      const isEmpty = Object.values(formData).every(
        (value) =>
          value === "" ||
          value === null ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "object" && Object.keys(value).length === 0)
      );

      if (isEmpty) {
        setFormData({ ...formData, ...savedData });
      }
    }
  }, [formData, setFormData]); // Empty dependency array means this runs only once on mount

  // Clear storage after successful submission
  useEffect(() => {
    if (isSuccess) {
      clearFormDataFromStorage();
    }
  }, [isSuccess]);

  return {
    saveFormDataToStorage,
    loadFormDataFromStorage,
    clearFormDataFromStorage,
  };
}
