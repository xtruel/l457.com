// Fill these values from your Firebase project settings (Web app)
// You can keep this file locally and avoid committing real values if you prefer.
window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  // Optional: measurementId: "G-XXXXXX"
};

// Admin email whitelist (only these emails can access the Admin upload panel)
window.ALLOWED_ADMIN_EMAILS = [
  "you@example.com" // replace with your email(s)
];

// Local admin (for local development only). Do NOT commit real secrets.
// This lets you unlock the Admin form without Google sign-in when testing locally.
window.LOCAL_ADMIN = {
  username: "truel",
  password: "12345/////"
};