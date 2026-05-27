import { CONFIG, MOCK_DATA } from "./config.js?v=20260527c";

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
    modelTable:   payload.modelTable   || fb.modelTable,
    highlights:   { ...fb.highlights,  ...(payload.highlights  || {}) },
    stockSummary: payload.stockSummary || fb.stockSummary,
    stockStack:   payload.stockStack   || fb.stockStack,
    risk:         payload.risk         || fb.risk,
    accessories:  payload.accessories  || fb.accessories
  };
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

export async function fetchSalesData() {
  const cacheKey = getCacheKey("all");
  const cached = localStorage.getItem(cacheKey);

  // Return cache jika masih valid
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CONFIG.CACHE_TTL) {
        return { ...normalizeData(data), source: "cache" };
      }
    } catch (_) {
      localStorage.removeItem(cacheKey);
    }
  }

  // Preview mode — langsung pakai mock
  const isPreview = !CONFIG.API_URL || CONFIG.API_URL === "YOUR_APPS_SCRIPT_WEB_APP_URL";
  if (isPreview) {
    document.getElementById("offlineBanner")?.classList.remove("hidden");
    return { ...normalizeData(MOCK_DATA), source: "mock" };
  }

  // Coba ambil dari API
  showSkeletonLoading();
  try {
    const url  = `${CONFIG.API_URL}?action=all`;
    const raw  = await fetchWithTimeout(url);

    // Jika API mengembalikan error field
    if (raw.error) throw new Error(raw.error);

    const data = normalizeData(raw);
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    hideSkeletonLoading();
    return { ...data, source: "api" };

  } catch (err) {
    hideSkeletonLoading();
    showErrorState();
    console.warn("[ERA-ENGINE] API error, fallback ke mock:", err.message);
    return { ...normalizeData(MOCK_DATA), source: "mock" };
  }
}

// Invalidate cache agar fetch ulang data segar
export function invalidateCache() {
  localStorage.removeItem(getCacheKey("all"));
}
