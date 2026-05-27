# ERA-ENGINE Project Prompt

## Tujuan

Bantu saya membangun **mobile-first frontend dashboard** bernama **ERA-ENGINE** untuk **SIERA Platform - Erajaya Digital Region 5**.

Dashboard ini dipakai untuk memonitor:

- Sales Performance B2C Region 5
- Sales vs Stock
- DOS (Days of Stock)
- Segment Performance
- Category Performance
- Store Performance
- Brand Performance
- Inventory Intelligence

Target utamanya adalah **mobile web iPhone**, dibuka lewat **Safari** dan **Chrome**, dengan rasa visual **elegan, eksekutif, premium, futuristic, high-tech**, tetapi tetap **enterprise-grade** dan **mudah dibaca cepat**.

---

## Peran AI

Kamu adalah:

- Expert Frontend Developer
- Expert UI/UX Designer
- Expert Mobile Web Dashboard Designer
- Expert Data Visualization Designer

Kamu harus menghasilkan dashboard yang **siap dijadikan preview localhost**, lalu **mudah dihubungkan ke Google Sheets / Google Apps Script API**.

---

## Teknologi Wajib

Gunakan stack berikut:

- **Vanilla HTML**
- **Vanilla CSS**
- **Vanilla JavaScript**
- **Chart.js v4 via CDN**
- **Tanpa React / Vue / Next / Tailwind / bundler**
- Semua file harus bisa berjalan sebagai static frontend

Struktur file:

```txt
era-engine/
├── index.html
├── css/
│   ├── main.css
│   ├── components.css
│   └── mobile.css
├── js/
│   ├── config.js
│   ├── api.js
│   ├── charts.js
│   ├── ui.js
│   ├── filters.js
│   └── main.js
├── assets/
│   └── icons/
├── Code.gs
└── netlify.toml
```

---

## Konteks Data

Data berasal dari file / Google Sheets `Sales vs Stock`.

Kolom-kolom utama:

### Overview / Sales

- `target`
- `mtd`
- `est`
- `wow`
- `mom`
- `yoy`
- `timegone`
- `under_timegone`

### Per Store

- `site_code`
- `site_desc`
- `TSH`
- `April`
- `May`
- `Stock`
- `Est`
- `DOS`
- `Channel`

### Per Brand / Model

- `brand_name`
- `Model Type Detail`
- `Model Category`
- `Qty Apr`
- `Qty May`
- `Stock`
- `DOS`

### Per TSH

- `TSH`
- `PO Sales April`
- `PO Sales May`
- `Non-PO Sales April`
- `Non-PO Sales May`

---

## Gaya Visual Utama

Gabungkan karakter dari dua referensi visual berikut:

### Referensi 1

- dark premium interface
- circular gauges / performance rings
- warm orange glow
- dashboard seperti cockpit / control center
- depth, bevel, inner shadow, neumorphic-dark feel

### Referensi 2

- executive slate-dark dashboard
- modular card layout
- clean graph panels
- subtle border, soft glow, calm hierarchy
- elegant, minimal, readable

### Hasil yang diinginkan

Gabungkan keduanya menjadi:

- **Elegant**
- **Executive**
- **High-tech**
- **Premium**
- **Dark modern dashboard**
- **Warm orange accent**
- **Slate / charcoal surfaces**
- **Soft futuristic glow**

Jangan terlihat seperti:

- gamer UI
- crypto dashboard murahan
- neon ungu berlebihan
- landing page hero besar yang menghabiskan layar

Harus terasa seperti:

- command center
- executive operations cockpit
- premium analytics dashboard

---

## Design Direction

### Color System

Gunakan nuansa berikut:

- background utama: charcoal gelap / slate black
- panel: dark graphite / blue-black
- accent utama: warm orange
- accent sekunder: soft amber
- accent pendukung: cool steel blue
- success: neon green halus
- warning: amber
- danger: orange-red

Contoh arah warna:

```css
--bg-primary: #10141b;
--bg-surface: #181c24;
--bg-elevated: #1c212b;
--accent-orange: #ff6a2b;
--accent-orange-soft: #ff8e4c;
--accent-amber: #ffb15b;
--accent-green: #47f0b7;
--text-primary: #f5f1eb;
--text-secondary: #b0b7c4;
--text-muted: #677182;
```

### Surface Feel

Semua card harus punya karakter:

- dark layered panels
- subtle inner highlight
- subtle inner shadow
- soft border
- depth seperti hardware panel / modern control desk

### Typography

Gunakan:

- `Inter`
- `Plus Jakarta Sans`

Aturan:

- heading tegas
- angka penting besar tapi tetap kompak
- label uppercase dengan tracking lebar
- body text ringkas dan profesional

---

## Prinsip Layout

Dashboard harus **mobile-first**, bukan desktop dashboard yang dipaksa mengecil.

### Aturan penting

- viewport iPhone-friendly
- fixed bottom nav
- sticky top header
- section harus padat dan cepat dibaca
- homepage tidak boleh seperti landing page panjang

### Mode visual

Saat dibuka di desktop/laptop:

- tampil tetap seperti mobile dashboard canvas di tengah
- ada ambience background di sekelilingnya
- terlihat seperti preview iPhone / app shell

---

## Struktur Halaman

### 1. Top Header

Isi:

- logo / mark ERA-ENGINE
- label `SIERA Platform`
- title `ERA-ENGINE`
- subtitle `Sales Intelligence · Region 5`
- badge `LIVE`
- badge workspace `R5 Sales Grid`

Header harus elegan, padat, dan premium.

### 2. Executive Intro Strip

Bagian paling atas homepage harus seperti executive strip, bukan hero besar.

Isi:

- label kecil `Executive Overview`
- short headline:
  `Sales command desk untuk monitoring cepat Region 5`
- short support text:
  `Fokus ke target, MTD, estimasi closing, dan eksekusi sell-out harian`
- search shell
- period selector: `April`, `May`, `Apr-May`
- 3 mini status card:
  - Command Mode
  - Mission Pulse
  - Field Sync

### 3. Overview Headline

Card utama overview:

- title: `Sales Performance B2C Region 5`
- period info
- TG
- under timegone
- source chip: `Preview / Cached / Live API`

### 4. KPI Strip

4 KPI cards:

- Total Sales
- Total Qty
- Total Stock
- AVG DOS

Harus:

- compact
- elegant
- readable
- ada badge performance

### 5. Achievement Snapshot

Isi:

- Target
- MTD
- EST
- ring progress:
  - MTD %
  - EST %
- quick stats:
  - WoW
  - MoM
  - YoY
  - AVG
  - ASP

### 6. Overview Action / Insight

Card insight singkat:

- area yang perlu dikawal
- execution pulse
- insight operasional

### 7. Segment Performance

Grid card untuk:

- All B2C
- Multibrand
- Operator Store
- Monobrand
- Xiaomi
- Honor

Tiap card:

- segment label
- title
- status: under target / near target / over target
- ring kecil `% EST`
- 3 angka:
  - Target
  - MTD
  - EST
- 3 mini trend:
  - WoW
  - MoM
  - YoY

Angka harus:

- proporsional
- tidak keluar dari card
- untuk mobile gunakan format compact seperti `192,8K`, `2,8K`, `1,2M`

### 8. Category Performance

Card list untuk:

- Device
- Acc
- Repair Contract
- Operator
- CE
- Laptop

Tiap category:

- target
- MTD
- WoW
- MoM
- YoY
- progress bar
- EST badge

### 9. Trend

Chart line / area:

- Sales PO vs Non-PO
- visual clean
- accent warm orange / steel blue
- chart panel elegan

### 10. TSH Performance

Horizontal ranking / bar chart:

- ranking MTD Mei
- clean
- compact
- readable

### 11. Bottom Navigation

Tab:

- Overview
- Toko
- Brand
- Stock
- Aksesoris

Gaya:

- glass dark
- active state subtle glowing orange
- tidak terlalu tebal

---

## Detail UI yang Wajib

### Progress Ring

Gunakan ring yang:

- halus
- proporsional
- tidak terlihat pecah
- gunakan SVG stroke jika perlu
- bukan conic-gradient kasar

### Angka Besar

Gunakan format:

- `192,8K`
- `2,8K`
- `1,2M`
- `Rp 327,8 M`

Jangan biarkan:

- angka keluar card
- angka bertabrakan
- angka menjadi `19...`

### Background & Ambience

Harus ada:

- dark cinematic background
- subtle grid / blueprint ambience
- soft orange bloom
- steel-blue ambient haze
- app-shell frame yang premium

### Shadows

Gunakan:

- inner highlight tipis
- inset shadow halus
- outer shadow lembut
- glow kecil hanya pada elemen penting

---

## Larangan

Jangan buat:

- hero landing page terlalu besar
- ungu neon mendominasi
- layout terlalu kosong
- chart terlalu ramai
- card terlalu banyak padding
- angka keluar dari cards
- desktop layout yang dikecilkan mentah

---

## Output Yang Diinginkan

Buat:

1. Frontend dashboard preview yang langsung jalan di localhost
2. Mobile-first canvas yang terlihat premium
3. Design ambience yang elegan dan eksekutif
4. Struktur code rapi dan modular
5. Mudah dihubungkan ke Google Apps Script API

---

## Kualitas Akhir

Dashboard final harus terasa seperti:

- modern executive sales cockpit
- elegant premium monitoring app
- high-tech but readable
- dark luxury analytics dashboard
- cocok untuk management dan operasional lapangan

Jika perlu memilih, prioritaskan:

1. keterbacaan cepat
2. hierarchy informasi
3. elegance
4. consistency
5. futuristik yang tetap profesional

---

## Instruksi Implementasi

Lakukan implementasi secara bertahap:

1. bangun struktur HTML
2. buat design token dan ambience background
3. buat system card / panel / ring / badges
4. buat homepage overview paling dulu
5. buat chart dan panel data lain
6. tambahkan fallback dummy data
7. pastikan semua aman di localhost
8. optimalkan untuk Safari / Chrome iPhone

Jika ada konflik antara cantik vs terbaca, prioritaskan **terbaca**.

