// ============================================================
// ERA-ENGINE — Google Apps Script Backend v2.0
// SIERA Platform · Erajaya Digital Region 5
// ============================================================
//
// PANDUAN SETUP (baca dulu sebelum deploy):
//
// 1. Isi SHEET_ID di bawah (ambil dari URL spreadsheet)
//    URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
//
// 2. Sesuaikan nama sheet di bagian SHEETS jika berbeda
//    Default nama yang diharapkan:
//    ─ "Overview"     → data summary & segment per baris
//    ─ "Store"        → data per toko
//    ─ "Brand"        → data brand & model
//    ─ "TSH"          → data per area manager
//    ─ "Accessories"  → data kategori aksesoris
//
// 3. Struktur kolom yang diharapkan per sheet:
//
//    Sheet "Overview" (satu baris per segment):
//    segment | target | mtd | est | wow | mom | yoy | timegone | under_timegone
//
//    Sheet "Store" (satu baris per toko):
//    site_code | site_desc | TSH | April | May | Stock | Est | DOS | Channel
//
//    Sheet "Brand" (satu baris per model):
//    brand_name | Model Type Detail | Model Category | Qty Apr | Qty May | Stock | DOS
//
//    Sheet "TSH" (satu baris per area manager):
//    TSH | PO Sales April | PO Sales May | Non-PO Sales April | Non-PO Sales May
//
//    Sheet "Accessories" (satu baris per kategori):
//    label | value
//
// 4. Deploy sebagai Web App:
//    Extensions → Apps Script → Deploy → New Deployment
//    Type: Web app
//    Execute as: Me
//    Who has access: Anyone
//    → Salin URL → paste ke js/config.js sebagai API_URL
//
// ============================================================

// ---- KONFIGURASI UTAMA ─ sesuaikan ini ----

var ERA_CONFIG = {
  SHEET_ID: "YOUR_GOOGLE_SHEET_ID", // ← WAJIB DIISI

  SHEETS: {
    OVERVIEW:    "Overview",
    STORE:       "Store",
    BRAND:       "Brand",
    TSH:         "TSH",
    ACCESSORIES: "Accessories"
  },

  PERIOD: {
    LABEL:         "1 - 25 Mei 2026",
    CURRENT_MONTH: "May",
    PREV_MONTH:    "April"
  },

  DOS_CRITICAL:  75,  // DOS lebih dari ini → kritis
  CACHE_SECONDS: 300  // Cache 5 menit di Apps Script
};

// ============================================================
// MAIN HANDLER
// ============================================================

function doGet(e) {
  var params  = (e && e.parameter) ? e.parameter : {};
  var action  = params.action || "all";

  try {
    // Cek cache dulu
    var cache    = CacheService.getScriptCache();
    var cacheKey = "era2_" + action;
    var hit      = cache.get(cacheKey);
    if (hit) {
      return jsonOk(JSON.parse(hit));
    }

    var payload;

    switch (action) {
      case "health":
        payload = { status: "ok", version: "2.0", ts: new Date().toISOString() };
        break;
      case "stores":
        payload = { stores: readStores(openSS()) };
        break;
      case "brands":
        payload = { brands: readBrands(openSS()) };
        break;
      case "overview":
        var ss = openSS();
        var ovRows = readOverview(ss);
        var stores = readStores(ss);
        payload = { overview: buildOverview(ovRows, stores) };
        break;
      default:
        payload = buildFullPayload();
    }

    var json = JSON.stringify(payload);
    if (json.length < 95000) {
      cache.put(cacheKey, json, ERA_CONFIG.CACHE_SECONDS);
    }
    return jsonOk(payload);

  } catch (err) {
    return jsonOk({ error: err.message, action: action, hint: "Cek SHEET_ID dan nama sheet di Code.gs" });
  }
}

