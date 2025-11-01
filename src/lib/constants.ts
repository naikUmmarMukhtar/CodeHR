export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const API_BASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

export const OFFICE_COORDS = { lat: 33.902872, lng: 74.925053 };
export const OFFICE_RADIUS_METERS = 200;
export const CHECKIN_START = { hour: 9, minute: 45 };
export const CHECKIN_END = { hour: 10, minute: 15 };
export const CHECKOUT_MIN = { hour: 17, minute: 0 };

export const FIXED_HOLIDAYS = ["2025-01-01", "2025-08-15", "2025-12-25"];

export const WEEKEND_DAYS = [0, 6]; // 0 = Sunday, 6 = Saturday
