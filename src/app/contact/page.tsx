"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subscribeNewsletter: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "", subscribeNewsletter: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="bg-deepBlue min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-5xl text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-slate-400 text-lg font-light mb-12">
              Our concierge team is available 24/7 to assist with your
              inquiries. Whether you are planning a honeymoon or a corporate
              retreat, we are here to help.
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <Mail className="text-gold mt-1" />
                <div>
                  <h4 className="text-white font-semibold">Email Us</h4>
                  <p className="text-slate-400">Hello@natlaupa.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="text-gold mt-1" />
                <div>
                  <h4 className="text-white font-semibold">Call Us</h4>
                  <p className="text-slate-400">+33 7 75 74 38 75</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="text-gold mt-1" />
                <div>
                  <h4 className="text-white font-semibold">Visit Us</h4>
                  <p className="text-slate-400">
                    29 RUE DU PONT 92200
                    <br />
                    NEUILLY-SUR-SEINE
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-midnight/50 p-8 border border-white/5 rounded-sm backdrop-blur-sm"
          >
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
                  <CheckCircle className="text-gold" size={32} />
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">
                  Message Received
                </h3>
                <p className="text-slate-400 mb-6">
                  Our concierge team will contact you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-gold hover:underline text-sm uppercase tracking-widest"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-white text-sm uppercase tracking-wide mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm uppercase tracking-wide mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm uppercase tracking-wide mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm uppercase tracking-wide mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="How can we assist you?"
                  />
                </div>
                <div>
                  <label className="inline-flex items-center text-white text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4 text-gold bg-deepBlue border-white/10 focus:ring-gold focus:ring-2 focus:outline-none transition-colors rounded"
                    />
                    <span className="ml-2">
                      Subscribe to our newsletter for exclusive offers
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold text-deepBlue font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
