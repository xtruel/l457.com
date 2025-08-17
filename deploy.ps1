# L457.com Deployment Script
Write-Host "L457.com Deployment Script" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - L457 e-commerce site"
    Write-Host "Git repository initialized!" -ForegroundColor Green
} else {
    Write-Host "Git repository already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "DEPLOYMENT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create GitHub Repository:" -ForegroundColor White
Write-Host "   Go to: https://github.com/new" -ForegroundColor Gray
Write-Host "   Name: l457.com" -ForegroundColor Gray
Write-Host "   Make it PUBLIC" -ForegroundColor Gray
Write-Host ""
Write-Host "2. After creating repo, run:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/USERNAME/l457.com.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Enable GitHub Pages:" -ForegroundColor White
Write-Host "   Settings -> Pages -> Deploy from branch -> main" -ForegroundColor Gray
Write-Host "   Custom domain: l457.com" -ForegroundColor Gray
Write-Host ""
Write-Host "Site will be live at https://l457.com!" -ForegroundColor Green

$fileCount = (Get-ChildItem -File).Count
Write-Host "Ready to deploy: $fileCount files" -ForegroundColor Cyan