function jsonOk(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function openSS() {
  if (!ERA_CONFIG.SHEET_ID || ERA_CONFIG.SHEET_ID === "YOUR_GOOGLE_SHEET_ID") {
    throw new Error("SHEET_ID belum diisi di Code.gs. Isi dulu sebelum deploy.");
  }
  return SpreadsheetApp.openById(ERA_CONFIG.SHEET_ID);
}

// ============================================================
// FULL PAYLOAD (endpoint default)
// ============================================================

function buildFullPayload() {
  var ss = openSS();

  var ovRows      = readOverview(ss);
  var stores      = readStores(ss);
  var brands      = readBrands(ss);
  var tshData     = readTsh(ss);
  var accessories = readAccessories(ss);

  var summary     = buildSummary(stores, ovRows);
  var overview    = buildOverview(ovRows, stores);
  var trend       = buildTrend(tshData);
  var tshRanking  = buildTshRanking(tshData);
  var stockSumm   = buildStockSummary(stores, summary);
  var stockStack  = buildStockStack(stores);
  var risk        = buildRiskTable(stores);
  var brandMix    = buildBrandMix(brands);
  var modelTable  = buildModelTable(brands);
  var highlights  = buildHighlights(brands);

  return {
    summary:      summary,
    overview:     overview,
    trend:        trend,
    tshRanking:   tshRanking,
    stores:       stores,
    brandMix:     brandMix,
    modelTable:   modelTable,
    highlights:   highlights,
    stockSummary: stockSumm,
    stockStack:   stockStack,
    risk:         risk,
    accessories:  accessories
  };
}

// ============================================================
// SHEET READERS — baca sheet & konversi ke array of objects
// ============================================================

function sheetToObjects(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  var headers = values[0].map(function(h) { return String(h).trim(); });
  return values.slice(1)
    .filter(function(row) {
      return row.some(function(cell) { return cell !== ""; });
    })
    .map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) {
        if (h) obj[h] = String(row[i] || "").trim();
      });
      return obj;
    });
}

// Baca sheet Overview — kolom: segment, target, mtd, est, wow, mom, yoy, timegone, under_timegone
function readOverview(ss) {
  return sheetToObjects(ss, ERA_CONFIG.SHEETS.OVERVIEW);
}

// Baca sheet Store — kolom: site_code, site_desc, TSH, April, May, Stock, Est, DOS, Channel
function readStores(ss) {
  var rows = sheetToObjects(ss, ERA_CONFIG.SHEETS.STORE);
  return rows.map(function(r) {
    return {
      siteCode: r["site_code"] || r["Site Code"] || r["Kode"] || "",
      siteDesc: r["site_desc"] || r["Site Desc"] || r["Nama Toko"] || r["Toko"] || "",
      tsh:      r["TSH"] || r["tsh"] || r["Area Manager"] || "",
      april:    pNum(r["April"] || r["Qty Apr"] || 0),
      may:      pNum(r["May"] || r["Mei"] || r["Qty May"] || 0),
      stock:    pNum(r["Stock"] || r["Stok"] || 0),
      est:      pNum(r["Est"] || r["Estimasi"] || 0),
      dos:      pNum(r["DOS"] || 0),
      channel:  r["Channel"] || r["Saluran"] || ""
    };
  }).filter(function(s) { return s.siteCode || s.siteDesc; });
}

// Baca sheet Brand — kolom: brand_name, Model Type Detail, Model Category, Qty Apr, Qty May, Stock, DOS
function readBrands(ss) {
  var rows = sheetToObjects(ss, ERA_CONFIG.SHEETS.BRAND);
  return rows.map(function(r) {
    return {
      brand:    r["brand_name"] || r["Brand"] || r["Merek"] || "",
      model:    r["Model Type Detail"] || r["Model"] || "",
      category: r["Model Category"] || r["Category"] || r["Kategori"] || "",
      qtyApr:   pNum(r["Qty Apr"] || r["April"] || 0),
      qtyMay:   pNum(r["Qty May"] || r["May"] || r["Mei"] || 0),
      stock:    pNum(r["Stock"] || r["Stok"] || 0),
      dos:      pNum(r["DOS"] || 0)
    };
  }).filter(function(b) { return b.brand || b.model; });
}

