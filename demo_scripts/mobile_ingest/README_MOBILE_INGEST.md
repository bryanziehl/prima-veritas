📱 Prima Veritas — Mobile Ingest Demo

Run the full deterministic ingest pipeline from an iPhone using SSH.

This demo proves:

You can trigger Prima Veritas ingest remotely

Output remains bit-for-bit identical

A mobile phone can orchestrate deterministic runs

Network latency does not affect canonical results

Note:
The phone is not running analytics — it’s simply the controller.
All compute happens inside the kernel on your laptop.

🛠 Requirements

iPhone:

Prompt 3, Blink Shell, or Termius

Laptop:

SSH enabled

Prima Veritas OSS cloned

Node 18.x installed (or Docker)

Same local user/password for SSH login

🔧 Laptop Setup (One-Time)
1. Enable OpenSSH

Windows (PowerShell as Administrator):

Get-WindowsCapability -Online | ? Name -like 'OpenSSH*'
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'


Find your local IP:

ipconfig


macOS/Linux:
SSH is already installed — just verify:

sudo systemctl status ssh

📲 iPhone Setup

Open Prompt / Blink / Termius and connect:

ssh YOUR_USERNAME@YOUR_LAPTOP_IP


Example:

ssh bryan@192.168.1.22


Enter your password — now your phone is controlling the laptop’s terminal.

▶️ Trigger the Ingest (From iPhone)
Windows Laptop:
cd C:\CAVIRA_TOOLSTACK_MASTER\PRIMA_VERITAS_OSS
.\demo_scripts\mobile_ingest\run_ingest_from_phone.ps1

macOS/Linux Laptop:
cd ~/CAVIRA_TOOLSTACK_MASTER/PRIMA_VERITAS_OSS
bash demo_scripts/mobile_ingest/run_ingest_from_phone.sh

🎬 What the Script Actually Does

Prints system + Node/Docker info

Clears prior artifacts to avoid noise

Runs deterministic ingest

Emits normalization + KMeans results

Prints FITGEN digest

Outputs a clean success block for your video captions

Everything is camera-ready and stable.

🎥 Recommended Captions For Your Demo Video

“Running Prima Veritas deterministic ingest from my iPhone via SSH.”

“The phone is only triggering the run — determinism lives in the kernel.”

“Hash is identical across devices.”

“Cross-machine determinism verified.”

✔ Expected Output (Important Parts)

You want these exact confirmations:

✔ Normalized → MATCH
✔ KMeans → MATCH
✔ FITGEN digest stable



✨ End of Demo