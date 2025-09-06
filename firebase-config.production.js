// Production Firebase Configuration Template
// Copy this file to firebase-config.js and replace with your actual Firebase project values
// Get these values from Firebase Console → Project Settings → General → Your apps

window.FIREBASE_CONFIG = {
  // Replace with your Firebase project configuration
  apiKey: "AIzaSyC...", // Your Web API Key
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX" // Optional: Google Analytics
};

// Admin email whitelist - only these emails can access the admin panel
// Replace with your actual admin email addresses
window.ALLOWED_ADMIN_EMAILS = [
  "admin@l457.com", // Replace with your email
  // "additional-admin@domain.com" // Add more admins if needed
];

// Local development admin credentials
// IMPORTANT: This should be removed or commented out in production
// Uncomment only for local development
/*
window.LOCAL_ADMIN = {
  username: "admin",
  password: "dev-password"
};
*/

// Production environment check
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 Development mode detected');
  // Uncomment the LOCAL_ADMIN section above for local development
} else {
  console.log('🚀 Production mode - Firebase authentication required');
  // Ensure LOCAL_ADMIN is not defined in production
  if (window.LOCAL_ADMIN) {
    console.warn('⚠️ LOCAL_ADMIN should not be defined in production!');
    delete window.LOCAL_ADMIN;
  }
}