import { CONFIG } from "./config.js?v=20260527i";
import { fetchSalesData, invalidateCache } from "./api.js?v=20260527i";
import { getFilteredStores } from "./filters.js?v=20260527i";
import {
  bindDosAlert,
  bindStoreSearch,
  openStoreModal,
  renderAccessoriesSection,
  renderBrandSection,
  renderDosAlert,
  renderKpis,
  renderOverviewSections,
  renderStockSection,
  renderStoreFilters,
  renderStoreList,
  setupTabs
} from "./ui.js?v=20260527i";
import {
  renderAccessoriesChart,
  renderSalesTrendChart,
  renderStockChart,
  renderTshChart
} from "./charts.js?v=20260527i";

const storeUiState = {
  query: "",
  channel: "Semua",
  sort: "sales"
};

let appData;
let activeTab = CONFIG.DEFAULT_TAB;
const initializedCharts = new Set();

function renderApp(data) {
  renderOverviewSections(data);
  renderKpis(data);
  renderDosAlert(data);
  renderBrandSection(data);
  renderStockSection(data);
  renderAccessoriesSection(data);
  // Store list is lazy-rendered on first Toko tab activation
}

function renderActiveTabCharts(tab) {
  if (initializedCharts.has(tab)) return;
  if (tab === "overview") {
    renderSalesTrendChart(appData);
    renderTshChart(appData);
  }

  if (tab === "stock") {
    renderStockChart(appData);
  }
  if (tab === "aksesoris") {
    renderAccessoriesChart(appData);
  }
  initializedCharts.add(tab);
}

function refreshStoreList() {
  const filtered = getFilteredStores(appData.stores, storeUiState);
  renderStoreList(filtered, openStoreModal);
}

function bindStoreControls() {
  renderStoreFilters(storeUiState, (partial) => {
    Object.assign(storeUiState, partial);
    bindStoreControls();
    refreshStoreList();
  });
}

async function init() {
  appData = await fetchSalesData();
  renderApp(appData);
  bindStoreControls();
  bindStoreSearch((value) => {
    storeUiState.query = value;
    refreshStoreList();
  });

  setupTabs(CONFIG.DEFAULT_TAB, (tab) => {
    activeTab = tab;
    if (tab === "toko") refreshStoreList();
    renderActiveTabCharts(tab);
  });

  bindDosAlert(() => {
    document.querySelector('[data-tab-target="stock"]').click();
  });

  document.getElementById("refreshButton").addEventListener("click", async () => {
    invalidateCache();
    initializedCharts.clear();
    appData = await fetchSalesData();
    renderApp(appData);
    if (activeTab === "toko") refreshStoreList();
    renderActiveTabCharts(activeTab);
  });

  renderActiveTabCharts(CONFIG.DEFAULT_TAB);
}

init();
