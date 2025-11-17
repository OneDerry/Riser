import { useEffect, useState, lazy, Suspense } from "react";

import { Hero } from "./landing";
import AboutUs from "./about_us";
import Admissions from "./admissions";
import ImmsersiveGallery from "./cards.tsx";
import Facilities from "./facilities.tsx";
const WhatOthersThink = lazy(() => import("./what_others_think"));

const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <main id="main">
      <Hero />

      <Suspense fallback={<SectionLoader />}>
        <AboutUs />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Facilities />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Admissions />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ImmsersiveGallery />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <WhatOthersThink />
      </Suspense>
    </main>
  );
}
