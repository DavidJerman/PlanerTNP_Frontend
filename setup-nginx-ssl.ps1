# Step 1: Install Dependencies and Build the React App
Write-Host "Running npm build..."
npm run build

# Step 2: Download and Extract Nginx
$nginxZip = "$PSScriptRoot\nginx.zip"
$nginxFolder = "$PSScriptRoot\nginx\nginx-1.24.0"
if (-Not (Test-Path $nginxFolder)) {
    Write-Host "Downloading and extracting Nginx..."
    $nginxUrl = "https://nginx.org/download/nginx-1.24.0.zip"
    Invoke-WebRequest -Uri $nginxUrl -OutFile $nginxZip
    Expand-Archive -Path $nginxZip -DestinationPath "$PSScriptRoot\nginx"
    Remove-Item $nginxZip
}

# Step 3: Generate SSL Certificates
$certFolder = "$nginxFolder\conf\ssl"
if (-Not (Test-Path $certFolder)) {
    Write-Host "Generating SSL Certificates..."
    New-Item -Path $certFolder -ItemType Directory | Out-Null

    # Generate self-signed certificate
    $cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "cert:\CurrentUser\My"

    # Export to .pfx
    $pfxPath = "$certFolder\cert.pfx"
    Export-PfxCertificate -Cert $cert -FilePath $pfxPath -Password (ConvertTo-SecureString -String "password" -Force -AsPlainText)

    # Export public certificate to PEM format
    $certPath = "$certFolder\cert.pem"
    $cert = Get-Item "cert:\CurrentUser\My\$($cert.Thumbprint)"
    Export-Certificate -Cert $cert -FilePath $certPath -Type CERT

    # Convert to PEM format using OpenSSL (if necessary)
    # OpenSSL to convert .cer to .pem
    $opensslCmd = "openssl x509 -inform DER -in $certPath -out $certPath -outform PEM"
    Invoke-Expression $opensslCmd

    # Extract private key using OpenSSL
    $certKeyPath = "$certFolder\cert.key"
    $opensslCmd = "openssl pkcs12 -in $pfxPath -nocerts -out $certKeyPath -nodes -password pass:password"
    Invoke-Expression $opensslCmd

    Write-Host "SSL Certificate generated at $certPath"
    Write-Host "SSL Private Key generated at $certKeyPath"
}

# Step 4: Copy the Build Files to Nginx HTML Directory
$buildFolder = "$PSScriptRoot\build"
$nginxHtmlFolder = "$nginxFolder\html"

Write-Host "Copying build files to Nginx HTML directory..."
Copy-Item -Path "$buildFolder\*" -Destination $nginxHtmlFolder -Recurse -Force

# Step 5: Write Nginx Configuration
Write-Host "Configuring Nginx..."
$nginxConfig = "$nginxFolder\conf\nginx.conf"
@"
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen 443 ssl;
        server_name localhost;

        ssl_certificate      ssl/cert.pem;
        ssl_certificate_key  ssl/cert.key;

        root html;
        index index.html;
    }
}
"@ | Set-Content -Path $nginxConfig

# Step 6: Start Nginx
Write-Host "Starting Nginx Server..."
Write-Host "Your React app is served at https://localhost" -ForegroundColor Green
Set-Location -Path $nginxFolder
Start-Process -FilePath "./nginx.exe"
Set-Location -Path $PSScriptRoot
