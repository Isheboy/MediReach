# 🔐 Production Readiness Script for MediReach Backend

Write-Host "`n🚀 MediReach Production Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if we're in the server directory
if (-Not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found" -ForegroundColor Red
    Write-Host "   Please run this script from the server/ directory`n" -ForegroundColor Yellow
    exit 1
}

# Step 1: Install security packages
Write-Host "📦 Step 1: Installing security packages..." -ForegroundColor Yellow
Write-Host "   - helmet (HTTP security headers)" -ForegroundColor Gray
Write-Host "   - express-rate-limit (API rate limiting)" -ForegroundColor Gray
Write-Host "   - express-mongo-sanitize (NoSQL injection protection)`n" -ForegroundColor Gray

npm install helmet express-rate-limit express-mongo-sanitize

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Security packages installed successfully`n" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install security packages`n" -ForegroundColor Red
    exit 1
}

# Step 2: Backup current server.js
Write-Host "💾 Step 2: Backing up current server.js..." -ForegroundColor Yellow

if (Test-Path "src\server.js") {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    Copy-Item "src\server.js" "src\server.backup.$timestamp.js"
    Write-Host "✅ Backup created: server.backup.$timestamp.js`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  server.js not found, skipping backup`n" -ForegroundColor Yellow
}

# Step 3: Replace server.js with production version
Write-Host "🔄 Step 3: Updating server.js with production configuration..." -ForegroundColor Yellow

if (Test-Path "src\server.production.js") {
    Copy-Item "src\server.production.js" "src\server.js" -Force
    Write-Host "✅ server.js updated with production security`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  server.production.js not found, skipping update" -ForegroundColor Yellow
    Write-Host "   Manual update required - see DEPLOYMENT_CHECKLIST.md`n" -ForegroundColor Gray
}

# Step 4: Verify environment configuration
Write-Host "🔍 Step 4: Checking environment configuration..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    # Check for required variables
    $envContent = Get-Content ".env" -Raw
    $requiredVars = @("MONGO_URI", "JWT_SECRET", "FRONTEND_URL")
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        if (-Not ($envContent -match "$var=")) {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Host "⚠️  Missing environment variables:" -ForegroundColor Yellow
        foreach ($var in $missingVars) {
            Write-Host "   - $var" -ForegroundColor Red
        }
        Write-Host "`n💡 Please add these to your .env file" -ForegroundColor Cyan
        Write-Host "   See .env.example for guidance`n" -ForegroundColor Gray
    } else {
        Write-Host "✅ All required environment variables present`n" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host "   Copy .env.example to .env and configure it`n" -ForegroundColor Gray
}

# Step 5: Summary and next steps
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Review DEPLOYMENT_CHECKLIST.md for full instructions" -ForegroundColor White
Write-Host "   2. Update .env with production values (see .env.example)" -ForegroundColor White
Write-Host "   3. Test locally: npm run dev" -ForegroundColor White
Write-Host "   4. Update render.yaml with your frontend URL" -ForegroundColor White
Write-Host "   5. Commit and push to GitHub" -ForegroundColor White
Write-Host "   6. Deploy to Render`n" -ForegroundColor White

Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   • DEPLOYMENT_CHECKLIST.md - Complete deployment guide" -ForegroundColor White
Write-Host "   • .env.example - Environment variable reference" -ForegroundColor White
Write-Host "   • render.yaml - Render.com deployment config`n" -ForegroundColor White

Write-Host "🔒 Security Features Enabled:" -ForegroundColor Green
Write-Host "   ✓ Helmet (HTTP security headers)" -ForegroundColor White
Write-Host "   ✓ Rate limiting (100 requests/15min per IP)" -ForegroundColor White
Write-Host "   ✓ MongoDB injection protection" -ForegroundColor White
Write-Host "   ✓ Production CORS configuration" -ForegroundColor White
Write-Host "   ✓ Environment validation on startup" -ForegroundColor White
Write-Host "   ✓ Graceful shutdown handlers`n" -ForegroundColor White

Write-Host "💡 Test your setup:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host "`n" -ForegroundColor White
