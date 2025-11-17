import { useNavigate } from "react-router-dom";
import { CalendarClock, FileText, GraduationCap } from "lucide-react";

import { motion } from "framer-motion";

import admission from "../assets/admission/admission.jpg";
import open from "../assets/admission/admission_open.jpg";
import exam from "../assets/admission/entrance_exam.jpg";

const Admissions = () => {
  const navigate = useNavigate();
  return (
    <section
      id="admission"
      className="bg-gradient-to-b from-slate-50 to-slate-100 py-16 md:py-24 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-blue-100 px-4 py-1 rounded-full mb-4">
            <span className="text-blue-800 font-medium flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              New Academic Year
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 bg-clip-text text-transparent pb-2">
            2025/2026 ADMISSION IS NOW OPEN
          </h1>

          <div className="mt-6 max-w-2xl mx-auto">
            <p className="text-slate-700 text-lg">
              Join our prestigious institution and embark on a journey of
              academic excellence and holistic development.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/enroll")}
              className="bg-blue-800 hover:bg-blue-700 flex items-center p-2 justify-center text-white rounded-md"
            >
              <FileText className="mr-2 h-4 w-4" /> Apply Now
            </button>
            <button
              //   variant="outline"
              onClick={() => navigate("/admissions-info")}
              className="border-blue-600 text-blue-700 hover:bg-blue-50 flex items-center p-2 justify-center rounded-md"
            >
              <GraduationCap className="mr-2 h-4 w-4" /> Learn More
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 relative"
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-0">
            <motion.div
              initial={{ rotate: 0, x: 0 }}
              whileInView={{ rotate: -6, x: -20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative z-10 shadow-xl rounded-lg overflow-hidden border-8 border-white transform md:rotate-[-6deg] md:-translate-x-5 w-[280px] md:w-[320px] lg:w-[380px]"
            >
              <img
                src={admission}
                alt="School admission information"
                width={350}
                height={500}
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ rotate: 0, y: 0 }}
              whileInView={{ rotate: 0, y: -15 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="relative z-20 shadow-xl rounded-lg overflow-hidden border-8 border-white transform md:translate-y-[-15px] w-[280px] md:w-[320px] lg:w-[380px]"
            >
              <img
                src={open}
                alt="Admission open announcement"
                width={350}
                height={500}
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ rotate: 0, x: 0 }}
              whileInView={{ rotate: 6, x: 20 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
              className="relative z-10 shadow-xl rounded-lg overflow-hidden border-8 border-white transform md:rotate-[6deg] md:translate-x-5 w-[280px] md:w-[320px] lg:w-[380px]"
            >
              <img
                src={exam}
                alt="Entrance examination details"
                width={350}
                height={500}
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-100/30 -z-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-100 to-transparent -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Admissions;
