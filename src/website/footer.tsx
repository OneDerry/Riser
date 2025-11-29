import type React from "react";
import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import { toast } from "sonner";

import logoSrc from "../assets/logo_main.png";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Subscription successful!");
      setEmail("");
      setIsSubmitting(false);
    }, 800);
  };

  // Animation variants - smooth and fast
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.footer
      id="contacts"
      className="bg-black pt-16 pb-6 border-t border-slate-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerAnimation}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and About */}
          <div className="space-y-4 text-slate-100">
            <div className="flex items-center">
              <img
                src={logoSrc || "/placeholder.svg?height=60&width=200"}
                alt="Riser School Logo"
                width={100}
                height={30}
                className="h-auto"
              />
            </div>
            <p className="text-slate-300 text-xs mt-4 max-w-xs">
              A serene, spacious and comfortable learning environment, with
              highly qualified teaching staff.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-slate-100">
            <h3 className="font-bold text-slate-100 text-lg mb-4 border-b border-slate-200 pb-2">
              Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-slate-300 hover:text-blue-400 transition-colors flex items-center group"
                >
                  <span>Admissions</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-slate-300 hover:text-blue-500 transition-colors flex items-center group"
                >
                  <span>Download Prospectus</span>
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className="text-slate-300 hover:text-blue-500 transition-colors flex items-center group"
                >
                  <span>FAQ's</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-300 text-lg mb-4 border-b border-slate-200 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 text-sm">
                  riserschool@gmail.com
                </span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 text-sm">
                  No. 10 Majokwe Olomu Street, Off Effurun Sapele Road, Effurun
                  (between Ecobank and Zenith bank), Effurun, Nigeria, 330102
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 text-sm">0802 300 4355</span>
              </li>
            </ul>
            <div className="flex space-x-4 pt-2">
              <Link
                to="https://web.facebook.com/RiserAdmin/?_rdc=1&_rdr#"
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <Facebook size={18} />
              </Link>
              <Link
                to="https://x.com/riserschool"
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <FaXTwitter size={18} />
              </Link>
              <Link
                to="https://instagram.com/riserschool"
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <Instagram size={18} />
              </Link>
              <Link
                to="https://linkedin.com/company/riserschool"
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-300 text-lg mb-4 border-b border-slate-200 pb-2">
              Newsletter
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              Subscribe to our newsletter to receive updates and news.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2 ">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-200"
                >
                  Email Address
                </label>
                <div className="flex items-center gap-2 border-2 rounded-md bg-slate-600">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="rounded-r-none focus-visible:ring-primary p-2"
                    required
                  />
                  <button
                    type="submit"
                    className="rounded-l-none text-white flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "..." : "Subscribe"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Riser School, Effurun. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="#"
                className="text-slate-400 hover:text-primary text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="#"
                className="text-slate-400 hover:text-primary text-sm transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
