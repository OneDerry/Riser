import { motion } from "framer-motion";
import {
  CheckCircle,
  FlaskRoundIcon as Flask,
  Music,
  Stethoscope,
  Trophy,
  BookOpen,
  Utensils,
  HandCoins,
} from "lucide-react";
import { Card } from "../ui/Card";

const Facilities = () => {
  const facilities = [
    {
      title: "Science Labs",
      description:
        "Well equipped laboratories for computer, physics, chemistry and biology.",
      icon: <Flask className="h-6 w-6 text-primary" />,
    },
    {
      title: "Arts & Music",
      description:
        "Music and Arts Studio for creative expression and development.",
      icon: <Music className="h-6 w-6 text-primary" />,
    },
    {
      title: "Medical Care",
      description: "A well equipped clinic with a residential doctor.",
      icon: <Stethoscope className="h-6 w-6 text-primary" />,
    },
    {
      title: "Sports Facilities",
      description:
        "Various sporting facilities: volleyball, football, basketball & table tennis.",
      icon: <Trophy className="h-6 w-6 text-primary" />,
    },
    {
      title: "Learning Environment",
      description:
        "Conducive environment for studies and audio-visual teaching aids.",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
    },
    {
      title: "Home Economics",
      description: "Home Economics / Food and Nutrition Lab.",
      icon: <Utensils className="h-6 w-6 text-primary" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 bg-blue-900 transition-colors duration-300 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 text-black"
        >
          <div className="inline-block bg-blue-100 px-4 py-1 rounded-full mb-4">
            <span className="font-medium flex items-center gap-2">
              <HandCoins className="h-4 w-4" />
              What we offer
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold  mb-4 transition-colors duration-300 text-white">
            School Facilities
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-base  max-w-2xl mx-auto text-white italic">
            Riser is equipped with ultra-modern facilities designed to provide
            an exceptional learning environment.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {facilities.map((facility, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full p-6 border-2 border-slate-100 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    {facility.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2  group-hover:text-primary transition-colors duration-300">
                      {facility.title}
                    </h3>
                    <p className="">{facility.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-primary font-medium">
            <CheckCircle className="h-5 w-5" />
            <span>
              All facilities are regularly maintained to ensure optimal
              functionality
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Facilities;
