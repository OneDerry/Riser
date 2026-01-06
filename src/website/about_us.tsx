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
                  At Riser, our emphasis is not just education but formation.
                  Education is but a part of our formation process. Our
                  formation process has Christian values as its foundation.
                  This, therefore, makes the destination of our mission
                  different. Passing external examinations and qualifying for
                  admission into tertiary institutions is not all we set out to
                  achieve. Rather the destination of our formation process is
                  the holistic development of the human person in the light of
                  Christian value. Therefore, the popular saying “their
                  destination our mission.” Please feel free to go through our
                  website and leave a message for us on our contact page.
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
                  To raise young men and women of competence and integrity.
                </p>
              </div>

              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 relative">
                  <span className="relative z-10">Our Vision</span>
                  <span className="absolute bottom-0 left-0 w-16 h-2 bg-primary rounded-full"></span>
                </h2>
                <p className="text-slate-700 text-lg leading-relaxed font-serif">
                  To raise young men and women of competence and integrity.
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
