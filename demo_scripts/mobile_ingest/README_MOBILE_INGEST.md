📱 Prima Veritas — Mobile Ingest Demo (Updated 2025-11-30)

Run the full deterministic ingest pipeline from an iPhone using SSH.

This demo proves:

You can trigger Prima Veritas ingest remotely

Output remains bit-for-bit identical

A mobile phone can orchestrate deterministic runs

Network latency does not affect canonical results

Hash verification works as long as the correct shell is used

Important:
The phone does not run analytics — it simply sends commands.
All compute happens on your laptop exactly as if you typed locally.

🛠 Requirements
iPhone

Prompt 3, Blink Shell, or Termius (recommended)

Laptop

SSH enabled

Prima Veritas OSS cloned locally

Node 18.x installed (or Docker)

Local user/password for SSH login

🔧 Laptop Setup (One-Time)
Enable OpenSSH — Windows

Run PowerShell as Administrator:

Get-WindowsCapability -Online | ? Name -like 'OpenSSH*'
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'


Find your local IP:

ipconfig

macOS/Linux

SSH is usually already installed:

sudo systemctl status ssh

📲 iPhone Setup

Open Termius / Prompt / Blink and connect:

ssh YOUR_USERNAME@YOUR_LAPTOP_IP


Example:

ssh bryan@192.168.1.22


Enter your laptop password — you now control the laptop terminal from your phone.

‼️ CRITICAL: Windows Hashing Requires PowerShell

If you're on a Windows laptop, hash verification requires the PowerShell shell.

Many mobile SSH clients default to CMD, which will break Get-FileHash and cause confusion.

✔ After connecting, immediately run:
powershell


You must see the prompt change to:

PS C:\...


If you do not see PS, you are still inside CMD and hash commands will fail.

▶️ Trigger the Ingest (From iPhone)
Windows Laptop
cd C:\CAVIRA_TOOLSTACK_MASTER\PRIMA_VERITAS_OSS
.\demo_scripts\mobile_ingest\run_ingest_from_phone.ps1

macOS/Linux Laptop
cd ~/CAVIRA_TOOLSTACK_MASTER/PRIMA_VERITAS_OSS
bash demo_scripts/mobile_ingest/run_ingest_from_phone.sh

💠 What the Script Actually Does

Prints system + Node/Docker info

Clears prior artifacts

Runs deterministic normalization

Runs deterministic KMeans

Writes outputs to datasets/<name>/

Prints FITGEN digest

Emits a clean success block for recorded demos

Everything is stable for filming.

🔍 Hash Verification (Recommended for the Demo)

If you're on Windows PowerShell:

Get-FileHash .\datasets\iris\iris_normalized.json -Algorithm SHA256
Get-FileHash .\datasets\iris\iris_kmeans.json -Algorithm SHA256
Get-FileHash .\datasets\wine\wine_normalized.json -Algorithm SHA256
Get-FileHash .\datasets\wine\wine_kmeans.json -Algorithm SHA256


Identical hashes confirm cross-device determinism.

🎥 Suggested Captions for Your Demo Video

“Running Prima Veritas deterministic ingest from my iPhone via SSH.”

“The phone only triggers the run — determinism lives in the kernel.”

“Hashes are identical across devices.”

“Cross-machine determinism verified.”

✔ Expected Output (Important Parts)

Look for:

✔ Normalized → MATCH
✔ KMeans → MATCH
✔ FITGEN digest stable

✨ End of Demo