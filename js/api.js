import { CONFIG, MOCK_DATA } from "./config.js?v=20260527c";

function cloneMockData() {
  return JSON.parse(JSON.stringify(MOCK_DATA));
}

function normalizeData(payload = {}) {
  const fallback = cloneMockData();

  return {
    ...fallback,
    ...payload,
    summary: { ...fallback.summary, ...(payload.summary || {}) },
    overview: {
      ...fallback.overview,
      ...(payload.overview || {}),
      rings: payload.overview?.rings || fallback.overview.rings,
      quickStats: payload.overview?.quickStats || fallback.overview.quickStats,
      segments: payload.overview?.segments || fallback.overview.segments,
      categories: payload.overview?.categories || fallback.overview.categories
    },
    trend: payload.trend || fallback.trend,
    tshRanking: payload.tshRanking || fallback.tshRanking,
    stores: payload.stores || fallback.stores,
    brandMix: payload.brandMix || fallback.brandMix,
    modelTable: payload.modelTable || fallback.modelTable,
    highlights: { ...fallback.highlights, ...(payload.highlights || {}) },
    stockSummary: payload.stockSummary || fallback.stockSummary,
    stockStack: payload.stockStack || fallback.stockStack,
    risk: payload.risk || fallback.risk,
    accessories: payload.accessories || fallback.accessories
  };
}

export function getCacheKey(sheetName = "Pivot") {
  return `era_engine_${CONFIG.CACHE_VERSION}_${sheetName}`;
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

export async function fetchSalesData(sheetName = "Pivot") {
  const cacheKey = getCacheKey(sheetName);
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CONFIG.CACHE_TTL) {
      return { ...normalizeData(data), source: "cache" };
    }
  }

  try {
    showSkeletonLoading();
    if (!CONFIG.API_URL || CONFIG.API_URL === "YOUR_APPS_SCRIPT_WEB_APP_URL") {
      throw new Error("Preview mode");
    }
    const res = await fetch(`${CONFIG.API_URL}?sheet=${sheetName}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = normalizeData(await res.json());
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    hideSkeletonLoading();
    return { ...data, source: "api" };
  } catch (err) {
    hideSkeletonLoading();
    showErrorState(err);
    return { ...normalizeData(MOCK_DATA), source: "mock" };
  }
}
