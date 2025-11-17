import { useState } from "react";
import * as Yup from "yup";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa6";
import { Formik, Form, Field, ErrorMessage } from "formik";


import logo from "../assets/logoMain.png"
// import { RiEyeCloseLine } from "react-icons/ri";

const signInValidationSchema = Yup.object().shape({
  userId: Yup.string()
    .min(2, "name is too short")
    .max(20, "name is too long")
    .required("name is required"),
  email: Yup.string().required("email is required").email("invalid email"),
  password: Yup.string().required("password is required"),
});

export default function Logbutton() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prevState) => !prevState);

  return (
    <div className="grid grid-cols-2  items-center justify-center min-h-screen">
      <div className="flex items-center justify-center">
        <img src={logo} alt="" className="w-60 h-60" />
      </div>
      <div className="bg-white flex items-center justify-center p-2 rounded-xl ">
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={signInValidationSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              if (values) {
                toast.success("Logged in successfully!");
                navigate("/dashboard");
              }
              actions.setSubmitting(false);
            }, 1000);
          }}
        >
          {() => (
            <Form className="p-2 text-black">
              <div className="flex flex-col items-center gap-4 p-1">
                <label htmlFor="email" className="">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="rounded p-1 border-2 border-black"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="flex flex-col items-center gap-4 p-1">
                <label htmlFor="password" className="">
                  Password
                </label>
                <div className="relative w-full flex items-center border-2 border-black rounded-md">
                  <Field
                    type={!showPassword ? "password" : "text"}
                    name="password"
                    className="rounded p-1 focus:border-none"
                  />
                  {showPassword ? (
                    <FaEye onClick={togglePassword} size={17} />
                  ) : (
                    <p>Hwl</p>
                    // <RiEyeCloseLine onClick={togglePassword} size={17} />
                  )}
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mt-9 p-2 ">
                <button
                  type="submit"
                  className="bg-black rounded-sm w-full h-9 transition-transform delay-1000 hover:bg-gradient-to-r from-orange-800 text-white"
                >
                  Login
                </button>
              </div>
              <Toaster position="top-right" richColors />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
