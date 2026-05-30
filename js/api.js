import { CONFIG, MOCK_DATA } from "./config.js?v=20260530a";

function cloneMock() {
  return JSON.parse(JSON.stringify(MOCK_DATA));
}

function normalizeData(payload) {
  const fb = cloneMock();
  if (!payload || typeof payload !== "object" || payload.error) return fb;

  return {
    ...fb,
    ...payload,
    summary:  { ...fb.summary,  ...(payload.summary  || {}) },
    overview: {
      ...fb.overview,
      ...(payload.overview || {}),
      rings:      payload.overview?.rings      || fb.overview.rings,
      quickStats: payload.overview?.quickStats || fb.overview.quickStats,
      segments:   payload.overview?.segments   || fb.overview.segments,
      categories: payload.overview?.categories || fb.overview.categories
    },
    trend:        payload.trend        || fb.trend,
    tshRanking:   payload.tshRanking   || fb.tshRanking,
    stores:       payload.stores       || fb.stores,
    brandMix:     payload.brandMix     || fb.brandMix,
    brandRanking: payload.brandRanking || fb.brandRanking || [],
    modelTable:   payload.modelTable   || fb.modelTable,
    highlights:   { ...fb.highlights,  ...(payload.highlights  || {}) },
    stockSummary: payload.stockSummary || fb.stockSummary,
    stockStack:   payload.stockStack   || fb.stockStack,
    risk:         payload.risk         || fb.risk,
    accessories:  payload.accessories  || fb.accessories,
    stockDetail:  payload.stockDetail  || null
  };
}

// Fetch stock_detail.json and merge into data object
async function fetchStockDetail(data) {
  try {
    const raw = await fetchWithTimeout("./data/stock_detail.json", 8000);
    if (raw && !raw.error) return { ...data, stockDetail: raw };
  } catch (_) { /* stock detail optional */ }
  return data;
}

export function getCacheKey(suffix) {
  return `era_engine_${CONFIG.CACHE_VERSION}_${suffix}`;
}

export function showSkeletonLoading() {
  document.getElementById("skeletonPanel")?.classList.remove("hidden");
}

export function hideSkeletonLoading() {
  document.getElementById("skeletonPanel")?.classList.add("hidden");
}

export function showErrorState() {
  document.getElementById("offlineBanner")?.classList.remove("hidden");
}

// Fetch dengan retry 1x dan timeout 10 detik
async function fetchWithTimeout(url, ms = 10000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

function safeLocalGet(key) {
  try { return localStorage.getItem(key); } catch (_) { return null; }
}

function safeLocalSet(key, value) {
  try { localStorage.setItem(key, value); } catch (_) { /* Safari private mode */ }
}

function safeLocalRemove(key) {
  try { localStorage.removeItem(key); } catch (_) { /* Safari private mode */ }
}

export async function fetchSalesData() {
  const cacheKey = getCacheKey("all");
  const cached = safeLocalGet(cacheKey);

  // Return cache jika masih valid
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CONFIG.CACHE_TTL) {
        return { ...normalizeData(data), source: "cache" };
      }
    } catch (_) {
      safeLocalRemove(cacheKey);
    }
  }

  showSkeletonLoading();

  // 1. Coba live_data.json (digenerate Python parser, di-deploy bersama site)
  try {
    const raw = await fetchWithTimeout("./data/live_data.json");
    if (raw && !raw.error) {
      let data = normalizeData(raw);
      data = await fetchStockDetail(data);
      safeLocalSet(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      hideSkeletonLoading();
      return { ...data, source: "live_json" };
    }
  } catch (_) {
    // lanjut ke fallback
  }

  // 2. Coba GAS API jika URL sudah dikonfigurasi
  const hasApi = CONFIG.API_URL && CONFIG.API_URL !== "YOUR_APPS_SCRIPT_WEB_APP_URL";
  if (hasApi) {
    try {
      const raw = await fetchWithTimeout(`${CONFIG.API_URL}?action=all`);
      if (raw && !raw.error) {
        const data = normalizeData(raw);
        safeLocalSet(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
        hideSkeletonLoading();
        return { ...data, source: "api" };
      }
    } catch (_) {
      // lanjut ke mock
    }
  }

  // 3. Mock fallback
  hideSkeletonLoading();
  showErrorState();
  console.warn("[ERA-ENGINE] Semua sumber gagal, menggunakan mock data");
  return { ...normalizeData(MOCK_DATA), source: "mock" };
}

// Invalidate cache agar fetch ulang data segar
export function invalidateCache() {
  safeLocalRemove(getCacheKey("all"));
}
