#!/usr/bin/env node

/**
 * Firebase Setup Script
 * Helps configure Firebase for the blog application
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class FirebaseSetup {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  log(type, message) {
    const prefix = {
      error: '❌',
      warning: '⚠️',
      success: '✅',
      info: 'ℹ️'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} ${message}`);
  }

  async collectFirebaseConfig() {
    console.log('\n🔥 Firebase Configuration Setup');
    console.log('Please provide your Firebase project configuration.');
    console.log('You can find these values in Firebase Console → Project Settings → General → Your apps\n');

    const config = {};
    
    config.apiKey = await this.prompt('Enter your Firebase API Key: ');
    config.authDomain = await this.prompt('Enter your Auth Domain (project-id.firebaseapp.com): ');
    config.projectId = await this.prompt('Enter your Project ID: ');
    config.storageBucket = await this.prompt('Enter your Storage Bucket (project-id.appspot.com): ');
    config.messagingSenderId = await this.prompt('Enter your Messaging Sender ID: ');
    config.appId = await this.prompt('Enter your App ID: ');
    
    const measurementId = await this.prompt('Enter your Measurement ID (optional, press Enter to skip): ');
    if (measurementId.trim()) {
      config.measurementId = measurementId.trim();
    }

    return config;
  }

  async collectAdminEmails() {
    console.log('\n👤 Admin Configuration');
    const emails = [];
    
    while (true) {
      const email = await this.prompt(`Enter admin email ${emails.length + 1} (or press Enter to finish): `);
      if (!email.trim()) break;
      
      if (this.isValidEmail(email.trim())) {
        emails.push(email.trim());
        this.log('success', `Added admin email: ${email.trim()}`);
      } else {
        this.log('error', 'Invalid email format. Please try again.');
      }
    }
    
    if (emails.length === 0) {
      this.log('warning', 'No admin emails configured. You won\'t be able to access the admin panel.');
    }
    
    return emails;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  generateFirebaseConfig(config, adminEmails) {
    const measurementIdLine = config.measurementId 
      ? `  measurementId: "${config.measurementId}"`
      : '  // measurementId: "G-XXXXXXXXXX" // Optional: Add your Google Analytics measurement ID';

    const adminEmailsArray = adminEmails.length > 0
      ? adminEmails.map(email => `  "${email}"`).join(',\n')
      : '  "admin@yourdomain.com" // Replace with your admin email';

    return `// Firebase Configuration for LLLL467 Blog
// Generated on ${new Date().toISOString()}

window.FIREBASE_CONFIG = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket}",
  messagingSenderId: "${config.messagingSenderId}",
  appId: "${config.appId}",
${measurementIdLine}
};

// Admin email whitelist - only these emails can access the admin panel
window.ALLOWED_ADMIN_EMAILS = [
${adminEmailsArray}
];

// Local development admin credentials
// IMPORTANT: Remove or comment out in production
// Uncomment only for local development
/*
window.LOCAL_ADMIN = {
  username: "admin",
  password: "dev-password"
};
*/

// Environment check
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 Development mode detected');
  // You can uncomment LOCAL_ADMIN above for local development
} else {
  console.log('🚀 Production mode - Firebase authentication required');
  // Ensure LOCAL_ADMIN is not defined in production
  if (window.LOCAL_ADMIN) {
    console.warn('⚠️ LOCAL_ADMIN should not be defined in production!');
    delete window.LOCAL_ADMIN;
  }
}`;
  }

  generateFirestoreRules(adminEmails) {
    const adminEmailsArray = adminEmails.length > 0
      ? adminEmails.map(email => `          '${email}'`).join(',\n')
      : `          'admin@yourdomain.com' // Replace with your admin email`;

    return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Posts collection - public read, admin write
    match /posts/{postId} {
      // Allow anyone to read published posts
      allow read: if true;
      
      // Only allow authenticated admin users to write
      allow write: if request.auth != null && 
        request.auth.token.email in [
${adminEmailsArray}
        ];
    }
    
    // Usernames collection - for admin username management
    match /usernames/{username} {
      // Allow authenticated users to read usernames (for uniqueness check)
      allow read: if request.auth != null;
      
      // Only allow admin users to create/update usernames
      allow write: if request.auth != null && 
        request.auth.token.email in [
${adminEmailsArray}
        ];
    }
    
    // Admin metadata collection (optional)
    match /admin/{document} {
      // Only admin users can read/write admin metadata
      allow read, write: if request.auth != null && 
        request.auth.token.email in [
${adminEmailsArray}
        ];
    }
    
    // Site configuration (optional)
    match /config/{document} {
      // Public read for site configuration
      allow read: if true;
      
      // Only admin write
      allow write: if request.auth != null && 
        request.auth.token.email in [
${adminEmailsArray}
        ];
    }
    
    // Default deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;
  }

  async backupExistingConfig() {
    if (fs.existsSync('firebase-config.js')) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `firebase-config.backup.${timestamp}.js`;
      
      try {
        fs.copyFileSync('firebase-config.js', backupPath);
        this.log('success', `Existing config backed up to: ${backupPath}`);
        return true;
      } catch (error) {
        this.log('error', `Failed to backup existing config: ${error.message}`);
        return false;
      }
    }
    return true;
  }

  async setup() {
    try {
      console.log('🚀 Firebase Setup for LLLL467 Blog\n');
      
      // Check if config already exists
      if (fs.existsSync('firebase-config.js')) {
        const overwrite = await this.prompt('Firebase config already exists. Overwrite? (y/N): ');
        if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
          this.log('info', 'Setup cancelled.');
          this.rl.close();
          return;
        }
        
        await this.backupExistingConfig();
      }
      
      // Collect configuration
      const firebaseConfig = await this.collectFirebaseConfig();
      const adminEmails = await this.collectAdminEmails();
      
      // Generate configuration files
      const configContent = this.generateFirebaseConfig(firebaseConfig, adminEmails);
      const rulesContent = this.generateFirestoreRules(adminEmails);
      
      // Write files
      fs.writeFileSync('firebase-config.js', configContent);
      this.log('success', 'Created firebase-config.js');
      
      fs.writeFileSync('firestore.rules', rulesContent);
      this.log('success', 'Updated firestore.rules');
      
      // Next steps
      console.log('\n🎉 Firebase setup complete!');
      console.log('\n📋 Next steps:');
      console.log('1. Go to Firebase Console → Firestore Database → Rules');
      console.log('2. Copy the contents of firestore.rules and paste them there');
      console.log('3. Go to Authentication → Sign-in method → Enable Google provider');
      console.log('4. Add your domain to the authorized domains list');
      console.log('5. Test the configuration by running: npm run validate');
      
      this.rl.close();
      
    } catch (error) {
      this.log('error', `Setup failed: ${error.message}`);
      this.rl.close();
      process.exit(1);
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new FirebaseSetup();
  setup.setup();
}

module.exports = FirebaseSetup;