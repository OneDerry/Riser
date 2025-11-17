/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

import Baselayout from "../shared/layout/base_layout";
import { Loading } from "../shared/components/loaders";
import PaystackPayment from "../paystack/paystack_payment";
import SchoolPaymentForm from "../website/forms/payment_form";

const Home = lazy(() => import("../website/home"));
const EnrollmentPage = lazy(() => import("../website/enroll_page"));
const FAQSection = lazy(() => import("../website/faq"));
const AdmissionsInfo = lazy(() => import("../website/admissions_info"));

export default function appRouter(): RouteObject[] {
  return [
    {
      path: "/",
      element: <Baselayout />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "/enroll",
          element: (
            <Suspense fallback={<Loading />}>
              <EnrollmentPage />
            </Suspense>
          ),
        },
        {
          path: "/form",
          element: <SchoolPaymentForm />,
        },
        {
          path: "/faq",
          element: (
            <Suspense fallback={<Loading />}>
              <FAQSection />
            </Suspense>
          ),
        },
        {
          path: "/admissions-info",
          element: (
            <Suspense fallback={<Loading />}>
              <AdmissionsInfo />
            </Suspense>
          ),
        },
        {
          path: "/paystack_payment",
          Component: PaystackPayment,
        },
        // {
        //   path: "/login",
        //   element: (
        //     <Suspense fallback={<Loading />}>
        //       <LoginForm />
        //     </Suspense>
        //   ),
        // },
        // {
        //   path: "/signup",
        //   element: (
        //     <Suspense fallback={<Loading />}>
        //       <SignUpForm />
        //     </Suspense>
        //   ),
        // },
      ],
    },
  ];
}
