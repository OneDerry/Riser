import { motion } from "framer-motion";

import Image from "../assets/new/main_building.png";
import proprietor from "../assets/proprietor.jpg";
const AboutUs = () => {
  return (
    <div className="p-4">
      <div id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src={proprietor}
                  alt="School building"
                  width={500}
                  height={400}
                  className="object-cover"
                />
                {/* <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div> */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 relative">
                  <span className="relative z-10">Welcome Speech</span>
                  <span className="absolute bottom-0 left-0 w-16 h-2 bg-primary rounded-full"></span>
                </h2>
                <p className="text-slate-700 text-lg leading-relaxed font-serif">
                  At Riser, education is more than academics. We focus on the
                  holistic development of every student, nurturing their
                  knowledge, character, and life skills. Our goal is to raise
                  confident, capable, and responsible individuals who are
                  prepared for both school and life. We invite you to explore
                  our website and connect with us through our contact page to
                  learn more about the Riser experience.
                  <br />
                  Thank you.
                  <br />
                  <span className="font-bold">Mr Olomu</span>
                  <br />
                  Proprietor
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-10 justify-center flex flex-col items-center"
            >
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 relative">
                  <span className="relative z-10">Our Mission</span>
                  <span className="absolute bottom-0 left-0 w-16 h-2 bg-primary rounded-full"></span>
                </h2>
                <p className="text-slate-700 text-lg leading-relaxed font-serif">
                  To provide a nurturing and disciplined learning environment
                  that develops academically excellent, morally grounded, and
                  socially responsible young men and women.
                </p>
              </div>

              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 relative">
                  <span className="relative z-10">Our Vision</span>
                  <span className="absolute bottom-0 left-0 w-16 h-2 bg-primary rounded-full"></span>
                </h2>
                <p className="text-slate-700 text-lg leading-relaxed font-serif">
                  To be a leading institution recognized for shaping confident,
                  ethical, and competent leaders who positively impact their
                  communities and the nation.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src={Image}
                  alt="School building"
                  width={500}
                  height={400}
                  className="object-cover"
                />
                {/* <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div> */}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
