import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Users, Zap, BarChart3, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans bg-neutral-50 text-neutral-900 overflow-x-hidden">
      {/* Refined Header - Better proportions and spacing */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <Link to="/" className="z-50">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-transparent bg-clip-text">
              ManageIQ
            </div>
          </Link>
          
          {/* Desktop Navigation - Better spacing */}
          <nav className="hidden md:flex items-center gap-4">
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-5 py-2 text-neutral-800 border border-neutral-200 rounded-full hover:border-emerald-500 hover:text-emerald-600 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full hover:shadow-lg hover:shadow-emerald-200 transition-all"
              >
                Sign Up
              </Link>
            </div>
          </nav>
          
          {/* Mobile menu button - Better positioning */}
          <button 
            className="md:hidden z-50 p-1 text-neutral-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          
          {/* Mobile Navigation - Cleaner layout */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "tween" }}
                className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center"
              >
                <nav className="flex flex-col items-center gap-6 text-xl">
                  <div className="flex flex-col gap-4 w-64">
                    <Link
                      to="/login"
                      className="px-8 py-3 text-center w-full border border-neutral-200 rounded-full hover:border-emerald-500 hover:text-emerald-600 transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-8 py-3 text-center w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Hero Section - Improved spacing and layout */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-full h-full">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-emerald-300/20 to-blue-300/20 rounded-full filter blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-blue-300/20 to-emerald-300/20 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="inline-block mb-4 px-3 py-1 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 text-emerald-700 rounded-full text-sm font-medium">
              Boost Your Productivity
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 mb-4 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-transparent bg-clip-text">
                {" "}Team's Work
              </span>
            </h1>
            <p className="text-lg text-neutral-600 mb-6 leading-relaxed max-w-lg">
              Streamline collaboration, boost efficiency, and achieve your goals with our 
              intelligent project management platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="group px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full inline-flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-200 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/demo"
                className="px-6 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-full inline-flex items-center gap-2 hover:border-emerald-500 hover:text-emerald-600 transition-all"
              >
                <span>Watch Demo</span>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative z-10"
          >
            <div className="relative">
              <img
                src="https://i.pinimg.com/736x/ef/bb/ab/efbbab44231c132a46cb53f5ed07289d.jpg"
                alt="Dashboard Preview"
                className="rounded-2xl shadow-2xl"
              />
              <motion.div 
                initial={{ x: 20, y: 20 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl"
              >
              </motion.div>
              <motion.div 
                initial={{ x: -20, y: -20 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-2 px-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-neutral-700">98% Completed</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Improved grid layout */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
              Everything you need in one place
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Powerful features to help your team stay organized and productive
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <CheckCircle2 />,
                title: "Task Management",
                description: "Create, assign, and track tasks with ease.",
                image: "https://i.pinimg.com/736x/79/8d/ee/798dee483f65c68361a23edfa80108c7.jpg",
                color: "from-emerald-500"
              },
              {
                icon: <Users />,
                title: "Team Collaboration",
                description: "Work together seamlessly with your team.",
                image: "https://i.pinimg.com/736x/0a/cb/43/0acb43236c05d256726d794e9647a13f.jpg",
                color: "from-blue-500"
              },
              {
                icon: <Zap />,
                title: "Real-time Updates",
                description: "Stay informed with instant notifications.",
                image: "https://i.pinimg.com/736x/06/aa/1b/06aa1ba930362df9ba3b845a76e94df3.jpg",
                color: "from-emerald-500"
              },
              {
                icon: <BarChart3 />,
                title: "Data Visualization",
                description: "Make decisions with powerful analytics.",
                image: "https://i.pinimg.com/736x/4c/9f/0d/4c9f0da41f5e1986fcfeedf53939d3a9.jpg",
                color: "from-blue-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="group h-full"
              >
                <div className="bg-white rounded-2xl overflow-hidden h-full shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-md">
                      <div className={`bg-gradient-to-r ${feature.color} to-transparent bg-clip-text text-transparent`}>
                        {React.cloneElement(feature.icon, { className: "w-5 h-5" })}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Refined layout */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 -z-10"></div>
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/06/aa/1b/06aa1ba930362df9ba3b845a76e94df3.jpg')] opacity-10 mix-blend-overlay -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-3 px-4 py-1 bg-white/20 backdrop-blur-sm text-gray-500 rounded-full text-sm font-medium">
              Limited Time Offer
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-500 mb-4">
              Ready to transform your workflow?
            </h2>
            <p className="text-lg mb-6 text-gray-500/90 max-w-xl mx-auto">
              Join thousands of teams who have already improved their productivity with our platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="group px-6 py-3 bg-white text-emerald-600 rounded-full font-medium hover:shadow-lg transition-all inline-flex items-center gap-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-3 bg-transparent border border-white text-gray-500 rounded-full font-medium hover:bg-white/10 transition-all inline-flex items-center gap-2">
                <span>Learn More</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Refined spacing */}
      <footer className="bg-neutral-900 text-neutral-400">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 text-transparent bg-clip-text mb-3 md:mb-0">
              ManageIQ
            </div>
            <div className="text-neutral-500 text-sm">
              © 2025 ManageIQ. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;