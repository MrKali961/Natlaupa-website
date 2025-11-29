/**
 * Tracking Service
 * Handles user interaction tracking for personalized recommendations
 */

// Storage keys
const SESSION_KEY = 'natlaupa_session_id';
const USER_DATA_KEY = 'natlaupa_user_data';
const CONSENT_KEY = 'natlaupa_cookie_consent';

// Types
export interface MoodPreference {
  moodId: string;
  score: number;
}

export interface RecentView {
  hotelId: string;
  timestamp: number;
  moodContext?: string;
}

export interface LocalUserData {
  sessionId: string;
  userId?: string;
  moodPreferences: Record<string, number>;
  recentViews: RecentView[];
  lastUpdated: number;
}

export interface ConsentState {
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
  timestamp: number;
}

// Initialize or get session ID
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

// Get consent state
export function getConsentState(): ConsentState | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(CONSENT_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as ConsentState;
  } catch {
    return null;
  }
}

// Check if specific consent type is given
export function hasConsent(type: 'analytics' | 'personalization'): boolean {
  const consent = getConsentState();
  return consent ? consent[type] : false;
}

// Get local user data
export function getLocalUserData(): LocalUserData {
  if (typeof window === 'undefined') {
    return {
      sessionId: '',
      moodPreferences: {},
      recentViews: [],
      lastUpdated: 0
    };
  }

  const stored = localStorage.getItem(USER_DATA_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as LocalUserData;
    } catch {
      // Reset if corrupted
    }
  }

  // Initialize new user data
  const newData: LocalUserData = {
    sessionId: getOrCreateSessionId(),
    moodPreferences: {},
    recentViews: [],
    lastUpdated: Date.now()
  };
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(newData));
  return newData;
}

// Save local user data
function saveLocalUserData(data: LocalUserData): void {
  if (typeof window === 'undefined') return;
  data.lastUpdated = Date.now();
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
}

// Track hotel view
export async function trackHotelView(hotelId: string, moodContext?: string): Promise<void> {
  if (!hasConsent('personalization')) return;

  const userData = getLocalUserData();

  // Add to recent views (keep last 50)
  userData.recentViews = [
    { hotelId, timestamp: Date.now(), moodContext },
    ...userData.recentViews.filter(v => v.hotelId !== hotelId)
  ].slice(0, 50);

  saveLocalUserData(userData);

  // Send to server if analytics consent given
  if (hasConsent('analytics')) {
    await sendTrackingEvent({
      action: 'view',
      hotelId,
      moodContext,
      sessionId: userData.sessionId
    });
  }
}

// Track hotel click
export async function trackHotelClick(hotelId: string, moodContext?: string): Promise<void> {
  if (!hasConsent('personalization')) return;

  const userData = getLocalUserData();

  // Update recent views with click
  const viewIndex = userData.recentViews.findIndex(v => v.hotelId === hotelId);
  if (viewIndex !== -1) {
    userData.recentViews[viewIndex].timestamp = Date.now();
  } else {
    userData.recentViews = [
      { hotelId, timestamp: Date.now(), moodContext },
      ...userData.recentViews
    ].slice(0, 50);
  }

  saveLocalUserData(userData);

  // Send to server
  if (hasConsent('analytics')) {
    await sendTrackingEvent({
      action: 'click',
      hotelId,
      moodContext,
      sessionId: userData.sessionId
    });
  }
}

// Track mood selection
export async function trackMoodSelection(moodId: string): Promise<void> {
  if (!hasConsent('personalization')) return;

  const userData = getLocalUserData();

  // Increment mood preference score
  userData.moodPreferences[moodId] = (userData.moodPreferences[moodId] || 0) + 1;

  saveLocalUserData(userData);

  // Send to server
  if (hasConsent('analytics')) {
    await sendTrackingEvent({
      action: 'mood_select',
      hotelId: moodId, // Using hotelId field for moodId
      moodContext: moodId,
      sessionId: userData.sessionId
    });
  }
}

// Get user mood preferences (normalized scores)
export function getUserMoodPreferences(): MoodPreference[] {
  const userData = getLocalUserData();
  const entries = Object.entries(userData.moodPreferences);

  if (entries.length === 0) return [];

  // Find max score for normalization
  const maxScore = Math.max(...entries.map(([, score]) => score));

  return entries.map(([moodId, score]) => ({
    moodId,
    score: maxScore > 0 ? score / maxScore : 0
  })).sort((a, b) => b.score - a.score);
}

// Get recently viewed hotels
export function getRecentViews(limit = 10): RecentView[] {
  const userData = getLocalUserData();
  return userData.recentViews.slice(0, limit);
}

// Get top mood for personalization
export function getTopMood(): string | null {
  const preferences = getUserMoodPreferences();
  return preferences.length > 0 ? preferences[0].moodId : null;
}

// Send tracking event to server
async function sendTrackingEvent(event: {
  action: string;
  hotelId: string;
  moodContext?: string;
  sessionId: string;
}): Promise<void> {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
  } catch (error) {
    console.error('Failed to send tracking event:', error);
  }
}

// Clear all tracking data (for privacy)
export function clearTrackingData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(SESSION_KEY);
}

// Export tracking hook for React components
export function useTracking() {
  return {
    trackHotelView,
    trackHotelClick,
    trackMoodSelection,
    getUserMoodPreferences,
    getRecentViews,
    getTopMood,
    hasConsent,
    clearTrackingData
  };
}
