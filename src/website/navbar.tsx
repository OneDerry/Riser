import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import { cn } from "../lib/utils";
import logo from "../assets/logo_main.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 w-full text-white z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 text-slate-700 backdrop-blur-sm shadow-md"
          : "text-white"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className={`text-2xl font-bold text-slate-900 flex items-center gap-2 ${
            scrolled ? "text-slate-700" : "text-white"
          }`}
        >
          <img
            src={logo}
            alt={"logo"}
            className="w-9 h-9 flex items-center justify-center"
          />
          <span className={`${!scrolled ? "text-white" : "text-slate-900"}`}>
            Riser School
          </span>
        </Link>

        <button
          onClick={toggleMenu}
          className="md:hidden text-slate-900 focus:outline-none"
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#main" className=" hover:text-primary transition-colors">
            Home
          </a>
          <a href="#about" className=" hover:text-primary transition-colors">
            About Us
          </a>
          <a
            href="#admission"
            className=" hover:text-primary transition-colors"
          >
            Admission
          </a>
          <a href="#gallery" className=" hover:text-primary transition-colors">
            Gallery
          </a>
          <a href="#contacts" className=" hover:text-primary transition-colors">
            Contacts
          </a>
          <a href="/enroll" className=" hover:text-primary transition-colors">
            Enroll
          </a>
        </div>
      </div>

      {/* Mobile Menu (Conditional Rendering) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-sm py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link to="/" className=" transition-colors block">
              Home
            </Link>
            <Link to="#admission" className=" transition-colors block">
              Admission
            </Link>
            <Link to="#about" className=" transition-colors block">
              About Us
            </Link>
            <Link to="#gallery" className=" transition-colors block">
              Gallery
            </Link>
            <Link to="#contacts" className=" transition-colors block">
              Contacts
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
