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
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

const keyBenefits = [
  {
    number: "01",
    icon: Bell,
    title: "Regular Deal Alerts",
    description:
      "Receive instant notifications for room offers, flash sales and exclusive packages, empower your clients with the best available experiences and respond with agility to market shifts.",
  },
  {
    number: "02",
    icon: Tag,
    title: "Negotiated Rates & Perks",
    description:
      "Leverage below-market pricing and complimentary add-ons to craft irresistibly upscale stays that reinforce your reputation for excellence and delight every guest.",
  },
  {
    number: "03",
    icon: DollarSign,
    title: "High-Yield Commissions",
    description:
      "Capture commissions on every booking, turning your sales efforts into a lucrative revenue stream while maintaining premium service standards.",
  },
  {
    number: "04",
    icon: Briefcase,
    title: "Sales Toolkit",
    description:
      "Access ready-to-use marketing assets, email templates and pitch decks—streamline your outreach, maintain brand consistency and close deals with confidence.",
  },
];

const additionalFeatures = [
  "Dedicated partnership manager",
  "Priority support channel",
  "Real-time inventory access",
  "Co-branded marketing materials",
  "Performance analytics dashboard",
  "Training and onboarding support",
];

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
      const response = await fetch(
        "http://localhost:5000/api/v1/partnership-applications",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

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
              Elevate your hotel's potential with precision pricing & exclusive reach
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-300 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
            >
              Unleash the full value of every room night with Natlaupa's luxury-grade revenue management. We marry advanced analytics and white-glove service to drive profit and prestige in perfect harmony.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-3 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
              >
                Apply for Partnership
                <ArrowRight size={18} />
              </button>
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
                                <span className="font-medium capitalize">{detail.field}:</span> {detail.message}
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
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gold text-deepBlue font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
