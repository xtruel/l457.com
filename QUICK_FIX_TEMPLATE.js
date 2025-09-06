// 🚀 QUICK FIX: Replace firebase-config.js content with this template
// Just fill in your Firebase project details and the publish button will work!

// Step 1: Go to https://console.firebase.google.com
// Step 2: Create project → Enable Firestore + Auth (Google)
// Step 3: Project Settings → Web app → Copy config
// Step 4: Replace the values below with your real Firebase config

window.FIREBASE_CONFIG = {
  apiKey: "AIza...", // Replace with your API key from Firebase
  authDomain: "your-project-id.firebaseapp.com", // Replace your-project-id
  projectId: "your-project-id", // Replace with your project ID
  storageBucket: "your-project-id.appspot.com", // Replace your-project-id
  messagingSenderId: "123456789", // Replace with your sender ID
  appId: "1:123456789:web:abc123def456" // Replace with your app ID
};

// Step 5: Replace with YOUR Google email address
window.ALLOWED_ADMIN_EMAILS = [
  "your-email@gmail.com" // The email you'll use to sign in
];

// Step 6: REMOVE this section for security (comment it out):
/*
window.LOCAL_ADMIN = {
  username: "truel",
  password: "12345////"
};
*/

// Step 7: Save this file as firebase-config.js
// Step 8: Push to git → Netlify will auto-deploy
// Step 9: Test at https://l457.com/#/admin

// 🎉 Your publish button will now work!