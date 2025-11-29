import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/logo.jpg";
import background from "../assets/school_building.jpg";
const EnrollmentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEnrollClick = () => {
    navigate("/form"); // Change this path if your form route is different
  };

  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="relative min-h-screen bg-cover bg-no-repeat bg-center px-6 py-12"
    >
      <div className="absolute inset-0 bg-black/30 z-0" />
      <div className="relative z-10 text-white">
        <Link
          to="/"
          className="font-bold text-white flex items-center gap-2 hover:-translate-x-2"
        >
          <ArrowLeft className="" />
          Back to Riser
        </Link>
      </div>
      <div className="relative z-10 max-w-4xl mt-20 mx-auto bg-white shadow-md rounded-lg p-8">
        <img src={logo} alt="" className="h-12 w-12 text-center" />
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Enrollment</h1>

        <p className="text-gray-700 mb-4">
          Welcome to the official School Fee Payment & Enrollment portal! We are
          committed to making the admission and fee payment process seamless,
          secure, and convenient for both new and returning students.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
          Enrollment Made Easy
        </h2>
        <p className="text-gray-700 mb-4">
          Whether you're a new student joining us for the first time or a
          returning student continuing your educational journey, our online
          enrollment system is designed to guide you step-by-step through the
          process. No more standing in long queues or dealing with
          paperwork—everything can now be done from the comfort of your home.
        </p>
        <p className="text-gray-700 mb-4">
          Once you're ready, simply click the button below to access our
          Enrollment Form Page. There, you’ll be able to fill in all necessary
          details, upload documents, and submit your application in just a few
          minutes.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
          Secure Fee Payment
        </h2>
        <p className="text-gray-700 mb-4">
          Alongside enrollment, our system offers a secure platform for paying
          school fees. Choose from multiple payment options including
          debit/credit card, bank transfer, or mobile money. All transactions
          are protected with industry-standard encryption to ensure your
          information remains safe.
        </p>
        <p className="text-gray-700 mb-4">
          After payment, a confirmation receipt will be sent to your email, and
          your enrollment will be processed immediately.
        </p>

        <h3 className="text-xl font-medium text-gray-800 mt-6 mb-2">
          Important Notes:
        </h3>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>Ensure all information provided is accurate and up-to-date.</li>
          <li>
            Documents required for enrollment (e.g., birth certificate, academic
            records, passport photo) must be scanned clearly.
          </li>
          <li>
            Our support team is available to assist you with any issues or
            questions.
          </li>
        </ul>

        <div className="text-center mt-8">
          <button
            onClick={handleEnrollClick}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;
