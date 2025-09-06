#!/usr/bin/env node

/**
 * Deployment Validation Script
 * Validates that all necessary files and configurations are ready for deployment
 */

const fs = require('fs');
const path = require('path');

class DeploymentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = [];
  }

  log(type, message) {
    const timestamp = new Date().toISOString();
    const prefix = {
      error: '❌',
      warning: '⚠️',
      success: '✅',
      info: 'ℹ️'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} ${message}`);
    
    if (type === 'error') this.errors.push(message);
    if (type === 'warning') this.warnings.push(message);
    if (type === 'success') this.success.push(message);
  }

  checkFileExists(filePath, required = true) {
    const exists = fs.existsSync(filePath);
    if (exists) {
      this.log('success', `Found: ${filePath}`);
      return true;
    } else {
      this.log(required ? 'error' : 'warning', `Missing: ${filePath}`);
      return false;
    }
  }

  checkFirebaseConfig() {
    this.log('info', 'Checking Firebase configuration...');
    
    if (!this.checkFileExists('firebase-config.js')) {
      return false;
    }

    try {
      const configContent = fs.readFileSync('firebase-config.js', 'utf8');
      
      // Check for placeholder values
      const placeholders = [
        'YOUR_API_KEY',
        'YOUR_PROJECT_ID',
        'YOUR_SENDER_ID',
        'YOUR_APP_ID',
        'you@example.com'
      ];
      
      const hasPlaceholders = placeholders.some(placeholder => 
        configContent.includes(placeholder)
      );
      
      if (hasPlaceholders) {
        this.log('error', 'Firebase config contains placeholder values. Update with real Firebase project credentials.');
        return false;
      }
      
      // Check for LOCAL_ADMIN in production
      if (configContent.includes('window.LOCAL_ADMIN') && 
          !configContent.includes('// window.LOCAL_ADMIN')) {
        this.log('warning', 'LOCAL_ADMIN is enabled. Consider disabling for production.');
      }
      
      this.log('success', 'Firebase configuration appears valid');
      return true;
      
    } catch (error) {
      this.log('error', `Error reading Firebase config: ${error.message}`);
      return false;
    }
  }

  checkNetlifyConfig() {
    this.log('info', 'Checking Netlify configuration...');
    
    if (!this.checkFileExists('netlify.toml')) {
      return false;
    }

    try {
      const configContent = fs.readFileSync('netlify.toml', 'utf8');
      
      // Check for required sections
      const requiredSections = ['[build]', '[[redirects]]'];
      const missingSections = requiredSections.filter(section => 
        !configContent.includes(section)
      );
      
      if (missingSections.length > 0) {
        this.log('error', `Missing Netlify config sections: ${missingSections.join(', ')}`);
        return false;
      }
      
      this.log('success', 'Netlify configuration is valid');
      return true;
      
    } catch (error) {
      this.log('error', `Error reading Netlify config: ${error.message}`);
      return false;
    }
  }

  checkRequiredFiles() {
    this.log('info', 'Checking required files...');
    
    const requiredFiles = [
      'index.html',
      'script.js',
      'styles.css',
      'firebase-config.js',
      'netlify.toml'
    ];
    
    const optionalFiles = [
      'CNAME',
      'README.md',
      '_redirects'
    ];
    
    let allRequired = true;
    
    requiredFiles.forEach(file => {
      if (!this.checkFileExists(file, true)) {
        allRequired = false;
      }
    });
    
    optionalFiles.forEach(file => {
      this.checkFileExists(file, false);
    });
    
    return allRequired;
  }

  checkPostsDirectory() {
    this.log('info', 'Checking posts directory...');
    
    if (!fs.existsSync('posts')) {
      this.log('warning', 'Posts directory not found');
      return false;
    }
    
    const postsIndexExists = fs.existsSync('posts/index.json');
    if (!postsIndexExists) {
      this.log('warning', 'posts/index.json not found');
    }
    
    const postFiles = fs.readdirSync('posts').filter(file => file.endsWith('.html'));
    this.log('success', `Found ${postFiles.length} post files`);
    
    return true;
  }

  checkDomain() {
    this.log('info', 'Checking domain configuration...');
    
    if (this.checkFileExists('CNAME', false)) {
      const domain = fs.readFileSync('CNAME', 'utf8').trim();
      this.log('success', `Custom domain configured: ${domain}`);
      return true;
    }
    
    this.log('info', 'No custom domain configured (using Netlify subdomain)');
    return true;
  }

  checkSecurity() {
    this.log('info', 'Checking security configurations...');
    
    // Check if firestore.rules exists
    if (this.checkFileExists('firestore.rules', false)) {
      this.log('success', 'Firestore security rules found');
    } else {
      this.log('warning', 'Firestore security rules not found. Configure in Firebase Console.');
    }
    
    // Check netlify.toml for security headers
    if (fs.existsSync('netlify.toml')) {
      const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
      if (netlifyConfig.includes('X-Frame-Options')) {
        this.log('success', 'Security headers configured in netlify.toml');
      } else {
        this.log('warning', 'Security headers not found in netlify.toml');
      }
    }
    
    return true;
  }

  async validate() {
    console.log('🚀 Starting deployment validation...\n');
    
    // Run all checks
    const checks = [
      () => this.checkRequiredFiles(),
      () => this.checkFirebaseConfig(),
      () => this.checkNetlifyConfig(),
      () => this.checkPostsDirectory(),
      () => this.checkDomain(),
      () => this.checkSecurity()
    ];
    
    let allPassed = true;
    for (const check of checks) {
      try {
        const result = await check();
        if (!result) allPassed = false;
      } catch (error) {
        this.log('error', `Check failed: ${error.message}`);
        allPassed = false;
      }
      console.log(''); // Add spacing
    }
    
    // Summary
    console.log('📊 Validation Summary:');
    console.log(`✅ Successes: ${this.success.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Deployment validation failed. Please fix the errors above.');
      process.exit(1);
    } else if (this.warnings.length > 0) {
      console.log('\n⚠️  Deployment validation passed with warnings. Review warnings above.');
      process.exit(0);
    } else {
      console.log('\n🎉 Deployment validation passed! Ready to deploy.');
      process.exit(0);
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new DeploymentValidator();
  validator.validate().catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
}

module.exports = DeploymentValidator;