// Baca sheet TSH — kolom: TSH, PO Sales April, PO Sales May, Non-PO Sales April, Non-PO Sales May
function readTsh(ss) {
  var rows = sheetToObjects(ss, ERA_CONFIG.SHEETS.TSH);
  return rows.map(function(r) {
    return {
      tsh:      r["TSH"] || r["Area Manager"] || r["Nama"] || "",
      poApr:    pNum(r["PO Sales April"] || r["PO Apr"] || r["PO April"] || 0),
      poMay:    pNum(r["PO Sales May"]   || r["PO May"] || r["PO Mei"]   || 0),
      nonPoApr: pNum(r["Non-PO Sales April"] || r["Non PO Apr"] || r["NonPO April"] || 0),
      nonPoMay: pNum(r["Non-PO Sales May"]   || r["Non PO May"] || r["NonPO Mei"]   || 0)
    };
  }).filter(function(t) { return t.tsh; });
}

// Baca sheet Accessories — kolom: label, value
function readAccessories(ss) {
  var rows = sheetToObjects(ss, ERA_CONFIG.SHEETS.ACCESSORIES);
  if (!rows.length) return defaultAccessories();
  var result = rows.map(function(r) {
    return {
      label: r["label"] || r["Label"] || r["Category"] || r["Kategori"] || "",
      value: pNum(r["value"] || r["Value"] || r["Qty"] || r["Sales"] || 0)
    };
  }).filter(function(a) { return a.label && a.value > 0; });
  result.sort(function(a, b) { return b.value - a.value; });
  return result.length ? result : defaultAccessories();
}

// ============================================================
// DATA BUILDERS — transform raw rows ke format frontend
// ============================================================

function buildSummary(stores, ovRows) {
  var totalMay   = stores.reduce(function(s, t) { return s + t.may; }, 0);
  var totalApr   = stores.reduce(function(s, t) { return s + t.april; }, 0);
  var totalStock = stores.reduce(function(s, t) { return s + t.stock; }, 0);
  var withDos    = stores.filter(function(s) { return s.dos > 0; });
  var avgDos     = withDos.length
    ? withDos.reduce(function(s, t) { return s + t.dos; }, 0) / withDos.length
    : 0;
  var critical   = stores.filter(function(s) { return s.dos > ERA_CONFIG.DOS_CRITICAL; }).length;

  // Coba ambil nilai sales dari overview (baris pertama = All B2C)
  var totalSalesMay = 0, totalSalesApr = 0;
  if (ovRows.length) {
    var allRow = ovRows[0];
    totalSalesMay = pNum(allRow["mtd"] || allRow["MTD"] || 0);
    totalSalesApr = pNum(allRow["target"] || allRow["Target"] || 0);
  }

  return {
    totalSalesMay:   totalSalesMay || totalMay * 2200000,
    totalSalesApril: totalSalesApr || totalApr * 2200000,
    qtyMay:          totalMay,
    qtyApril:        totalApr,
    totalStock:      totalStock,
    avgDos:          Math.round(avgDos * 100) / 100,
    criticalStores:  critical,
    storeCount:      stores.length
  };
}

