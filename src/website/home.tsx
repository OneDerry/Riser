import { useEffect, useState } from "react";

import { Hero } from "./landing";
import AboutUs from "./about_us";
import Facilities from "./facilities";
import Admissions from "./admissions";
import ImmsersiveGallery from "./cards";
import WhatOthersThink from "./what_others_think";

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

      <AboutUs />
      <Facilities />

      <Admissions />

      <ImmsersiveGallery />

      <WhatOthersThink />
    </main>
  );
}
