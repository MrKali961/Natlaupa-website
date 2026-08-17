import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import UnsubscribeClient from "./UnsubscribeClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Se désinscrire | Natlaupa",
  description: "Désinscrivez-vous de la newsletter Natlaupa.",
  alternates: { canonical: "/unsubscribe" },
  robots: { index: false, follow: false },
};

function UnsubscribeFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="text-gold animate-spin" size={28} />
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <>
      <main className="bg-noir min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-midnight/50 border border-white/5 rounded-sm p-8 md:p-10 backdrop-blur-sm">
            <Suspense fallback={<UnsubscribeFallback />}>
              <UnsubscribeClient />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
