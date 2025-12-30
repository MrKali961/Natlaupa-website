"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Bell,
  Tag,
  DollarSign,
  Briefcase,
  ArrowRight,
  CheckCircle,
  X,
  ShieldCheck,
  Loader2,
  Download,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

const keyBenefits = [
  {
    number: "01",
    icon: DollarSign,
    title: "Revenue Optimization",
    description:
      "Unlock your hotel's full potential with cutting-edge revenue management strategies. Our expert team leverages advanced analytics to maximize profitability and strengthen your overall performance in the luxury market.",
  },
  {
    number: "02",
    icon: Briefcase,
    title: "Complete Distribution Strategy",
    description:
      "Access an all-in-one solution covering distribution, website development, online booking engines, and operational consulting. Streamline your processes and boost your online presence with industry-leading expertise.",
  },
  {
    number: "03",
    icon: Bell,
    title: "24/7 Expert Support",
    description:
      "Benefit from round-the-clock access to talented tourism-industry professionals across 3 continents. Our dedicated team manages a portfolio of over 60 hotels with proven results and unwavering commitment to your success.",
  },
  {
    number: "04",
    icon: Tag,
    title: "Risk-Free Partnership",
    description:
      "Start with confidence through our 6-month trial period with best price guarantee and contract cancellation without penalty. Experience the Natlaupa difference with zero risk and maximum flexibility.",
  },
];

