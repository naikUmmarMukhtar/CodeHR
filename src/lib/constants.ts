export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const API_BASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

// export const OFFICE_COORDS = { lat: 33.902872, lng: 74.925053 };
export const OFFICE_COORDS = { lat: 33.999889, lng: 74.792602 };
export const OFFICE_RADIUS_METERS = 40;
export const CHECKIN_START = { hour: 9, minute: 45 };
export const CHECKIN_END = { hour: 10, minute: 15 };
export const CHECKOUT_MIN = { hour: 17, minute: 0 };

export const FIXED_HOLIDAYS = [
  "2025-01-01", // New Year
  "2025-01-26", // Republic Day
  "2025-02-26", // Maha Shivaratri
  "2025-03-31", // Ramzan (Id-ul-Fitr)
  "2025-04-18", // Good Friday
  "2025-05-01", // May Day
  "2025-06-06", // Id-ul Ad’ha (Bakrid)
  "2025-07-06", // Muharram
  "2025-08-15", // Independence Day
  "2025-10-02", // Gandhi Jayanti
  "2025-10-20", // Diwali (Bali Pratipada)
  "2025-12-25", // Christmas
];

export const WEEKEND_DAYS = [0, 6];
