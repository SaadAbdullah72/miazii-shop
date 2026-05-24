# Miazi Shop Health Checker
# Use this script to verify that your backend is reachable.

$API_URL = "https://miazi-shop.vercel.app/api/health"

Write-Host "🔍 Checking Miazi Shop Health at: $API_URL" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $API_URL -Method Get
    if ($response.status -eq "UP") {
        Write-Host "✅ [SUCCESS] Backend is UP and running!" -ForegroundColor Green
        Write-Host "Timestamp: $($response.timestamp)"
        Write-Host "Environment: $($response.environment)"
    } else {
        Write-Host "⚠️ [WARNING] Backend is reachable but returned an unexpected status: $($response.status)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ [ERROR] Backend is UNREACHABLE!" -ForegroundColor Red
    Write-Host "Details: $_"
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
