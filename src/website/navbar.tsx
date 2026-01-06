import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { scrollToHash } from "../lib/utils/scroll";
import logo from "../assets/logo_main.png";
import { TnavbarItems } from "../lib/types";
import { buttonVariants } from "../shared/common";

const Navbar = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      scrollToHash(location.hash);
    }
  }, [location]);

  const handleNavClick = (e: React.MouseEvent, to: string) => {
    if (to.includes("#")) {
      e.preventDefault();
      const hash = to.split("#")[1];
      if (window.location.pathname === "/") {
        scrollToHash(hash);
      } else {
        window.location.href = `/#${hash}`;
      }
    }
  };
  const navItems: TnavbarItems[] = [
    { url: "/", name: "Home" },
    { url: "/#about", name: "About us" },
    { url: "/#admission", name: "Admission" },
    { url: "/#gallery", name: "Gallery" },
    { url: "/#contacts", name: "Contacts" },
    { url: "/form", name: "Enroll" },
  ];
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
          {navItems.map((item) => (
            <NavLink
              to={item.url}
              key={item.name}
              onClick={(e) => handleNavClick(e, item.url)}
              className={({ isActive }) =>
                cn(
                  "text-sm font-normal capitalize transition-colors hover:text-primary cursor-pointer",
                  buttonVariants({ variant: "linkHover2" }),
                  {
                    "text-primary": isActive || (location.hash === `#${item.url.split('#')[1]}` && item.url.includes('#')),
                    "text-foreground hover:text-primary": !isActive && !(location.hash === `#${item.url.split('#')[1]}` && item.url.includes('#'))
                  }
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile Menu (Conditional Rendering) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-sm py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <NavLink
                to={item.url}
                key={item.name}
                onClick={(e) => handleNavClick(e, item.url)}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-normal capitalize transition-colors hover:text-primary cursor-pointer",
                    buttonVariants({ variant: "linkHover2" }),
                    {
                      "text-primary":
                        isActive ||
                        (location.hash === `#${item.url.split("#")[1]}` &&
                          item.url.includes("#")),
                      "text-foreground hover:text-primary":
                        !isActive &&
                        !(
                          location.hash === `#${item.url.split("#")[1]}` &&
                          item.url.includes("#")
                        ),
                    }
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
