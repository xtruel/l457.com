@echo off
echo ========================================
echo L457.com GitHub Deployment
echo ========================================
echo.
echo STEP 1: Make sure you created the repository at:
echo https://github.com/new
echo Repository name: l457.com
echo Make it PUBLIC
echo.
set /p username="Enter your GitHub username: "
echo.
echo Adding GitHub remote...
git remote add origin https://github.com/%username%/l457.com.git
echo.
echo Setting main branch...
git branch -M main
echo.
echo Pushing to GitHub...
git push -u origin main
echo.
echo ========================================
echo SUCCESS! Your code is now on GitHub!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Go to: https://github.com/%username%/l457.com/settings/pages
echo 2. Source: Deploy from a branch
echo 3. Branch: main / (root)
echo 4. Custom domain: l457.com
echo 5. Save settings
echo.
echo Your site will be live at https://l457.com within 24-48 hours!
echo.
pause