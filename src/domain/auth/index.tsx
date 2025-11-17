

import LoginForm from "./components/login-form";
import logo from "../../assets/logo.png";
export default function Login() {
  return (
    <section className="w-full lg:grid lg:h-screen lg:grid-cols-4">
      <div className="col-span-2 flex h-screen flex-col items-center bg-white p-4 xl:col-span-1">
        <div className="flex h-fit items-center gap-2 lg:mt-36">
          <img
            src={logo}
            alt={"logo"}
            className="w-72 flex items-center justify-center"
          />
        </div>

        <div className="mt-12 text-center lg:mt-16">
          <h1 className="text-4xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-lg lg:text-xl">
            Login to your account to gain access to the system
          </p>
        </div>
        <LoginForm />
      </div>

      <div className="col-span-3 hidden h-screen bg-blue-700 bg-[url('../../assets/logo.jpg')] bg-cover bg-center bg-no-repeat lg:block"></div>
    </section>
  );
}
