import { Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";


import Footer from "../website/footer";
const Navbar = lazy(() => import("../website/navbar"));

const ComponentLoader = () => (
  <div className="flex items-center justify-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function Baselayout() {
  return (
    <main className="">
      <Suspense fallback={<ComponentLoader />}>
        <Navbar />
      </Suspense>
      <section className="">
        <Outlet />
      </section>
      <div>
        <Suspense fallback={<ComponentLoader />}>
          <Footer />
        </Suspense>
      </div>
    </main>
  );
}
