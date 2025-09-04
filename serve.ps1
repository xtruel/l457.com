param(
  [int]$Port = 5173,
  [string]$Root = (Get-Location).Path
)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
} catch {
  Write-Host "Failed to start listener: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

Write-Host "Static server running at $prefix" -ForegroundColor Green
Write-Host "Serving root: $Root"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".mjs"  = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".gif"  = "image/gif"
  ".ico"  = "image/x-icon"
  ".txt"  = "text/plain; charset=utf-8"
  ".webmanifest" = "application/manifest+json"
}

function Get-ContentType($path) {
  $ext = [System.IO.Path]::GetExtension($path).ToLower()
  if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
}

while ($true) {
  $context = $listener.GetContext()
  $req = $context.Request
  $res = $context.Response
  try {
    $localPath = $req.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($localPath)) { $localPath = "index.html" }

    $fullPath = Join-Path $Root $localPath
    if (Test-Path $fullPath -PathType Container) {
      $fullPath = Join-Path $fullPath "index.html"
    }

    if (Test-Path $fullPath -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($fullPath)
      $res.ContentType = Get-ContentType $fullPath
      $res.StatusCode = 200
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch {
    $res.StatusCode = 500
    $msg = [System.Text.Encoding]::UTF8.GetBytes("Server Error")
    $res.OutputStream.Write($msg, 0, $msg.Length)
  } finally {
    $res.Close()
  }
}