'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, BarChart3, Sparkles, X, Check, Settings } from 'lucide-react';

interface ConsentState {
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
  timestamp: number;
}

const CONSENT_STORAGE_KEY = 'natlaupa_cookie_consent';

const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    essential: true,
    analytics: false,
    personalization: false,
    timestamp: 0
  });

  // Check for existing consent on mount
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ConsentState;
        setConsent(parsed);
        setShowBanner(false);
      } catch {
        setShowBanner(true);
      }
    } else {
      // Small delay before showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = async (newConsent: ConsentState) => {
    const consentWithTimestamp = { ...newConsent, timestamp: Date.now() };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentWithTimestamp));
    setConsent(consentWithTimestamp);
    setShowBanner(false);
    setShowCustomize(false);

    // Save to database (fire and forget)
    try {
      const sessionId = getOrCreateSessionId();
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          ...newConsent
        })
      });
    } catch (error) {
      console.error('Failed to save consent to server:', error);
    }
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      personalization: true,
      timestamp: Date.now()
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      essential: true,
      analytics: false,
      personalization: false,
      timestamp: Date.now()
    });
  };

  const handleSaveCustom = () => {
    saveConsent(consent);
  };

  const consentOptions = [
    {
      key: 'essential' as const,
      label: 'Essential',
      description: 'Required for the website to function. Cannot be disabled.',
      icon: Shield,
      required: true
    },
    {
      key: 'analytics' as const,
      label: 'Analytics',
      description: 'Help us understand how visitors interact with our website.',
      icon: BarChart3,
      required: false
    },
    {
      key: 'personalization' as const,
      label: 'Personalization',
      description: 'Enable personalized hotel recommendations based on your preferences.',
      icon: Sparkles,
      required: false
    }
  ];

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-midnight/95 backdrop-blur-lg border border-gold/20 rounded-sm shadow-2xl overflow-hidden">
              {/* Main Banner */}
              <AnimatePresence mode="wait">
                {!showCustomize ? (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      {/* Icon & Text */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                            <Cookie className="text-gold" size={20} />
                          </div>
                          <h3 className="font-serif text-xl text-white">Your Privacy Matters</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          We use cookies to enhance your browsing experience and provide personalized
                          hotel recommendations. Choose your preferences below.
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setShowCustomize(true)}
                          className="px-5 py-3 text-sm font-medium text-gold border border-gold/30 rounded-sm hover:border-gold hover:bg-gold/10 transition-all flex items-center justify-center gap-2"
                        >
                          <Settings size={16} />
                          Customize
                        </button>
                        <button
                          onClick={handleRejectAll}
                          className="px-5 py-3 text-sm font-medium text-slate-400 border border-white/10 rounded-sm hover:border-white/30 hover:text-white transition-all"
                        >
                          Reject All
                        </button>
                        <button
                          onClick={handleAcceptAll}
                          className="px-5 py-3 text-sm font-bold text-deepBlue bg-gold rounded-sm hover:bg-white transition-all"
                        >
                          Accept All
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Customize Panel */
                  <motion.div
                    key="customize"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif text-xl text-white">Cookie Preferences</h3>
                      <button
                        onClick={() => setShowCustomize(false)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Options */}
                    <div className="space-y-4 mb-6">
                      {consentOptions.map((option) => {
                        const Icon = option.icon;
                        const isEnabled = consent[option.key];

                        return (
                          <div
                            key={option.key}
                            className={`p-4 border rounded-sm transition-all ${
                              isEnabled
                                ? 'border-gold/30 bg-gold/5'
                                : 'border-white/10 bg-white/5'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isEnabled ? 'bg-gold/20' : 'bg-white/10'
                              }`}>
                                <Icon size={18} className={isEnabled ? 'text-gold' : 'text-slate-400'} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                  <h4 className={`font-medium ${isEnabled ? 'text-white' : 'text-slate-300'}`}>
                                    {option.label}
                                    {option.required && (
                                      <span className="ml-2 text-xs text-gold">(Required)</span>
                                    )}
                                  </h4>
                                  <button
                                    onClick={() => {
                                      if (!option.required) {
                                        setConsent(prev => ({
                                          ...prev,
                                          [option.key]: !prev[option.key]
                                        }));
                                      }
                                    }}
                                    disabled={option.required}
                                    className={`relative w-12 h-6 rounded-full transition-all ${
                                      isEnabled ? 'bg-gold' : 'bg-white/20'
                                    } ${option.required ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                                  >
                                    <span
                                      className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                                        isEnabled
                                          ? 'left-7 bg-deepBlue'
                                          : 'left-1 bg-white'
                                      }`}
                                    />
                                  </button>
                                </div>
                                <p className="text-slate-400 text-sm mt-1">{option.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={handleRejectAll}
                        className="px-5 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                      >
                        Reject All
                      </button>
                      <button
                        onClick={handleSaveCustom}
                        className="px-6 py-3 text-sm font-bold text-deepBlue bg-gold rounded-sm hover:bg-white transition-all flex items-center gap-2"
                      >
                        <Check size={16} />
                        Save Preferences
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function to get or create session ID
function getOrCreateSessionId(): string {
  const SESSION_KEY = 'natlaupa_session_id';
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

// Export helper for other components to check consent
export function getConsentState(): ConsentState | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as ConsentState;
  } catch {
    return null;
  }
}

export function hasConsent(type: 'analytics' | 'personalization'): boolean {
  const consent = getConsentState();
  return consent ? consent[type] : false;
}

export default CookieConsentBanner;
