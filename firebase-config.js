// Firebase Configuration
// Replace these placeholder values with your actual Firebase project config
window.FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Authorized admin emails - only these emails can access admin features
window.ALLOWED_ADMIN_EMAILS = [
    "truel3000lofi@gmail.com"
];

// Local development admin (comment out for production)
// window.LOCAL_ADMIN = {
//     enabled: true,
//     password: "admin123"
// };