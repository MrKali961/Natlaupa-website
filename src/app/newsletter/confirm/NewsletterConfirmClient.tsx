"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MailCheck, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type State = "missing" | "loading" | "success" | "error";

export default function NewsletterConfirmClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<State>(token ? "loading" : "missing");
  const [errorMessage, setErrorMessage] = useState("");

  // The server matches on { confirmToken, confirmedAt: null }, so a second call
  // with the same token is a hard 404. React StrictMode runs effects twice in
  // development, so the guard is set synchronously BEFORE the await — never in
  // a `.then`, or the second run fires before the first resolves.
  const hasFired = useRef(false);

  useEffect(() => {
    if (!token) return;
    if (hasFired.current) return;
    hasFired.current = true;

    let cancelled = false;

    const confirm = async () => {
      try {
        const response = await fetch(`${API_URL}/newsletters/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          // 404 is the server's answer for both "unknown token" and "already
          // confirmed" — it cannot tell them apart, so neither can the copy.
          const data = await response.json().catch(() => null);
          throw new Error(
            response.status === 404 || response.status === 400
              ? "Ce lien de confirmation n'est plus valide."
              : data?.error?.message || data?.message || "Une erreur est survenue."
          );
        }

        if (!cancelled) setState("success");
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(
          err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer."
        );
        setState("error");
      }
    };

    void confirm();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-10"
      >
        <div className="w-14 h-14 mx-auto mb-8 rounded-full bg-gold/10 flex items-center justify-center">
          <Loader2 className="text-gold animate-spin" size={26} />
        </div>
        <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Newsletter</p>
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-4">
          Confirmation en cours
        </h1>
        <div className="w-12 h-px bg-gold/40 mx-auto mb-4" />
        <p className="text-slate-400 text-sm leading-relaxed">
          Nous validons votre adresse. Un instant&hellip;
        </p>
      </motion.div>
    );
  }

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
        <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Newsletter</p>
        <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">
          Votre place est confirmée
        </h2>
        <div className="w-12 h-px bg-gold/40 mx-auto mb-5" />
        <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
          Bienvenue parmi nous. Vous recevrez désormais nos adresses en
          avant-première&nbsp;: maisons rares, séjours choisis un à un, et les
          quelques lieux que nous gardons habituellement pour nos proches.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/hotels"
            className="w-full max-w-xs bg-gold text-noir font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors duration-300"
          >
            Découvrir nos maisons
          </Link>
          <Link
            href="/"
            className="text-gold text-sm uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </motion.div>
    );
  }

  // "missing" and "error" share the same shell — only the message differs.
  const isMissingToken = state === "missing";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <div className="w-14 h-14 mx-auto mb-8 rounded-full bg-gold/10 flex items-center justify-center">
        <MailCheck className="text-gold" size={26} />
      </div>
      <p className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Newsletter</p>
      <h1 className="font-serif text-3xl md:text-4xl text-white mb-4">
        {isMissingToken ? "Lien incomplet" : "Confirmation impossible"}
      </h1>
      <div className="w-12 h-px bg-gold/40 mx-auto mb-5" />

      <div className="flex items-start gap-3 p-4 mb-6 text-left bg-red-500/10 border border-red-500/20 rounded-sm text-red-400 text-sm">
        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
        <span>
          {isMissingToken
            ? "Ce lien ne contient pas de code de confirmation. Ouvrez-le directement depuis l'email que nous vous avons envoyé."
            : errorMessage || "Une erreur est survenue. Veuillez réessayer."}
        </span>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
        {isMissingToken
          ? "Le lien complet se trouve dans le message intitulé « Confirm Your Newsletter Subscription »."
          : "Il se peut que vous ayez déjà confirmé votre inscription — dans ce cas, tout est en ordre et vous êtes bien des nôtres. Sinon, inscrivez-vous à nouveau depuis notre site et un nouveau lien vous parviendra."}
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