function buildOverview(ovRows, stores) {
  if (!ovRows.length) return defaultOverview(stores);

  var first    = ovRows[0];
  var tg       = pPct(first["timegone"]     || first["TG"]        || 81);
  var underTg  = pPct(first["under_timegone"] || first["Under TG"] || 19);
  var target   = pNum(first["target"]       || first["Target"]    || 0);
  var mtd      = pNum(first["mtd"]          || first["MTD"]       || 0);
  var est      = pNum(first["est"]          || first["EST"]       || 0);
  var wow      = first["wow"]  || first["WoW"]  || "0%";
  var mom      = first["mom"]  || first["MoM"]  || "0%";
  var yoy      = first["yoy"]  || first["YoY"]  || "0%";

  var mtdPct = target > 0 ? Math.round((mtd / target) * 100) : 0;
  var estPct = target > 0 ? Math.round((est / target) * 100) : 0;

  // Hitung AVG qty harian dari toko aktif
  var activeStores = stores.filter(function(s) { return s.may > 0; });
  var avgQty = activeStores.length
    ? Math.round(stores.reduce(function(s,t) { return s+t.may; }, 0) / activeStores.length)
    : 0;

  // Segment rows — semua baris di sheet
  var segments = ovRows.map(function(r) {
    var sTarget = pNum(r["target"] || 0);
    var sMtd    = pNum(r["mtd"]    || 0);
    var sEst    = pNum(r["est"]    || 0);
    var ePct    = sTarget > 0 ? Math.round((sEst / sTarget) * 100) : 0;
    return {
      title:    r["segment"] || r["Segment"] || "Segment",
      brand:    (r["segment"] || "").toLowerCase().replace(/[^a-z0-9]/g, "_"),
      est:      ePct,
      target:   sTarget,
      mtd:      sMtd,
      estValue: sEst,
      wow:      r["wow"] || r["WoW"] || "0%",
      mom:      r["mom"] || r["MoM"] || "0%",
      yoy:      r["yoy"] || r["YoY"] || "0%",
      tone:     ePct >= 100 ? "green" : ePct >= 80 ? "amber" : "red"
    };
  });

  // Category rows — filter baris yang punya kolom category
  var categories = buildCategories(ovRows);

  return {
    title:         "Sales Performance - B2C Region 5",
    periodLabel:   ERA_CONFIG.PERIOD.LABEL,
    timegone:      tg,
    underTimegone: underTg,
    targetUnits:   target,
    mtdUnits:      mtd,
    estUnits:      est,
    rings: [
      { label: "MTD", value: mtdPct, tone: tone(mtdPct) },
      { label: "EST", value: estPct, tone: tone(estPct) }
    ],
    quickStats: [
      { label: "WoW", value: wow },
      { label: "MoM", value: mom },
      { label: "YoY", value: yoy },
      { label: "AVG", value: fNum(avgQty) },
      { label: "ASP", value: target > 0 && mtd > 0 ? fNum(Math.round(target / mtd)) : "~" }
    ],
    segments:   segments,
    categories: categories
  };
}

function buildCategories(ovRows) {
  var catKeywords = ["device", "acc", "repair", "operator", "ce", "laptop", "kategori", "category"];
  var catCol = "category";

  // Cek apakah ada kolom "category" terpisah
  var catRows = ovRows.filter(function(r) {
    return r[catCol] || r["Category"] || r["Kategori"];
  });

  var source = catRows.length ? catRows : ovRows;
  var result = source.map(function(r) {
    var label  = r[catCol] || r["Category"] || r["Kategori"] || r["segment"] || "";
    var target = pNum(r["target"] || 0);
    var mtd    = pNum(r["mtd"]    || 0);
    var est    = pNum(r["est"]    || 0);
    var mPct   = target > 0 ? Math.round((mtd / target) * 100) : 0;
    var ePct   = target > 0 ? Math.round((est / target) * 100) : 0;
    return {
      label:  label,
      target: target,
      mtd:    mPct,
      est:    ePct,
      wow:    r["wow"] || r["WoW"] || "0%",
      mom:    r["mom"] || r["MoM"] || "0%",
      yoy:    r["yoy"] || r["YoY"] || "0%"
    };
  }).filter(function(c) { return c.label; });

  return result.length ? result : defaultCategories();
}

function buildTrend(tshData) {
  if (!tshData.length) return defaultTrend();
  var poApr    = tshData.reduce(function(s,t) { return s+t.poApr;    }, 0);
  var poMay    = tshData.reduce(function(s,t) { return s+t.poMay;    }, 0);
  var nonPoApr = tshData.reduce(function(s,t) { return s+t.nonPoApr; }, 0);
  var nonPoMay = tshData.reduce(function(s,t) { return s+t.nonPoMay; }, 0);
  return [
    { month: "April", po: poApr,    nonPo: nonPoApr },
    { month: "May",   po: poMay,    nonPo: nonPoMay }
  ];
}

