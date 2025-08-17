# Script di Verifica DNS per l457.com
Write-Host "Verifica Configurazione DNS per l457.com" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Verifica record A per l457.com
Write-Host "Verifica Record A per l457.com:" -ForegroundColor Cyan
try {
    $aRecords = Resolve-DnsName -Name "l457.com" -Type A -ErrorAction Stop
    foreach ($record in $aRecords) {
        if ($record.IPAddress) {
            Write-Host "   OK: $($record.IPAddress)" -ForegroundColor Green
        }
    }
}
catch {
    Write-Host "   Nessun record A trovato" -ForegroundColor Red
}
Write-Host ""

# Verifica record CNAME per www.l457.com
Write-Host "Verifica Record CNAME per www.l457.com:" -ForegroundColor Cyan
try {
    $cnameRecords = Resolve-DnsName -Name "www.l457.com" -Type CNAME -ErrorAction Stop
    foreach ($record in $cnameRecords) {
        if ($record.NameHost) {
            Write-Host "   OK: $($record.NameHost)" -ForegroundColor Green
        }
    }
}
catch {
    Write-Host "   Nessun record CNAME trovato" -ForegroundColor Red
}
Write-Host ""

# Test connettivita sito
Write-Host "Test Connettivita Sito:" -ForegroundColor Cyan

$urls = @(
    "https://l457.com",
    "https://www.l457.com",
    "https://xtruel.github.io/l457.com"
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -ErrorAction Stop
        Write-Host "   OK: $url - Status: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "   ERRORE: $url - Non raggiungibile" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Riepilogo:" -ForegroundColor Yellow
Write-Host "   - Se i record DNS sono configurati, il sito sara online entro 24-48 ore"
Write-Host "   - L'URL temporaneo GitHub Pages dovrebbe funzionare subito"
Write-Host "   - Il certificato SSL verra generato automaticamente"
Write-Host ""
Write-Host "Esegui questo script periodicamente per monitorare i progressi" -ForegroundColor Cyan