import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { GrCheckbox } from "react-icons/gr";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../../config/firebase.ts";
import { Input } from "../../../app/userint/input.tsx";
import { Button } from "../../../app/userint/button.tsx";
import { Validators } from "../../../lib/validations.ts";
// import { useNavigate } from "react-router-dom";



// import { setCredentials } from "../../../app/features/authSlice";
// import { useAppDispatch } from "../../../app/store";

//firebase


//
// import { useLoginMutation } from "../../../app/services/authApi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../app/userint/form.tsx";





type FormSchema = z.infer<typeof Validators.Login>;

export default function SignUpForm() {
  const [passwordType, setPasswordType] = useState<"text" | "password">(
    "password"
  );
  // const [login, { isLoading }] = useLoginMutation();
  //   const dispatch = useAppDispatch();
  //   const navigate = useNavigate();

  const form = useForm<FormSchema>({
    resolver: zodResolver(Validators.SignUp),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    const loadingToast = toast.loading("Logging in...");
    try {
      // const result = await login(values).unwrap();
      await signInWithEmailAndPassword(
        auth,
        form.getValues("email"),
        form.getValues("password")
      );
      toast.dismiss(loadingToast);

      // if (result.success) {
      //   dispatch(
      //     setCredentials({ user: result.user})
      //   );
      //   toast.dismiss(loadingToast);
      //   toast.success("Login Successful", {
      //     description: result.message,
      //   });

      //   // const userData = result.data.user;      } else {
      //   toast.dismiss(loadingToast);
      //   toast.error("Login Failed", {
      //     description: result.message,
      //   });
      //   navigate("/admin");
      // }
      // const error = err as ErrorResponse;
      // if (error.status === 422 && error.data) {
      //   toast.error("Login Failed", {
      //     description:
      //       error.data.message || "Invalid credentials. Please try again.",
      //   });
      // } else {
      //   toast.error("Login Error", {
      //     description: "An unexpected error occurred. Please try again later.",
      //   });
      // }catch (err) {
    } catch (error) {
      toast.dismiss(loadingToast);
      if (
        error
        // error.code === "auth/user-not-found" ||
        // error.message.includes("EMAIL_NOT_FOUND")
      ) {
        toast.error("Account not found", {
          description: "This email is not registered. Please sign up first.",
        });
      } else {
        toast.error("Login failed", {
          description: "Please check your credentials and try again.",
        });
      }
    }
  };

  return (
    <div className="mt-8 w-full p-6 lg:mt-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={passwordType}
                      {...field}
                    />
                    <Button
                      type="button"
                      size="icon"
                      className="absolute right-1 top-0"
                      onClick={() =>
                        setPasswordType((prev) =>
                          prev === "password" ? "text" : "password"
                        )
                      }
                    >
                      {passwordType === "password" ? (
                        <Eye className="text-slate-400" />
                      ) : (
                        <EyeOff className="text-slate-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <GrCheckbox id="terms" />
              <label
                htmlFor="terms"
                className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </span>
            <span>
              <Link to="/auth/forgot-password">Forgot password?</Link>
            </span>
          </div>

          <Button
            type="submit"
            variant="gooeyLeft"
            className="group inline-flex w-full items-center gap-2 bg-blue-700 text-white"
            // disabled={isLoading}
          >
            {/* {isLoading ? "Logging in..." : "Login"} */}
            Login
            <ArrowRight className="transition-all duration-300 ease-in-out group-hover:translate-x-2" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