function buildTshRanking(tshData) {
  if (!tshData.length) return [];
  return tshData
    .map(function(t) { return [t.tsh, t.poMay + t.nonPoMay]; })
    .filter(function(t) { return t[0] && t[1] > 0; })
    .sort(function(a, b) { return b[1] - a[1]; })
    .slice(0, 12);
}

function buildStockSummary(stores, summary) {
  var total    = stores.reduce(function(s, t) { return s + t.stock; }, 0);
  var avgDos   = summary ? summary.avgDos : 0;
  var critical = stores.filter(function(s) { return s.dos > ERA_CONFIG.DOS_CRITICAL; }).length;
  return [
    ["Total Stock",   fNum(total)  + " unit"],
    ["DOS Rata-rata", String(avgDos.toFixed(1)).replace(".", ",") + " hari"],
    ["Toko Kritis",   String(critical) + " toko"],
    ["Active Stores", String(stores.length) + " toko"]
  ];
}

function buildStockStack(stores) {
  var byTsh = {};
  stores.forEach(function(s) {
    if (!s.tsh) return;
    if (!byTsh[s.tsh]) {
      byTsh[s.tsh] = { tsh: s.tsh, erafone: 0, ibox: 0, eramore: 0, erablue: 0, samsung: 0, xiaomi: 0 };
    }
    var ch = (s.channel || "").toLowerCase();
    if (ch.indexOf("ibox")    !== -1) byTsh[s.tsh].ibox    += s.stock;
    else if (ch.indexOf("more")    !== -1) byTsh[s.tsh].eramore += s.stock;
    else if (ch.indexOf("blue")    !== -1) byTsh[s.tsh].erablue += s.stock;
    else if (ch.indexOf("samsung") !== -1) byTsh[s.tsh].samsung += s.stock;
    else if (ch.indexOf("xiaomi")  !== -1) byTsh[s.tsh].xiaomi  += s.stock;
    else                                    byTsh[s.tsh].erafone += s.stock;
  });
  return Object.keys(byTsh).map(function(k) { return byTsh[k]; })
    .sort(function(a, b) {
      return (b.erafone+b.ibox+b.eramore+b.erablue+b.samsung+b.xiaomi)
           - (a.erafone+a.ibox+a.eramore+a.erablue+a.samsung+a.xiaomi);
    }).slice(0, 8);
}

function buildRiskTable(stores) {
  return stores
    .filter(function(s) { return s.dos > ERA_CONFIG.DOS_CRITICAL && s.stock > 0; })
    .sort(function(a, b) { return b.dos - a.dos; })
    .slice(0, 12)
    .map(function(s) { return [s.siteDesc, s.channel, s.stock, s.dos, s.tsh]; });
}

function buildBrandMix(brands) {
  var byBrand = {};
  brands.forEach(function(b) {
    var key = (b.brand || "Lainnya").toUpperCase();
    byBrand[key] = (byBrand[key] || 0) + b.qtyMay;
  });
  var sorted = Object.keys(byBrand)
    .map(function(k) { return [k, byBrand[k]]; })
    .sort(function(a, b) { return b[1] - a[1]; });
  var top2   = sorted.slice(0, 2).map(function(e) { return { label: e[0], value: e[1] }; });
  var others = sorted.slice(2).reduce(function(s, e) { return s + e[1]; }, 0);
  if (others > 0) top2.push({ label: "Lainnya", value: others });
  return top2;
}

function buildModelTable(brands) {
  return brands
    .sort(function(a, b) { return b.qtyMay - a.qtyMay; })
    .slice(0, 20)
    .map(function(b) {
      return [b.brand.toUpperCase(), b.model, b.category, b.qtyApr, b.qtyMay, b.stock, b.dos];
    });
}

