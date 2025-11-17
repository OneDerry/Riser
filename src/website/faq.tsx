import React, { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "How do I apply for admission?",
    answer:
      "You can apply by filling out our online application form on the Admissions page. If you prefer a paper application, please contact our admissions office.",
  },
  {
    question: "What are the admission requirements?",
    answer:
      "Admission requirements vary by grade level. Generally, we require academic records, a completed application form, and an interview or assessment.",
  },
  {
    question: "Is there an application fee?",
    answer:
      "Yes, a non-refundable application fee is required. Please refer to our Admissions page for the latest fee structure.",
  },
  {
    question: "When is the deadline to apply?",
    answer:
      "Applications are typically accepted from January to May. Late applications are considered based on availability.",
  },
  {
    question: "What curriculum does the school follow?",
    answer:
      "We follow the national curriculum, designed to meet both national and international educational standards.",
  },
  {
    question: "Do you offer special education services?",
    answer:
      "Yes, we offer support for students with diverse learning needs through our inclusive education program.",
  },
  {
    question: "What is the tuition fee structure?",
    answer:
      "Tuition fees vary by grade. Please visit our Fees section or contact our finance office for a detailed breakdown.",
  },
  {
    question: "Do you offer scholarships or financial aid?",
    answer:
      "Yes, we provide limited scholarships and financial assistance based on merit and need.",
  },
  {
    question: "Does the school provide transportation?",
    answer:
      "Yes, we offer a reliable school bus service on selected routes. Please check with the front office for availability.",
  },
  {
    question: "What are the school hours?",
    answer:
      "Our regular school hours are from 8:00 AM to 3:00 PM, Monday to Friday.",
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <button
              className="w-full text-left flex justify-between items-center text-lg font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-600 transition-all duration-300 ease-in-out">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
