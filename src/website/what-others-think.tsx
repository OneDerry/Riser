import { useEffect, useState } from "react";
import { ArrowUp, CheckCircle, Users, Briefcase, Heart } from "lucide-react";
// import { cn } from "@/lib/utils";

export default function WhatOthersThink() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    years: 0,
    students: 0,
    active: 0,
    customers: 0,
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Animate counter on component mount
  useEffect(() => {
    const duration = 2000; // ms
    const steps = 60;
    const stepTime = duration / steps;

    const targetValues = { years: 10, students: 138, active: 23, customers: 93 };
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep >= steps) {
        setCounts(targetValues);
        clearInterval(interval);
        return;
      }

      const progress = currentStep / steps;
      setCounts({
        years: Math.floor(targetValues.years * progress),
        students: Math.floor(targetValues.students * progress),
        active: Math.floor(targetValues.active * progress),
        customers: Math.floor(targetValues.customers * progress),
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      id: 1,
      amount: counts.years,
      title: "Years of Experience",
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
    },
    {
      id: 2,
      amount: counts.students,
      title: "Students",
      icon: <Briefcase className="h-6 w-6 text-primary" />,
    },
    {
      id: 3,
      amount: counts.active,
      title: "Active Staff",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      id: 4,
      amount: counts.customers,
      title: "Happy Parents",
      icon: <Heart className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="inline-block bg-blue-100 px-4 py-1 rounded-full mb-4">
          <span className="text-blue-800 font-medium flex items-center justify-center gap-2">
            What to expect
          </span>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-transparent bg-clip-text mb-4">
            What Our <span className="text-primary">Parents</span> Say
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-slate-800 italic max-w-2xl mx-auto text-lg">
            Discover why our parents trust us with their most important projects
          </p>
        </div>

        <div className="bg-white border-none shadow-xl hover:shadow-2xl transition-all duration-500 mb-16 overflow-hidden">
          <div className="p-0">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-12 text-center relative">
              <div className="absolute top-4 left-4 text-6xl text-primary/20 font-serif">
                "
              </div>
              <div className="absolute bottom-4 right-4 text-6xl text-primary/20 font-serif rotate-180">
                "
              </div>

              <blockquote className="text-xl md:text-2xl font-medium text-slate-800 italic mb-6 relative z-10">
                Inspiring minds, shaping futures, and creating lasting memories
                – our community speaks for itself.
              </blockquote>

              {/* <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">JD</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">Jane Doe</div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:-translate-y-1 transition-all duration-300 border border-slate-100"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-primary mb-2">
                {stat.amount}
              </div>
              <div className="text-slate-600 font-medium">{stat.title}</div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 rounded-full p-3 shadow-lg transition-all duration-300 z-50 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
