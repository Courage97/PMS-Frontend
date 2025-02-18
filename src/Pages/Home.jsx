import React from "react";
import { ArrowRight, CheckCircle2, Users, Zap, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom"; // Fixed import
import { motion } from "framer-motion"; // Added for animations

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-['Inter']">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text">
              ManageIQ
            </div>
          </div>
          <nav className="space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 text-[#4CAF50] border border-[#4CAF50] rounded-full hover:bg-[#4CAF50] hover:text-white transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-white rounded-full hover:shadow-lg transition-all"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold text-[#333333] mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text">
                {" "}
                Teams Productivity
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Streamline collaboration, boost efficiency, and achieve your goals
              with our intelligent project management platform
            </p>
            <div className="flex">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-white rounded-full text-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://i.pinimg.com/736x/ef/bb/ab/efbbab44231c132a46cb53f5ed07289d.jpg"
              alt="Dashboard Preview"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-lg">
              <img
                src="https://i.pinimg.com/736x/dc/01/93/dc0193bb71246e22d984d74a07ecbf20.jpg"
                alt="Feature Preview"
                className="rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-8 bg-gradient-to-r from-[#4CAF50]/5 to-[#2196F3]/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10k+", label: "Active Users" },
              { number: "50k+", label: "Tasks Completed" },
              { number: "99%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help your team stay organized, focused, and
              productive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <CheckCircle2 />,
                title: "Task Management",
                description:
                  "Create, assign, and track tasks with ease. Set priorities and deadlines.",
                color: "from-[#4CAF50]",
                image:
                  "https://i.pinimg.com/736x/79/8d/ee/798dee483f65c68361a23edfa80108c7.jpg",
              },
              {
                icon: <Users />,
                title: "Team Collaboration",
                description:
                  "Work together seamlessly with team chat and file sharing.",
                color: "from-[#2196F3]",
                image:
                  "https://i.pinimg.com/736x/0a/cb/43/0acb43236c05d256726d794e9647a13f.jpg",
              },
              {
                icon: <Zap />,
                title: "Real-time Updates",
                description:
                  "Stay informed with instant notifications and live updates.",
                color: "from-[#4CAF50]",
                image:
                  "https://i.pinimg.com/736x/06/aa/1b/06aa1ba930362df9ba3b845a76e94df3.jpg",
              },
              {
                icon: <BarChart3 />,
                title: "Data Visualization",
                description:
                  "Make informed decisions with powerful analytics dashboards.",
                color: "from-[#2196F3]",
                image:
                  "https://i.pinimg.com/736x/4c/9f/0d/4c9f0da41f5e1986fcfeedf53939d3a9.jpg",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} to-transparent bg-opacity-10 rounded-xl flex items-center justify-center mb-4`}
                  >
                    {React.cloneElement(feature.icon, {
                      className: "w-6 h-6 text-[#4CAF50]",
                    })}
                  </div>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="rounded-xl mb-4 w-full transition-transform group-hover:scale-105"
                  />
                  <h3 className="text-xl font-bold text-[#333333] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 bg-gradient-to-r from-[#4CAF50] to-[#2196F3]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of teams who have already improved their productivity
            with ManageIQ
          </p>
          <button className="px-8 py-4 bg-white text-[#4CAF50] rounded-full text-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2 mx-auto">
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/integrations"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/updates"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Updates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/documentation"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guides"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    to="/api"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    to="/compliance"
                    className="text-gray-600 hover:text-[#4CAF50]"
                  >
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-transparent bg-clip-text mb-4 md:mb-0">
                ManageIQ
              </div>
              <div className="text-gray-600 text-sm">
                © 2024 ManageIQ. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;