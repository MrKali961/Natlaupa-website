"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MailX, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type State = "idle" | "loading" | "success" | "error";

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleTokenUnsubscribe = async () => {
    setState("loading");
    setErrorMessage("");
    try {
      const response = await fetch(`${API_URL}/newsletters/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || data.message || "Une erreur est survenue.");
      }

      setState("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.");
      setState("error");
    }
  };

  const handleEmailUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrorMessage("");
    try {
      const response = await fetch(`${API_URL}/newsletters/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || data.message || "Une erreur est survenue.");
      }

      setState("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.");
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
          <CheckCircle className="text-gold" size={32} />
        </div>
        <h2 className="font-serif text-2xl text-white mb-3">
          Vous êtes désinscrit
        </h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          Votre désinscription est prise en compte immédiatement. Vous ne recevrez plus nos communications.
        </p>
        <Link
          href="/"
          className="text-gold text-sm uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4"
        >
          Retour à l&apos;accueil
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-14 h-14 mx-auto mb-8 rounded-full bg-gold/10 flex items-center justify-center"
      >
        <MailX className="text-gold" size={26} />
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-center mb-8"
      >
        <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Newsletter</p>
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-4">
          Se désinscrire
        </h1>
        <div className="w-12 h-px bg-gold/40 mx-auto mb-4" />
        <p className="text-slate-400 text-sm leading-relaxed">
          {token
            ? "Confirmez votre désinscription en cliquant sur le bouton ci-dessous. Cette action prend effet immédiatement."
            : "Saisissez votre adresse email pour vous désinscrire de notre newsletter."}
        </p>
      </motion.div>

      {/* Error state */}
      {state === "error" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-sm text-red-400 text-sm"
        >
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{errorMessage || "Une erreur est survenue. Veuillez réessayer."}</span>
        </motion.div>
      )}

      {/* With token: single confirmation button */}
      {token ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={handleTokenUnsubscribe}
            disabled={state === "loading"}
            className="w-full bg-gold text-deepBlue font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {state === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Traitement en cours&hellip;
              </>
            ) : (
              "Me désinscrire"
            )}
          </button>
          <p className="text-slate-600 text-xs text-center mt-4">
            Vous pouvez vous réinscrire à tout moment via notre site.
          </p>
        </motion.div>
      ) : (
        /* Without token: email input form */
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleEmailUnsubscribe}
          className="space-y-4"
        >
          <div>
            <label className="block text-white text-xs uppercase tracking-wide mb-2">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
              placeholder="votre@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={state === "loading"}
            className="w-full bg-gold text-deepBlue font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {state === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Traitement en cours&hellip;
              </>
            ) : (
              "Me désinscrire"
            )}
          </button>
          <p className="text-slate-600 text-xs text-center">
            Vous pouvez vous réinscrire à tout moment via notre site.
          </p>
        </motion.form>
      )}
    </>
  );
}
