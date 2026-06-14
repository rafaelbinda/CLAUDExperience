$root = $PSScriptRoot
$port = 8080
$prefix = "http://localhost:$port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host "Word Frequency server running at $prefix"
Write-Host "Press Ctrl+C to stop`n"

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.png'  = 'image/png'
    '.ico'  = 'image/x-icon'
}

try {
    while ($listener.IsListening) {
        $ctx  = $listener.GetContext()
        $req  = $ctx.Request
        $resp = $ctx.Response

        $localPath = $req.Url.LocalPath.TrimStart('/')
        if ($localPath -eq '') { $localPath = 'index.html' }

        $filePath = Join-Path $root $localPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext  = [IO.Path]::GetExtension($filePath)
            $mime = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { 'application/octet-stream' }
            $body = [IO.File]::ReadAllBytes($filePath)

            $resp.ContentType   = $mime
            $resp.ContentLength64 = $body.Length
            $resp.OutputStream.Write($body, 0, $body.Length)
            Write-Host "200 GET /$localPath"
        } else {
            $resp.StatusCode = 404
            $body = [Text.Encoding]::UTF8.GetBytes('404 Not Found')
            $resp.OutputStream.Write($body, 0, $body.Length)
            Write-Host "404 GET /$localPath"
        }

        $resp.OutputStream.Close()
    }
} finally {
    $listener.Stop()
}
