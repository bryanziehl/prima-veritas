Write-Host "=== Prima Veritas — Mobile Ingest Demo (PowerShell) ===" -ForegroundColor Cyan

Write-Host "`n[1] Environment check..."
node -v
if ($LASTEXITCODE -ne 0) {
    Write-Host "Node not found. Exiting." -ForegroundColor Red
    exit 1
}

$repo = "C:\CAVIRA_TOOLSTACK_MASTER\PRIMA_VERITAS_OSS"
Write-Host "`n[2] Switching to repo directory: $repo"
Set-Location $repo

Write-Host "`n[3] Clearing old datasets..."
Remove-Item ".\datasets\iris\iris_normalized.json" -ErrorAction SilentlyContinue
Remove-Item ".\datasets\iris\iris_kmeans.json" -ErrorAction SilentlyContinue

Write-Host "`n[4] Running deterministic ingest..."
node tools/hashcheck.mjs iris
if ($LASTEXITCODE -ne 0) {
    Write-Host "Ingest failed." -ForegroundColor Red
    exit 1
}

Write-Host "`n[5] Displaying FITGEN digest..."
Get-Content ".\reports\FITGEN_RUNTIME_DIGEST.json" | Write-Output

Write-Host "`n=== SUCCESS: Mobile-triggered ingest completed ===" -ForegroundColor Green
