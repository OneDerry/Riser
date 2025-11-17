import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";


import Baselayout from "../app_layout/baseLayout";
import Applayout from "../app_layout/Applayout";
import { Loading } from "../ui/components/loaders";
import PaystackPayment from "../paystack/paystack_payment";
import SchoolPaymentForm from "../website/payment-form";
/* eslint-disable react-refresh/only-export-components */








const Home = lazy(() => import("../website/home"));
const EnrollmentPage = lazy(() => import("../website/enrollPage"));
// const SchoolPaymentForm = lazy(() => import("../website/payment-form"));
const FAQSection = lazy(() => import("../website/faq"));
const LoginForm = lazy(() => import("../domain/auth/components/login-form"));
const SignUpForm = lazy(() => import("../domain/auth/components/sign_up"));
const AdmissionsInfo = lazy(() => import("../website/admissions-info"));

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
          path: "/login",
          element: (
            <Suspense fallback={<Loading />}>
              <LoginForm />
            </Suspense>
          ),
        },
        {
          path: "/signup",
          element: (
            <Suspense fallback={<Loading />}>
              <SignUpForm />
            </Suspense>
          ),
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
      ],
    },
    {
      path: "admin",
      element: <Applayout />,
      children: [],
    },
  ];
}
