import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { formSchema } from "../app/components/validations";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import background from "../assets/schoolbuilding.jpg";

type FormValues = z.infer<typeof formSchema>;

export default function SchoolPaymentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    // watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentFirstName: "",
      parentLastName: "",
      parentEmail: "",
      parentPhone: "",
      studentFirstName: "",
      studentLastName: "",
      gradeLevel: "",
      academicYear: "",
      semester: "",
      feeType: "",
      paymentMethod: "",
      additionalInfo: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    // Simulate API call
    try {
      // In a real application, you would send this data to your backend
      console.log("Form data submitted:", data);

      // Simulate a delay for the API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setValue("studentDob", date);
    setShowCalendar(false);
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPaymentMethod(e.target.value);
    setValue("paymentMethod", e.target.value);
  };

  const gradeLevels = [
    "Kindergarten",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  const academicYears = ["2023-2024", "2024-2025", "2025-2026"];
  const semesters = ["First Semester", "Second Semester", "Summer Term"];
  const feeTypes = [
    { name: "Tuition Fee", amount: 5000 },
    { name: "Registration Fee", amount: 500 },
    { name: "Technology Fee", amount: 300 },
    { name: "Library Fee", amount: 200 },
    { name: "Activity Fee", amount: 250 },
    { name: "Full Package", amount: 6000 },
  ];

  // Simple calendar component
  const SimpleCalendar = ({
    onSelectDate,
  }: {
    onSelectDate: (date: Date) => void;
  }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
      return new Date(year, month, 1).getDay();
    };

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(
        <button
          key={i}
          type="button"
          onClick={() => onSelectDate(date)}
          className="h-8 w-8 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {i}
        </button>
      );
    }

    const prevMonth = () => {
      setCurrentMonth(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
      setCurrentMonth(new Date(year, month + 1, 1));
    };

    return (
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 hover:bg-gray-200 rounded"
          >
            &lt;
          </button>
          <div>{format(currentMonth, "MMMM yyyy")}</div>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 hover:bg-gray-200 rounded"
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          <div className="h-8 flex items-center justify-center">Su</div>
          <div className="h-8 flex items-center justify-center">Mo</div>
          <div className="h-8 flex items-center justify-center">Tu</div>
          <div className="h-8 flex items-center justify-center">We</div>
          <div className="h-8 flex items-center justify-center">Th</div>
          <div className="h-8 flex items-center justify-center">Fr</div>
          <div className="h-8 flex items-center justify-center">Sa</div>
          {days}
        </div>
      </div>
    );
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto h-screen flex-col flex  items-center justify-center p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-lg font-medium text-green-800">
              Payment Successful!
            </h3>
          </div>
          <p className="mt-2 text-green-700">
            Thank you for your payment. Your child has been successfully
            enrolled. You will receive a confirmation email shortly.
          </p>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSuccess(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Make Another Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="min-h-screen bg-cover bg-no-repeat bg-center px-6 py-12
      "
    >
      <div>
        <Link
          to="/enroll"
          className="font-bold flex items-center gap-2 hover:-translate-x-2"
        >
          <ArrowLeft /> Back to Enroll
        </Link>
      </div>
      <div className="bg-white w-[90%] sm:w-[60%] mx-auto rounded-lg shadow-lg overflow-hidden">
        <div className="bg-slate-50 border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">
            School Fee Payment & Enrollment
          </h2>
          <p className="text-gray-600 mt-1">
            Complete this form to pay school fees and enroll your child
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-8">
            {/* Parent Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                Parent/Guardian Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="parentFirstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="parentFirstName"
                    type="text"
                    {...register("parentFirstName")}
                    placeholder="Enter first name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.parentFirstName && (
                    <p className="text-sm text-red-500">
                      {errors.parentFirstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="parentLastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="parentLastName"
                    type="text"
                    {...register("parentLastName")}
                    placeholder="Enter last name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.parentLastName && (
                    <p className="text-sm text-red-500">
                      {errors.parentLastName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="parentEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="parentEmail"
                    type="email"
                    {...register("parentEmail")}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.parentEmail && (
                    <p className="text-sm text-red-500">
                      {errors.parentEmail.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="parentPhone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="parentPhone"
                    type="tel"
                    {...register("parentPhone")}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.parentPhone && (
                    <p className="text-sm text-red-500">
                      {errors.parentPhone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Student Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="studentFirstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="studentFirstName"
                    type="text"
                    {...register("studentFirstName")}
                    placeholder="Enter first name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.studentFirstName && (
                    <p className="text-sm text-red-500">
                      {errors.studentFirstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="studentLastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="studentLastName"
                    type="text"
                    {...register("studentLastName")}
                    placeholder="Enter last name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.studentLastName && (
                    <p className="text-sm text-red-500">
                      {errors.studentLastName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="studentDob"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="studentDob"
                      type="text"
                      readOnly
                      value={selectedDate ? format(selectedDate, "PP") : ""}
                      onClick={() => setShowCalendar(!showCalendar)}
                      placeholder="Select date of birth"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    />
                    {showCalendar && (
                      <div className="absolute z-10 mt-1">
                        <SimpleCalendar onSelectDate={handleDateChange} />
                      </div>
                    )}
                  </div>
                  {errors.studentDob && (
                    <p className="text-sm text-red-500">
                      {errors.studentDob.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="studentGender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="studentGender"
                    {...register("studentGender")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.studentGender && (
                    <p className="text-sm text-red-500">
                      {errors.studentGender.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Enrollment Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                Enrollment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="gradeLevel"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Grade Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gradeLevel"
                    {...register("gradeLevel")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select grade</option>
                    {gradeLevels.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                  {errors.gradeLevel && (
                    <p className="text-sm text-red-500">
                      {errors.gradeLevel.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="academicYear"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="academicYear"
                    {...register("academicYear")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select year</option>
                    {academicYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.academicYear && (
                    <p className="text-sm text-red-500">
                      {errors.academicYear.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="semester"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="semester"
                    {...register("semester")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select semester</option>
                    {semesters.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
                  {errors.semester && (
                    <p className="text-sm text-red-500">
                      {errors.semester.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Payment Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Payment Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="feeType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fee Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="feeType"
                    {...register("feeType")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select fee type</option>
                    {feeTypes.map((fee) => (
                      <option key={fee.name} value={fee.name}>
                        {fee.name} - ${fee.amount}
                      </option>
                    ))}
                  </select>
                  {errors.feeType && (
                    <p className="text-sm text-red-500">
                      {errors.feeType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="paymentMethod"
                    onChange={handlePaymentMethodChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="credit-card">Credit/Debit Card</option>
                    <option value="bank-transfer">Bank Transfer</option>
                  </select>
                  {errors.paymentMethod && (
                    <p className="text-sm text-red-500">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                {selectedPaymentMethod === "credit-card" && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-md">
                    <h4 className="font-medium mb-4">
                      Credit/Debit Card Details
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="cardholderName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Cardholder Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="cardholderName"
                          type="text"
                          {...register("cardholderName")}
                          placeholder="Enter cardholder name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Card Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="cardNumber"
                            type="text"
                            {...register("cardNumber")}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path
                              fillRule="evenodd"
                              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="expiryDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Expiry Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="expiryDate"
                            type="text"
                            {...register("expiryDate")}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="cvv"
                            className="block text-sm font-medium text-gray-700"
                          >
                            CVV <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="cvv"
                            type="password"
                            {...register("cvv")}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === "bank-transfer" && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-md border border-gray-200">
                    <h4 className="font-medium mb-2">
                      Bank Transfer Instructions
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">
                      Please transfer the payment to the following bank account
                      and upload the receipt below:
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Bank Name:</span> School
                        National Bank
                      </p>
                      <p>
                        <span className="font-medium">Account Name:</span>{" "}
                        School Education Fund
                      </p>
                      <p>
                        <span className="font-medium">Account Number:</span>{" "}
                        1234567890
                      </p>
                      <p>
                        <span className="font-medium">Routing Number:</span>{" "}
                        987654321
                      </p>
                      <p>
                        <span className="font-medium">Reference:</span>{" "}
                        Student's Full Name
                      </p>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="receipt"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Upload Payment Receipt
                      </label>
                      <input
                        id="receipt"
                        type="file"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Additional Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                Additional Information
              </h3>
              <div className="space-y-2">
                <label
                  htmlFor="additionalInfo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Any special requirements or information
                </label>
                <textarea
                  id="additionalInfo"
                  {...register("additionalInfo")}
                  placeholder="Enter any additional information here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between border-t p-6 bg-slate-50">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Complete Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
