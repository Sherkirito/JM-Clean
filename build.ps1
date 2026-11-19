param([string]$Java = 'java', [string]$BuildTools = 'E:\Android\sdk\build-tools\35.0.0',
      [string]$Output = (Join-Path (Split-Path $PSScriptRoot) 'JM-Clean-0.1-rc21-arm64.apk'))
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$project = Split-Path $PSScriptRoot
$tempDir = Join-Path ([IO.Path]::GetTempPath()) ('jm2-build-' + [guid]::NewGuid())
New-Item -ItemType Directory -Path $tempDir | Out-Null
try {
    $platform=Join-Path (Split-Path (Split-Path $BuildTools)) 'platforms/android-35/android.jar'
    python (Join-Path $PSScriptRoot 'build.py') (Join-Path $tempDir 'unsigned.apk') --java $Java --tools $BuildTools --platform $platform
    & (Join-Path $BuildTools 'zipalign.exe') -P 16 -f 4 (Join-Path $tempDir 'unsigned.apk') (Join-Path $tempDir 'aligned.apk')
    $secret = ConvertTo-SecureString (Get-Content -LiteralPath (Join-Path $project 'jm2clean-key.protected') -Raw).Trim()
    $env:JM2_SIGNING_PASSWORD = [System.Net.NetworkCredential]::new('', $secret).Password
    $signer = Join-Path $BuildTools 'lib\apksigner.jar'
    & $Java -jar $signer sign --ks (Join-Path $project 'jm2clean-key.p12') --ks-pass env:JM2_SIGNING_PASSWORD --v4-signing-enabled false --out (Join-Path $tempDir 'signed.apk') (Join-Path $tempDir 'aligned.apk')
    & $Java -jar $signer verify (Join-Path $tempDir 'signed.apk')
    Copy-Item -LiteralPath (Join-Path $tempDir 'signed.apk') -Destination $Output
} finally {
    Remove-Item Env:JM2_SIGNING_PASSWORD -ErrorAction SilentlyContinue
    foreach ($file in 'unsigned.apk','aligned.apk','signed.apk') {
        Remove-Item -LiteralPath (Join-Path $tempDir $file) -ErrorAction SilentlyContinue
    }
    if ([IO.Directory]::Exists($tempDir)) { [IO.Directory]::Delete($tempDir) }
}
