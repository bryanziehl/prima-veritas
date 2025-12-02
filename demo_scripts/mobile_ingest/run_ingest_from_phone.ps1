Write-Host "=== Prima Veritas — Mobile Ingest Demo (PowerShell) ===" -ForegroundColor Cyan

$repo = "C:\CAVIRA_TOOLSTACK_MASTER\PRIMA_VERITAS_OSS"

Write-Host "`n[1] Switching to repo directory: $repo"
Set-Location $repo

Write-Host "`n[2] Clearing old outputs..."
Remove-Item ".\datasets\iris\iris_normalized.json" -ErrorAction SilentlyContinue
Remove-Item ".\datasets\iris\iris_kmeans.json" -ErrorAction SilentlyContinue

Write-Host "`n[3] Running FULL deterministic ingest..."
node runners/codice_fullproof.mjs iris
if ($LASTEXITCODE -ne 0) {
    Write-Host "Ingest failed." -ForegroundColor Red
    exit 1
}

Write-Host "`n[4] Hash-checking results..."
node tools/hashcheck.mjs iris

Write-Host "`n=== SUCCESS: Mobile-triggered ingest completed ===" -ForegroundColor Green