const additionalFeatures = [
  "Operational audit & consulting",
  "Owner representation services",
  "Digital identity creation & brand redesign",
  "Social media management & SEO/SEM",
  "Performance analytics & reporting",
  "Global network across 10 countries",
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ValidationError {
  field: string;
  message: string;
}

interface ErrorResponse {
  code: string;
  message: string;
  details?: ValidationError[];
}

export default function ForHotels() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<ErrorResponse | null>(null);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showLanguageButtons, setShowLanguageButtons] = useState(false);
  const [formData, setFormData] = useState({
    contactName: "",
    hotelName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch(`${API_URL}/partnership-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        // Set the error object from the API response
        if (data.error) {
          setFormError(data.error);
        } else {
          setFormError({
            code: "APP",
            message: "Failed to submit application",
          });
        }
        return;
      }

      setFormSubmitted(true);
      setFormData({
        contactName: "",
        hotelName: "",
        email: "",
        phone: "",
        message: "",
      });

      setTimeout(() => {
        setIsModalOpen(false);
        setFormSubmitted(false);
      }, 3000);
    } catch (err) {
      setFormError({
        code: "APP",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      // First submit to backend
      const response = await fetch(`${API_URL}/partnership-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error) {
          setFormError(data.error);
        } else {
          setFormError({
            code: "APP",
            message: "Failed to submit application",
          });
        }
        return;
      }

      // Format WhatsApp message
      const message = `🏨 *HOTEL PARTNERSHIP APPLICATION*

*Contact Name:* ${formData.contactName}
*Hotel/Company:* ${formData.hotelName}
*Email:* ${formData.email}
*Phone:* ${formData.phone || "Not provided"}

*Message:*
${formData.message}

---
Submitted via Natlaupa Website`;

      // Redirect to WhatsApp
      const whatsappNumber = "33775743875"; // +33 7 75 74 38 75
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank");

      // Reset form and close modal
      setFormSubmitted(true);
      setFormData({
        contactName: "",
        hotelName: "",
        email: "",
        phone: "",
        message: "",
      });

      setTimeout(() => {
        setIsModalOpen(false);
        setFormSubmitted(false);
      }, 2000);
    } catch (err) {
      setFormError({
        code: "APP",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lock scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      // Pause Lenis smooth scroll if active
      if (window.lenis) {
        window.lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      // Resume Lenis smooth scroll
      if (window.lenis) {
        window.lenis.start();
      }
    }

    return () => {
      document.body.style.overflow = "";
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isModalOpen]);

  // Show sticky button after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyButton(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <main className="bg-deepBlue min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Building2 className="text-gold" size={28} />
              <span className="text-gold text-sm uppercase tracking-[0.3em]">
                For Hotels
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-8"
            >
              Elevate your hotel's potential with precision pricing & exclusive
              reach
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-300 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
            >
              Unleash the full value of every room night with Natlaupa's
              luxury-grade revenue management. We marry advanced analytics and
              white-glove service to drive profit and prestige in perfect
              harmony.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-3 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
              >
                Contact Us
                <ArrowRight size={18} />
              </button>

              {/* Animated Split Download Button */}
              <AnimatePresence mode="wait">
                {!showLanguageButtons ? (
                  <motion.button
                    key="download-main"
                    onClick={() => setShowLanguageButtons(true)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-gold text-gold px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold hover:text-deepBlue transition-colors"
                  >
                    <Download size={18} />
                    Download Brochure
                  </motion.button>
                ) : (
                  <motion.div
                    key="download-split"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2"
                  >
                    <motion.a
                      href="/brochure-hotels-en.pdf"
                      download
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-gold text-gold px-6 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold hover:text-deepBlue transition-colors"
                    >
                      <Download size={18} />
                      EN
                    </motion.a>
                    <motion.a
                      href="/brochure-hotels-fr.pdf"
                      download
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-gold text-gold px-6 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold hover:text-deepBlue transition-colors"
                    >
                      <Download size={18} />
                      FR
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-gold text-sm uppercase tracking-[0.3em] mb-4 block">
                Why Partner With Us
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-white">
                Key Benefits
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {keyBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 border border-white/10 rounded-sm hover:border-gold/30 transition-colors group"
                >
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <span className="font-serif text-5xl text-gold/20 group-hover:text-gold/40 transition-colors">
                        {benefit.number}
                      </span>
                    </div>
                    <div>
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                        <benefit.icon className="text-gold" size={24} />
                      </div>
                      <h3 className="font-serif text-2xl text-white mb-4 group-hover:text-gold transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-midnight/50">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl text-white text-center mb-16"
            >
              What You Get
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 border border-white/5 rounded-sm hover:border-gold/20 transition-colors"
                >
                  <CheckCircle className="text-gold flex-shrink-0" size={20} />
                  <span className="text-slate-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl text-white text-center mb-16"
            >
              How It Works
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Apply",
                  desc: "Submit your partnership application",
                },
                {
                  step: "02",
                  title: "Get Verified",
                  desc: "Our team reviews your credentials",
                },
                {
                  step: "03",
                  title: "Start Earning",
                  desc: "Access deals and earn commissions",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-gold flex items-center justify-center">
                    <span className="font-serif text-xl text-gold">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-midnight/50 to-deepBlue">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl text-white mb-6"
            >
              Ready to Elevate Your Business?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 mb-8"
            >
              No payment required. Submit your application and our partnerships
              team will contact you within 48 hours.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-3 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
              >
                Apply Now
                <ArrowRight size={18} />
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 border border-gold text-gold px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold hover:text-deepBlue transition-colors"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-deepBlue border border-white/10 p-8 md:p-10 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
              data-lenis-prevent
            >
              <button
                title="Close"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
                    <ShieldCheck className="text-gold" size={32} />
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-2">
                    Application Received
                  </h3>
                  <p className="text-slate-400">
                    Our partnerships team will contact you within 48 hours.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="text-gold" size={24} />
                    <h3 className="font-serif text-2xl text-white">
                      Partnership Application
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-8">
                    Complete the form below and our team will review your
                    application.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-sm space-y-2">
                        <p className="font-medium">{formError.message}</p>
                        {formError.details && formError.details.length > 0 && (
                          <ul className="space-y-1 pl-4">
                            {formError.details.map((detail, idx) => (
                              <li key={idx} className="text-xs list-disc">
                                <span className="font-medium capitalize">
                                  {detail.field}:
                                </span>{" "}
                                {detail.message}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2">
                        Hotel / Company Name
                      </label>
                      <input
                        type="text"
                        name="hotelName"
                        value={formData.hotelName}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="Luxury Hotel & Resort"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2">
                        Tell Us About Your Business
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        required
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="Describe your company, clientele, and how you envision our partnership..."
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleWhatsAppSubmit}
                        disabled={isSubmitting}
                        className="w-14 h-14 flex-shrink-0 bg-transparent border-2 border-[#25D366] text-[#25D366] rounded-full hover:bg-[#25D366] hover:text-white hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        title="Send via WhatsApp"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <MessageCircle size={24} />
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Sticky Download Button with Language Options */}
      <AnimatePresence>
        {showStickyButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-8 right-8 z-40"
          >
            {/* Language Options Menu */}
            <AnimatePresence>
              {showLanguageMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full right-0 mb-2 bg-midnight border border-gold/30 rounded-lg shadow-2xl overflow-hidden"
                >
                  <a
                    href="/brochure-hotels-en.pdf"
                    download
                    className="block px-6 py-3 text-white hover:bg-gold hover:text-deepBlue transition-colors text-sm font-bold uppercase tracking-wider"
                  >
                    English
                  </a>
                  <a
                    href="/brochure-hotels-fr.pdf"
                    download
                    className="block px-6 py-3 text-white hover:bg-gold hover:text-deepBlue transition-colors text-sm font-bold uppercase tracking-wider border-t border-gold/20"
                  >
                    Français
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gold text-deepBlue p-4 rounded-full shadow-2xl hover:bg-white transition-colors group"
              title="Download Brochure"
            >
              <Download size={24} className="group-hover:animate-bounce" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
