"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Linkedin,
  Facebook,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { FOOTER_LINKS } from "@/lib/constants";

const Footer: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok && !data.success) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setIsSubscribed(true);
      setEmail("");
      setFirstName("");
      setLastName("");

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-black">
      {/* Top Section - Brand & Social */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <Image
                src="/natlaupa-logo-white.svg"
                alt="Natlaupa"
                width={200}
                height={80}
                className="object-contain mx-auto md:mx-0 mb-4"
              />
              <div className="w-16 h-px bg-gold mx-auto md:mx-0 mb-4" />
              <p className="text-slate-500 text-sm tracking-widest uppercase">
                Redefining the Art of Stay
              </p>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-6"
            >
              {[
                { icon: Instagram, href: "https://www.instagram.com/natlaupaa", label: "Instagram" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/natlaupa/", label: "LinkedIn" },
                { icon: Facebook, href: "https://www.facebook.com/share/1BwjBfNUpp/?mibextid=wwXIfr", label: "Facebook" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-slate-500 hover:text-gold transition-colors duration-300"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Explore */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <h4 className="text-gold text-xs uppercase tracking-[0.2em] mb-4">
                Explore
              </h4>
              <nav className="flex flex-col gap-2">
                {FOOTER_LINKS.explore.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className="text-slate-400 text-sm hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center md:text-left"
            >
              <h4 className="text-gold text-xs uppercase tracking-[0.2em] mb-4">
                Company
              </h4>
              <nav className="flex flex-col gap-2">
                {FOOTER_LINKS.company.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className="text-slate-400 text-sm hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>

            {/* Programs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center md:text-left"
            >
              <h4 className="text-gold text-xs uppercase tracking-[0.2em] mb-4">
                Programs
              </h4>
              <nav className="flex flex-col gap-2">
                {FOOTER_LINKS.programs.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className="text-slate-400 text-sm hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto text-center"
          >
            <p className="text-slate-500 text-sm uppercase tracking-widest mb-8">
              Subscribe for exclusive access
            </p>
            {isSubscribed ? (
              <div className="flex items-center justify-center gap-2 py-4 text-gold">
                <Check size={20} strokeWidth={1.5} />
                <span className="text-sm tracking-wide">
                  Thank you for subscribing!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-b border-slate-700 focus-within:border-gold transition-colors duration-300">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      disabled={isSubmitting}
                      className="w-full bg-transparent py-4 text-white text-center text-sm tracking-wide focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
                    />
                  </div>
                  <div className="border-b border-slate-700 focus-within:border-gold transition-colors duration-300">
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      disabled={isSubmitting}
                      className="w-full bg-transparent py-4 text-white text-center text-sm tracking-wide focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="flex border-b border-slate-700 focus-within:border-gold transition-colors duration-300">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                    className="flex-1 bg-transparent py-4 text-white text-center text-sm tracking-wide focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 text-gold hover:text-white transition-colors duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2
                        size={20}
                        strokeWidth={1.5}
                        className="animate-spin"
                      />
                    ) : (
                      <ArrowRight size={20} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="text-red-400 text-xs mt-2 text-center">
                    {error}
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Powered By Section */}
      <div className="bg-deepBlue py-6">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            {/* Gold Line with Diamond */}
            <div className="flex items-center gap-4 w-full max-w-xs">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-gold/50" />
              <div className="w-1.5 h-1.5 bg-gold rotate-45" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/30 to-gold/50" />
            </div>

            {/* Text */}
            <a
              href="https://theelitessolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors duration-300"
            >
              <span className="text-[10px] uppercase tracking-[0.3em]">
                Powered by
              </span>
              <span className="font-serif text-xs tracking-[0.15em] text-gold/70 group-hover:text-gold transition-colors duration-300">
                THE ELITES SOLUTIONS
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
