# 🥗 NutriCheck AI

> **Chatbot Gizi Berbasis Data Makanan Indonesia**  
> Capstone Project · SDG No. 2 — Zero Hunger

---

## 📌 Deskripsi Proyek

**NutriCheck AI** adalah sistem chatbot gizi berbasis web yang membantu pengguna mengetahui nilai gizi makanan Indonesia dan memberikan rekomendasi konsumsi berdasarkan kondisi kesehatan serta kelompok usia. Proyek ini memanfaatkan dataset 1.651 makanan Indonesia untuk memberikan analisis gizi secara real-time.

Proyek ini dikembangkan sebagai solusi terhadap permasalahan **kurangnya akses informasi gizi yang mudah dipahami masyarakat Indonesia**, sejalan dengan tujuan SDG No. 2 (*Zero Hunger*) yang mendorong ketahanan pangan dan perbaikan gizi.

---

## 🎯 Tujuan

- Memberikan informasi nilai gizi makanan Indonesia secara cepat dan mudah
- Memberikan rekomendasi makanan berdasarkan kondisi kesehatan (diet, diabetes, jantung)
- Menyesuaikan saran gizi dengan kelompok usia (bayi, balita, anak, remaja, dewasa, lansia)
- Meningkatkan kesadaran masyarakat terhadap pentingnya gizi seimbang

---

## 🧠 Algoritma yang Digunakan

Sistem menggunakan pendekatan **Rule-Based Classification** dengan tiga tahapan utama:

### 1. Intent Detection (Deteksi Niat)
Sistem mendeteksi tujuan pertanyaan pengguna menggunakan pencocokan kata kunci (*keyword matching*):
- **Diet** → kata kunci: `diet`, `kurus`, `kalori rendah`, `turun berat`, dll.
- **Diabetes** → kata kunci: `diabetes`, `gula darah`, `kencing manis`, dll.
- **Jantung** → kata kunci: `jantung`, `kolesterol`, `hipertensi`, dll.
- **Gizi umum** → default jika tidak ada intent khusus

### 2. Food Search (Pencarian Makanan)
Sistem melakukan *token-based string matching* terhadap nama makanan di database:
- Normalisasi teks input (hapus stop words)
- Pencocokan token ke nama makanan
- Ranking hasil berdasarkan jumlah token yang cocok
- Mengembalikan hingga 5 makanan yang paling relevan

### 3. Nutrition Analysis (Analisis Gizi)
Sistem mengklasifikasikan makanan ke dalam 3 kategori menggunakan **threshold-based rules**:

| Kategori | Simbol | Kondisi |
|----------|--------|---------|
| ✅ Aman / Direkomendasikan | Hijau | Nilai gizi dalam batas aman untuk kondisi tersebut |
| ⚠️ Boleh – Porsi Wajar | Kuning | Satu atau lebih nilai mendekati batas |
| 🚫 Perlu Dihindari | Merah | Nilai gizi melebihi batas aman |

### 4. Age Group Filter (Filter Kelompok Usia)
Analisis tambahan berdasarkan **Angka Kecukupan Gizi (AKG)** per kelompok usia:

| Kelompok | Batas Natrium | Batas Gula |
|----------|--------------|------------|
| Bayi (0–1 thn) | 200 mg | 5 g |
| Balita (1–5 thn) | 800 mg | 15 g |
| Anak (6–12 thn) | 1.200 mg | 25 g |
| Remaja (13–17 thn) | 1.500 mg | 35 g |
| Dewasa (18–59 thn) | 1.500 mg | 50 g |
| Lansia (60+ thn) | 1.200 mg | 30 g |

---

## 📊 Dataset

| Atribut | Detail |
|---------|--------|
| **Sumber** | Kaggle — Data Nilai Gizi Makanan Indonesia |
| **Jumlah Data** | 1.651 item makanan |
| **Format** | XLSX → dikonversi ke JSON |
| **Fitur Utama** | `name`, `energy_kcal`, `protein_g`, `carbohydrate_g`, `fat_g`, `sugar_g`, `sodium_mg`, `fiber_g` |

---

## 🗂️ Struktur File

```
NutriCheck_AI/
├── index.html          # Antarmuka utama chatbot
├── script.js           # Logika sistem (intent detection, analisis gizi, age filter)
├── style.css           # Tampilan UI
├── nutrisi_data.json   # Database makanan (1.651 item, dari nilai-gizi.xlsx)
├── jalankan.py         # Launcher server lokal Python
└── README.md           # Dokumentasi ini
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Python 3.x (sudah terinstal di sebagian besar sistem)
- Browser modern (Chrome, Firefox, Edge)

### Langkah-langkah

1. **Ekstrak file ZIP** dan masuk ke folder `NutriCheck_AI`

2. **Jalankan launcher:**
   ```bash
   python jalankan.py
   ```

3. **Browser akan otomatis terbuka** ke `http://localhost:8000`

4. **Mulai bertanya**, contoh:
   - *"Apakah mie ayam bagus untuk diet?"*
   - *"Berapa kalori ayam goreng?"*
   - *"Nasi putih cocok untuk penderita diabetes?"*
   - *"Makanan apa yang aman untuk bayi?"*

> ⚠️ **Jangan buka `index.html` langsung lewat file manager** — data JSON tidak akan termuat karena browser memblokir akses file lokal (CORS policy). Selalu gunakan `python jalankan.py`.

---

## 💬 Cara Penggunaan Sistem

### Input
- Pertanyaan teks bebas dalam Bahasa Indonesia
- Pilihan kelompok usia (opsional, via tombol di bagian bawah)

### Proses
1. Sistem mendeteksi intent dari pertanyaan
2. Sistem mencari makanan yang relevan di database
3. Sistem menganalisis nilai gizi berdasarkan intent dan usia
4. Sistem mengklasifikasikan dan menghasilkan rekomendasi

### Output
- Kartu informasi gizi lengkap (kalori, protein, karbo, lemak, gula, serat)
- Visualisasi bar AKG (% dari kebutuhan harian)
- Verdict: ✅ Aman / ⚠️ Hati-hati / 🚫 Hindari
- Analisis khusus berdasarkan kelompok usia
- Saran konsumsi yang actionable

---

## 📋 Evaluasi Sistem

Sistem dievaluasi berdasarkan:
- **Kesesuaian rekomendasi** dengan panduan gizi BPOM dan Kemenkes RI
- **Ketepatan pencarian makanan** (relevansi hasil terhadap query)
- **Konsistensi threshold** dengan standar AKG nasional
- **Usability** antarmuka pengguna

---

## 🤝 Kontribusi terhadap SDG

| SDG | Kontribusi |
|-----|------------|
| **SDG 2** – Zero Hunger | Meningkatkan akses informasi gizi untuk mendukung pola makan sehat |
| **SDG 3** – Good Health | Membantu penderita diabetes, hipertensi, dan penyakit jantung memilih makanan |

---

## 👨‍💻 Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Python (http.server — untuk serving lokal)
- **Data**: JSON (dikonversi dari XLSX Kaggle)
- **Metode AI**: Rule-Based Classification + Keyword-Based Intent Detection

---

*NutriCheck AI — Capstone Project · 2024*
