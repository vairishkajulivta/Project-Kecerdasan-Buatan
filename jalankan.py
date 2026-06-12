"""
╔══════════════════════════════════════════╗
║         NutriCheck AI - Launcher         ║
║     SDG No. 2 Zero Hunger · 2024         ║
╚══════════════════════════════════════════╝

Cara pakai:
    python jalankan.py
"""

import http.server
import socketserver
import webbrowser
import threading
import os
import sys
import time
import socket

# ── Konfigurasi ──────────────────────────────────────────
PORT       = 8000
HOST       = "localhost"
FILE_WAJIB = ["index.html", "nutrisi_data.json"]

# ── Warna terminal ────────────────────────────────────────
class C:
    HIJAU  = "\033[92m"
    KUNING = "\033[93m"
    MERAH  = "\033[91m"
    BIRU   = "\033[94m"
    BOLD   = "\033[1m"
    RESET  = "\033[0m"

def info(msg):       print(f"{C.BIRU}[INFO]{C.RESET}  {msg}")
def sukses(msg):     print(f"{C.HIJAU}[OK]{C.RESET}    {msg}")
def peringatan(msg): print(f"{C.KUNING}[WARN]{C.RESET}  {msg}")
def error(msg):      print(f"{C.MERAH}[ERROR]{C.RESET} {msg}")

# ── Banner ────────────────────────────────────────────────
def tampilkan_banner():
    print(f"""
{C.HIJAU}{C.BOLD}╔══════════════════════════════════════════════╗
║          🥗  NutriCheck AI Launcher          ║
║        SDG No. 2 · Zero Hunger · 2024        ║
╚══════════════════════════════════════════════╝{C.RESET}
""")

# ── Cek file ──────────────────────────────────────────────
def cek_file():
    info("Memeriksa file yang dibutuhkan...")
    semua_ada = True
    for nama in FILE_WAJIB:
        if os.path.exists(nama):
            sukses(f"  {nama}")
        else:
            error(f"  {nama} — TIDAK DITEMUKAN!")
            semua_ada = False

    if not semua_ada:
        print()
        error("Beberapa file tidak ditemukan!")
        peringatan("Pastikan semua file ada di folder yang sama dengan jalankan.py")
        print()
        input("Tekan Enter untuk keluar...")
        sys.exit(1)
    print()

# ── Cek port tersedia ─────────────────────────────────────
def cek_port(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex((HOST, port)) != 0

# ── Buka browser ─────────────────────────────────────────
def buka_browser(url):
    time.sleep(1.5)
    info(f"Membuka browser → {url}")
    webbrowser.open(url)

# ── Handler ───────────────────────────────────────────────
class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        path = args[0].split()[1] if args[0].split() else ""
        if path in ["/", "/index.html"]:
            print(f"  {C.HIJAU}→{C.RESET} Browser mengakses aplikasi")

# ── Main ──────────────────────────────────────────────────
def main():
    tampilkan_banner()

    # Pindah ke direktori tempat script berada
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    cek_file()

    # Cari port yang tersedia (coba sampai 10 port)
    port = PORT
    for p in range(PORT, PORT + 10):
        if cek_port(p):
            port = p
            break
        peringatan(f"Port {p} sudah dipakai. Mencoba port {p + 1}...")
    else:
        error("Semua port 8000-8009 sudah dipakai!")
        error("Tutup aplikasi lain atau restart komputer.")
        input("Tekan Enter untuk keluar...")
        sys.exit(1)

    url = f"http://{HOST}:{port}"

    # Jalankan server
    try:
        with socketserver.TCPServer((HOST, port), Handler) as httpd:
            httpd.allow_reuse_address = True

            sukses(f"Server berjalan di {C.BOLD}{url}{C.RESET}")
            print()
            print(f"  {C.BOLD}Buka browser dan ketik:{C.RESET}")
            print(f"  {C.KUNING}{C.BOLD}  → {url}{C.RESET}")
            print()
            print(f"  {C.MERAH}Tekan Ctrl+C untuk menghentikan server{C.RESET}")
            print("─" * 48)

            # Buka browser di thread terpisah
            t = threading.Thread(target=buka_browser, args=(url,), daemon=True)
            t.start()

            httpd.serve_forever()

    except KeyboardInterrupt:
        print()
        print("─" * 48)
        sukses("Server dihentikan. Sampai jumpa! 👋")
        print()
        sys.exit(0)
    except PermissionError:
        error(f"Tidak bisa menggunakan port {port}. Coba port lain.")
        sys.exit(1)

if __name__ == "__main__":
    main()
