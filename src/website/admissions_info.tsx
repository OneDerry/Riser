import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import background from "../assets/school_building.jpg";
export default function AdmissionsInfo() {
  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="min-h-screen bg-cover bg-no-repeat bg-center px-6 py-12"
    >
      <div>
        <Link
          to="/"
          className="font-bold flex items-center gap-2 hover:-translate-x-2"
        >
          <ArrowLeft /> Back to Home
        </Link>
      </div>

      <div className="bg-white w-[90%] sm:w-[60%] mx-auto rounded-lg shadow-lg overflow-hidden my-8">
        <div className="bg-slate-50 border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">Admissions</h2>
          <p className="text-gray-600 mt-1">
            Welcome to Riser School: Where Excellence Meets Opportunity
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Introduction */}
          <div>
            <p className="text-gray-700 leading-relaxed">
              At Riser School, we are passionate about providing an outstanding
              education that nurtures, inspires, and empowers every student.
              From our warm and inclusive community to our world-class
              facilities, we offer a learning experience like no other.
              Admissions for the new academic year are now open! This is your
              chance to give your child a head start toward a bright future.
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Why Choose Riser */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Why Choose Riser School?
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  British Standard of Education
                </h4>
                <p className="text-gray-700">
                  We follow the prestigious British curriculum, including
                  Edexcel, Checkpoint, and IGCSE programs, which emphasize
                  academic rigor, critical thinking, and a global perspective.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Holistic Development
                </h4>
                <p className="text-gray-700">
                  At Riser, education goes beyond the classroom. We focus on
                  nurturing well-rounded individuals through extracurricular
                  activities, character development programs, and leadership
                  opportunities.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Dedicated Educators
                </h4>
                <p className="text-gray-700">
                  Our passionate and highly qualified teachers are committed to
                  bringing out the best in every child, fostering a love for
                  learning and personal excellence.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  State-of-the-Art Facilities
                </h4>
                <p className="text-gray-700">
                  From modern classrooms to well-equipped science labs, sports
                  facilities, and libraries, we provide an environment where
                  students can explore, innovate, and grow.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Cultural Diversity
                </h4>
                <p className="text-gray-700">
                  With students from different backgrounds, our school is a
                  melting pot of cultures, preparing children for a future in an
                  interconnected world.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Boarding and Day School Options
                </h4>
                <p className="text-gray-700">
                  Whether you're seeking day school or boarding options, we
                  offer flexible arrangements to suit your family's needs. Our
                  boarding facilities are safe, nurturing, and truly feel like a
                  home away from home.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* School Fees */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              School Fees
            </h3>
            <p className="text-gray-700 mb-4">
              At Riser School, 
              we are committed to providing exceptional value for an outstanding
              education. Our fee structure reflects the premium learning
              experience we offer, including access to world-class facilities,
              personalized support, and comprehensive extracurricular
              opportunities. All this reflects in our transparency as regards
              our fee schedule below.
            </p>
            <p className="text-gray-700">
              For more details on tuition and associated fees, please contact
              our admissions team:
            </p>
            <p className="text-blue-600 font-medium mt-2">
              📞 +234 802 300 4355
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Admissions Process */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Admissions Process: Simple and Transparent
            </h3>
            <p className="text-gray-700 mb-4">
              At Riser School, we strive to make the admissions process seamless
              for families. Here's how it works:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Inquiry and Visit
                </h4>
                <p className="text-gray-700">
                  Contact us to schedule a school tour. See our facilities, meet
                  our teachers, and experience firsthand what makes Riser so
                  special.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Application Submission
                </h4>
                <p className="text-gray-700">
                  Complete and submit the admissions form along with the
                  required documents.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Assessment and Interview
                </h4>
                <p className="text-gray-700">
                  Students will undergo an assessment to understand their
                  learning needs, followed by an interview to get to know them
                  better.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Offer and Enrollment
                </h4>
                <p className="text-gray-700">
                  Upon successful completion of the process, you'll receive an
                  admission offer. Secure your child's spot by completing the
                  enrollment formalities.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Age and Year Levels */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Age and Year Levels
            </h3>
            <p className="text-gray-700 mb-4">
              Our admissions are open for the following year levels:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Pre-School (Pre-Nursery and Nursery):</strong> Ages
                  1-5 (Key Stage 1)
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Primary School (Year 1-6):</strong> Ages 5–11 (Key
                  Stage 2 and Pearson Edexcel)
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Secondary School (Year 7-11):</strong> Ages 11–18 (Key
                  Stage 3, Key Stage 4, and IGCSE)
                </span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-200" />

          {/* Call to Action */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-3">
              A Bright Future Awaits Your Child
            </h3>
            <p className="text-blue-800 mb-4">
              Choosing the right school is one of the most important decisions
              you'll make as a parent. At Riser School, we partner with families
              to unlock every child's potential and prepare them for a world of
              opportunities.
            </p>
            <div className="bg-white rounded-md p-4 border border-blue-300">
              <p className="text-lg font-semibold text-blue-900 mb-2">
                📚 Take the Next Step Today!
              </p>
              <p className="text-gray-700 mb-3">
                Call us now at{" "}
                <span className="font-semibold text-blue-600">
                  +234 802 300 4355
                </span>{" "}
                to learn more about our admissions process and book a school
                tour. Spaces are limited, so don't wait too long!
              </p>
              <p className="text-lg font-semibold text-blue-900">
                🌟 Your Child's Future Begins Here.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between border-t p-6 bg-slate-50">
          <Link
            to="/"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Home
          </Link>
          <Link
            to="/enroll"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}
