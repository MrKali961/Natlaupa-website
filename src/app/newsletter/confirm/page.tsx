import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import NewsletterConfirmClient from "./NewsletterConfirmClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Confirmer votre inscription | Natlaupa",
  description: "Confirmez votre inscription à la newsletter Natlaupa.",
  alternates: { canonical: "/newsletter/confirm" },
  robots: { index: false, follow: false },
};

function ConfirmFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="text-gold animate-spin" size={28} />
    </div>
  );
}

export default function NewsletterConfirmPage() {
  return (
    <>
      <main className="bg-noir min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-midnight/50 border border-white/5 rounded-sm p-8 md:p-10 backdrop-blur-sm">
            <Suspense fallback={<ConfirmFallback />}>
              <NewsletterConfirmClient />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