function buildHighlights(brands) {
  if (!brands.length) return defaultHighlights();
  var byMay = brands.slice().sort(function(a, b) { return b.qtyMay - a.qtyMay; });
  var byDos = brands.filter(function(b) { return b.stock > 50; })
                    .sort(function(a, b) { return b.dos - a.dos; });
  var best = byMay[0] || {};
  var dead = byDos[0] || {};
  return {
    bestSeller: {
      title: "Best Seller",
      model: best.model || "-",
      value: fNum(best.qtyMay || 0) + " unit",
      note:  "Momentum " + ERA_CONFIG.PERIOD.CURRENT_MONTH + " tertinggi di bulan ini."
    },
    deadStock: {
      title: "Dead Stock Risk",
      model: dead.model || "-",
      value: "DOS " + String((dead.dos || 0).toFixed(1)).replace(".", ",") + " hari",
      note:  "Perlu intervensi pricing dan rotasi stok segera."
    }
  };
}

// ============================================================
// DEFAULT DATA (fallback saat sheet kosong / belum ada)
// ============================================================

function defaultOverview(stores) {
  stores = stores || [];
  return {
    title: "Sales Performance - B2C Region 5",
    periodLabel: ERA_CONFIG.PERIOD.LABEL,
    timegone: 0, underTimegone: 0,
    targetUnits: 0, mtdUnits: 0, estUnits: 0,
    rings: [
      { label: "MTD", value: 0, tone: "red" },
      { label: "EST", value: 0, tone: "red" }
    ],
    quickStats: [
      { label: "WoW", value: "0%" }, { label: "MoM", value: "0%" },
      { label: "YoY", value: "0%" }, { label: "AVG", value: "0" }, { label: "ASP", value: "0" }
    ],
    segments: [],
    categories: defaultCategories()
  };
}

function defaultCategories() {
  return ["Device","Acc","Repair Contract","Operator","CE","Laptop"].map(function(l) {
    return { label: l, target: 0, mtd: 0, est: 0, wow: "0%", mom: "0%", yoy: "0%" };
  });
}

function defaultTrend() {
  return [
    { month: "April", po: 0, nonPo: 0 },
    { month: "May",   po: 0, nonPo: 0 }
  ];
}

function defaultHighlights() {
  return {
    bestSeller: { title: "Best Seller",     model: "-", value: "-", note: "Data belum tersedia." },
    deadStock:  { title: "Dead Stock Risk", model: "-", value: "-", note: "Data belum tersedia." }
  };
}

function defaultAccessories() {
  return [
    { label: "Shopping Bag",     value: 0 },
    { label: "Screen Protector", value: 0 },
    { label: "Charger",          value: 0 },
    { label: "Audio Products",   value: 0 },
    { label: "Wearable",         value: 0 },
    { label: "Case & Sleeve",    value: 0 }
  ];
}

// ============================================================
// UTILITIES
// ============================================================

// Parse angka dari string Indonesia (titik = ribuan, koma = desimal)
function pNum(str) {
  if (typeof str === "number") return str;
  if (!str || str === "") return 0;
  var s = String(str)
    .replace(/[Rp\s%]/g, "")
    .replace(/\./g, "")   // hapus titik ribuan
    .replace(",", ".");    // ubah koma desimal jadi titik
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

// Parse persen
function pPct(str) {
  if (typeof str === "number") return str;
  return parseFloat(String(str).replace("%", "").replace(",", ".")) || 0;
}

// Format angka Indonesia
function fNum(n) {
  return new Intl.NumberFormat("id-ID").format(Math.round(n));
}

// Tone berdasarkan persentase pencapaian
function tone(pct) {
  if (pct >= 100) return "green";
  if (pct >= 80)  return "amber";
  return "red";
}

// ============================================================
// UTILITY: Test fungsi ini langsung di Apps Script editor
// Jalankan testRun() untuk cek output tanpa deploy
// ============================================================
function testRun() {
  var result = buildFullPayload();
  Logger.log(JSON.stringify(result, null, 2));
}
