# L457 Music Website

## Deployment

### Netlify Deployment

This site is configured for deployment on Netlify. Follow these steps to deploy:

1. Push your code to GitHub
2. Log in to Netlify (https://app.netlify.com/)
3. Click "New site from Git"
4. Select your GitHub repository
5. Configure build settings:
   - Build command: Leave empty (or use `npm run build`)
   - Publish directory: `/`
6. Click "Deploy site"

### Custom Domain

The site is configured to use the custom domain `l457.com`. After deploying to Netlify:

1. Go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS settings as instructed by Netlify

### Admin Access

Admin access is available at `/#/admin` with the following credentials:
- Username: truel
- Password: 12345/////

## Local Development

To run the site locally:

```
npm install
npm start
```

Or use the included PowerShell script:

```
.\serve.ps1
```