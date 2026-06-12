"""
╔══════════════════════════════════════════════════════════╗
║         NutriCheck AI — Machine Learning Model           ║
║         Algoritma: Decision Tree Classification          ║
║         SDG No. 2 · Zero Hunger · 2024                   ║
╚══════════════════════════════════════════════════════════╝

Cara pakai:
    pip install scikit-learn pandas matplotlib seaborn openpyxl
    python ml_model.py
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns
import warnings
import os
warnings.filterwarnings('ignore')

from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, classification_report,
    confusion_matrix, ConfusionMatrixDisplay
)
from sklearn.preprocessing import LabelEncoder

# ── Warna terminal ─────────────────────────────────────────
class C:
    HIJAU  = "\033[92m"
    KUNING = "\033[93m"
    MERAH  = "\033[91m"
    BIRU   = "\033[94m"
    BOLD   = "\033[1m"
    RESET  = "\033[0m"

def info(msg):   print(f"{C.BIRU}[INFO]{C.RESET}  {msg}")
def ok(msg):     print(f"{C.HIJAU}[OK]{C.RESET}    {msg}")
def warn(msg):   print(f"{C.KUNING}[WARN]{C.RESET}  {msg}")
def header(msg): print(f"\n{C.BOLD}{C.HIJAU}{'─'*55}\n  {msg}\n{'─'*55}{C.RESET}")

# ══════════════════════════════════════════════════════════
# 1. LOAD DATASET
# ══════════════════════════════════════════════════════════
header("1. LOAD DATASET")

# Cari file dataset
dataset_path = None
candidates = [
    "nilai-gizi.csv",
    "nilai-gizi.xlsx",
    "../nilai-gizi.csv",
    "../nilai-gizi.xlsx",
]
for c in candidates:
    if os.path.exists(c):
        dataset_path = c
        break

if dataset_path is None:
    warn("File nilai-gizi.csv / nilai-gizi.xlsx tidak ditemukan.")
    warn("Pastikan file ada di folder yang sama dengan ml_model.py")
    exit(1)

if dataset_path.endswith(".csv"):
    df = pd.read_csv(dataset_path, on_bad_lines="skip", sep=None, engine="python")
else:
    df = pd.read_excel(dataset_path)
info(f"Dataset dimuat dari: {dataset_path}")
ok(f"Total data: {len(df)} baris, {len(df.columns)} kolom")

# ══════════════════════════════════════════════════════════
# 2. PREPROCESSING
# ══════════════════════════════════════════════════════════
header("2. PREPROCESSING")

# Pilih fitur (kolom input)
FITUR = ['energy_kcal', 'protein_g', 'carbohydrate_g',
         'fat_g', 'sugar_g', 'sodium_mg', 'fiber_g']

# Bersihkan data
df_clean = df[FITUR].copy()
df_clean = df_clean.fillna(0)

# Pastikan semua numerik
for col in FITUR:
    df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce').fillna(0)

info(f"Fitur yang digunakan: {FITUR}")
ok(f"Data setelah cleaning: {len(df_clean)} baris")

# ══════════════════════════════════════════════════════════
# 3. PEMBUATAN LABEL (GROUND TRUTH)
# ══════════════════════════════════════════════════════════
header("3. PEMBUATAN LABEL KLASIFIKASI")
info("Membuat label berdasarkan threshold gizi (standar AKG umum)...")

def buat_label(row):
    """
    Membuat label verdict berdasarkan nilai gizi.
    Mengikuti logika yang sama dengan rule-based di script.js
    
    Label:
        0 = HINDARI  (merah)
        1 = HATI-HATI (kuning)
        2 = AMAN     (hijau)
    """
    e  = row['energy_kcal']
    f  = row['fat_g']
    s  = row['sugar_g']
    na = row['sodium_mg']
    p  = row['protein_g']
    fi = row['fiber_g']
    c  = row['carbohydrate_g']

    skor_buruk = 0
    skor_baik  = 0

    # === Faktor BURUK (menambah skor buruk) ===
    if e   > 500:  skor_buruk += 3  # Kalori sangat tinggi
    elif e > 300:  skor_buruk += 1

    if f   > 25:   skor_buruk += 3  # Lemak sangat tinggi
    elif f > 15:   skor_buruk += 1

    if s   > 25:   skor_buruk += 3  # Gula sangat tinggi
    elif s > 10:   skor_buruk += 1

    if na  > 600:  skor_buruk += 3  # Natrium sangat tinggi
    elif na > 300: skor_buruk += 1

    if c   > 60:   skor_buruk += 1  # Karbo tinggi

    # === Faktor BAIK (menambah skor baik) ===
    if p   > 15:   skor_baik += 3   # Protein tinggi
    elif p > 8:    skor_baik += 1

    if fi  > 5:    skor_baik += 3   # Serat tinggi
    elif fi > 2:   skor_baik += 1

    if e   < 100:  skor_baik += 2   # Kalori rendah
    if f   < 5:    skor_baik += 1   # Lemak rendah
    if s   < 3:    skor_baik += 1   # Gula rendah
    if na  < 100:  skor_baik += 1   # Natrium rendah

    # === Keputusan ===
    if skor_buruk >= 5:
        return 0   # HINDARI
    elif skor_buruk >= 2 or skor_baik <= 2:
        return 1   # HATI-HATI
    else:
        return 2   # AMAN

df_clean['label'] = df_clean.apply(buat_label, axis=1)

# Distribusi label
label_map  = {0: 'HINDARI', 1: 'HATI-HATI', 2: 'AMAN'}
label_counts = df_clean['label'].value_counts().sort_index()
ok("Distribusi label:")
for k, v in label_counts.items():
    bar = "█" * int(v/10)
    print(f"  {label_map[k]:12s}: {v:4d} data  {bar}")

# ══════════════════════════════════════════════════════════
# 4. PEMBAGIAN DATA TRAIN/TEST
# ══════════════════════════════════════════════════════════
header("4. PEMBAGIAN DATA TRAIN / TEST")

X = df_clean[FITUR]
y = df_clean['label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

ok(f"Data Training : {len(X_train)} data (80%)")
ok(f"Data Testing  : {len(X_test)} data (20%)")

# ══════════════════════════════════════════════════════════
# 5. TRAINING MODEL DECISION TREE
# ══════════════════════════════════════════════════════════
header("5. TRAINING MODEL — DECISION TREE")

model = DecisionTreeClassifier(
    max_depth=5,           # Kedalaman pohon max 5 level
    min_samples_split=10,  # Minimal 10 data untuk split
    min_samples_leaf=5,    # Minimal 5 data di leaf
    criterion='gini',      # Gini impurity
    random_state=42
)

model.fit(X_train, y_train)
ok("Model berhasil dilatih!")
info(f"Kedalaman pohon: {model.get_depth()} level")
info(f"Jumlah leaf nodes: {model.get_n_leaves()}")

# ══════════════════════════════════════════════════════════
# 6. PREDIKSI & EVALUASI
# ══════════════════════════════════════════════════════════
header("6. EVALUASI MODEL")

y_pred = model.predict(X_test)

acc = accuracy_score(y_test, y_pred)
ok(f"Accuracy  : {acc*100:.2f}%")

print()
print(classification_report(
    y_test, y_pred,
    target_names=['HINDARI', 'HATI-HATI', 'AMAN'],
    digits=3
))

# Feature importance
print(f"\n{C.BOLD}Feature Importance:{C.RESET}")
importance = pd.Series(model.feature_importances_, index=FITUR)
importance = importance.sort_values(ascending=False)
for feat, score in importance.items():
    bar = "█" * int(score * 50)
    print(f"  {feat:20s}: {score:.4f}  {bar}")

# ══════════════════════════════════════════════════════════
# 7. VISUALISASI
# ══════════════════════════════════════════════════════════
header("7. MEMBUAT VISUALISASI")

fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.suptitle('NutriCheck AI — Decision Tree Classification\nHasil Evaluasi Model',
             fontsize=16, fontweight='bold', color='#1A5C38', y=0.98)

COLORS = ['#D94F4F', '#F4A832', '#2D7A4F']

# ── Plot 1: Distribusi Label ──────────────────────────────
ax1 = axes[0, 0]
labels_name = ['HINDARI', 'HATI-HATI', 'AMAN']
values = [label_counts.get(i, 0) for i in range(3)]
bars = ax1.bar(labels_name, values, color=COLORS, edgecolor='white', linewidth=1.5)
ax1.set_title('Distribusi Label Dataset', fontweight='bold', fontsize=13, pad=12)
ax1.set_ylabel('Jumlah Data')
ax1.set_facecolor('#F7FAF8')
ax1.spines[['top', 'right']].set_visible(False)
for bar, val in zip(bars, values):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 10,
             str(val), ha='center', va='bottom', fontweight='bold', fontsize=12)
ax1.set_ylim(0, max(values) * 1.2)

# ── Plot 2: Confusion Matrix ──────────────────────────────
ax2 = axes[0, 1]
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Greens',
            xticklabels=labels_name, yticklabels=labels_name,
            ax=ax2, linewidths=0.5, linecolor='white',
            annot_kws={'size': 13, 'weight': 'bold'})
ax2.set_title('Confusion Matrix', fontweight='bold', fontsize=13, pad=12)
ax2.set_ylabel('Label Aktual', fontsize=11)
ax2.set_xlabel('Label Prediksi', fontsize=11)

# ── Plot 3: Feature Importance ────────────────────────────
ax3 = axes[1, 0]
feat_colors = ['#2D7A4F' if v > 0.15 else '#7BCFA0' for v in importance.values]
h_bars = ax3.barh(importance.index, importance.values,
                  color=feat_colors, edgecolor='white', linewidth=1)
ax3.set_title('Feature Importance', fontweight='bold', fontsize=13, pad=12)
ax3.set_xlabel('Importance Score')
ax3.set_facecolor('#F7FAF8')
ax3.spines[['top', 'right']].set_visible(False)
for bar, val in zip(h_bars, importance.values):
    ax3.text(val + 0.002, bar.get_y() + bar.get_height()/2,
             f'{val:.3f}', va='center', fontsize=10, fontweight='bold')
ax3.set_xlim(0, importance.max() * 1.25)

# ── Plot 4: Metrik Evaluasi ───────────────────────────────
ax4 = axes[1, 1]
ax4.set_facecolor('#F7FAF8')
ax4.axis('off')
ax4.set_title('Ringkasan Evaluasi Model', fontweight='bold', fontsize=13, pad=12)

from sklearn.metrics import precision_score, recall_score, f1_score
metrics_data = [
    ('Accuracy',  f'{accuracy_score(y_test, y_pred)*100:.2f}%',  '#2D7A4F'),
    ('Precision', f'{precision_score(y_test, y_pred, average="macro")*100:.2f}%', '#4CAF7D'),
    ('Recall',    f'{recall_score(y_test, y_pred, average="macro")*100:.2f}%',    '#7BCFA0'),
    ('F1-Score',  f'{f1_score(y_test, y_pred, average="macro")*100:.2f}%',        '#1A5C38'),
    ('Algoritma', 'Decision Tree', '#F4A832'),
    ('Max Depth', str(model.get_depth()), '#F4A832'),
    ('Data Train', f'{len(X_train)} data', '#888888'),
    ('Data Test',  f'{len(X_test)} data',  '#888888'),
]

for i, (label, value, color) in enumerate(metrics_data):
    row = i // 2
    col = i % 2
    x = 0.05 + col * 0.5
    y_pos = 0.85 - row * 0.22

    ax4.add_patch(mpatches.FancyBboxPatch(
        (x, y_pos - 0.12), 0.42, 0.18,
        boxstyle="round,pad=0.02",
        facecolor=color, alpha=0.15,
        edgecolor=color, linewidth=1.5,
        transform=ax4.transAxes
    ))
    ax4.text(x + 0.21, y_pos, value,
             transform=ax4.transAxes,
             ha='center', va='center',
             fontsize=16, fontweight='bold', color=color)
    ax4.text(x + 0.21, y_pos - 0.08,
             label,
             transform=ax4.transAxes,
             ha='center', va='center',
             fontsize=10, color='#4A6355')

plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.savefig('hasil_ml_model.png', dpi=150, bbox_inches='tight',
            facecolor='white', edgecolor='none')
ok("Visualisasi disimpan: hasil_ml_model.png")
plt.show()

# ── Pohon keputusan ───────────────────────────────────────
fig2, ax = plt.subplots(figsize=(20, 10))
plot_tree(
    model,
    feature_names=FITUR,
    class_names=['HINDARI', 'HATI-HATI', 'AMAN'],
    filled=True,
    rounded=True,
    fontsize=9,
    ax=ax,
    impurity=False,
    proportion=False
)
ax.set_title('NutriCheck AI — Decision Tree Visualization',
             fontsize=16, fontweight='bold', color='#1A5C38', pad=15)
plt.tight_layout()
plt.savefig('decision_tree_visualization.png', dpi=120, bbox_inches='tight',
            facecolor='white', edgecolor='none')
ok("Pohon keputusan disimpan: decision_tree_visualization.png")
plt.show()

# ══════════════════════════════════════════════════════════
# 8. CONTOH PREDIKSI
# ══════════════════════════════════════════════════════════
header("8. CONTOH PREDIKSI")

contoh_makanan = [
    {'nama': 'Mie Instan',     'energy_kcal': 330, 'protein_g': 7,  'carbohydrate_g': 49, 'fat_g': 12, 'sugar_g': 2,  'sodium_mg': 1300, 'fiber_g': 1},
    {'nama': 'Tempe Goreng',   'energy_kcal': 160, 'protein_g': 18, 'carbohydrate_g': 8,  'fat_g': 7,  'sugar_g': 0,  'sodium_mg': 8,    'fiber_g': 4},
    {'nama': 'Es Krim Coklat', 'energy_kcal': 250, 'protein_g': 4,  'carbohydrate_g': 30, 'fat_g': 13, 'sugar_g': 26, 'sodium_mg': 80,   'fiber_g': 0},
    {'nama': 'Sayur Bayam',    'energy_kcal': 35,  'protein_g': 3,  'carbohydrate_g': 5,  'fat_g': 0,  'sugar_g': 0,  'sodium_mg': 50,   'fiber_g': 6},
    {'nama': 'Ayam Bakar',     'energy_kcal': 190, 'protein_g': 28, 'carbohydrate_g': 1,  'fat_g': 8,  'sugar_g': 0,  'sodium_mg': 120,  'fiber_g': 0},
]

icon_map   = {0: '🚫', 1: '⚠️ ', 2: '✅'}
warna_map  = {0: C.MERAH, 1: C.KUNING, 2: C.HIJAU}
label_nama = {0: 'HINDARI', 1: 'HATI-HATI', 2: 'AMAN'}

print(f"  {'Makanan':<20} {'Hasil Prediksi':<30}")
print("  " + "─" * 50)

for m in contoh_makanan:
    fitur_input = [[
        m['energy_kcal'], m['protein_g'], m['carbohydrate_g'],
        m['fat_g'], m['sugar_g'], m['sodium_mg'], m['fiber_g']
    ]]
    pred = model.predict(fitur_input)[0]
    warna = warna_map[pred]
    print(f"  {m['nama']:<20} {warna}{icon_map[pred]} {label_nama[pred]}{C.RESET}")

# ══════════════════════════════════════════════════════════
# SELESAI
# ══════════════════════════════════════════════════════════
print(f"""
{C.HIJAU}{C.BOLD}
╔══════════════════════════════════════════════╗
║         ✅  Model Selesai Dijalankan!         ║
╠══════════════════════════════════════════════╣
║  Accuracy   : {acc*100:.2f}%                       ║
║  Algoritma  : Decision Tree                  ║
║  Data Train : {len(X_train)} data                      ║
║  Data Test  : {len(X_test)} data                       ║
╠══════════════════════════════════════════════╣
║  File yang dihasilkan:                       ║
║  📊 hasil_ml_model.png                       ║
║  🌳 decision_tree_visualization.png          ║
╚══════════════════════════════════════════════╝
{C.RESET}""")
