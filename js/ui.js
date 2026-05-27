import { STORE_FILTERS, STORE_SORTS } from "./config.js?v=20260527g";
import { getDosProgress, getDosTone } from "./filters.js?v=20260527g";

function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatCompactMetric(value) {
  const numeric = Number(value) || 0;
  if (Math.abs(numeric) >= 1000000) {
    return `${(numeric / 1000000).toFixed(1).replace(".", ",")}M`;
  }
  if (Math.abs(numeric) >= 1000) {
    return `${(numeric / 1000).toFixed(1).replace(".", ",")}K`;
  }
  return new Intl.NumberFormat("id-ID").format(numeric);
}

function formatCompactCurrency(value) {
  if (Math.abs(value) >= 1e12) return `Rp ${(value / 1e12).toFixed(1).replace(".", ",")} T`;
  return `Rp ${(value / 1e9).toFixed(1).replace(".", ",")} M`;
}

function getRingToneColor(tone) {
  if (tone === "green") return "var(--accent-green)";
  if (tone === "amber") return "var(--accent-amber)";
  return "var(--accent-red)";
}

function getPerformanceTone(value) {
  if (value >= 100) return "safe";
  if (value >= 80) return "warn";
  return "danger";
}

function renderRingSvg(value, tone, size = 132, stroke = 14, label = "") {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const offset = circumference * (1 - safeValue / 100);
  return `
    <svg viewBox="0 0 ${size} ${size}" class="ring-svg" aria-hidden="true">
      <circle
        class="ring-track"
        cx="${size / 2}"
        cy="${size / 2}"
        r="${radius}"
        stroke-width="${stroke}"
      ></circle>
      <circle
        class="ring-progress ring-progress--${tone}"
        cx="${size / 2}"
        cy="${size / 2}"
        r="${radius}"
        stroke-width="${stroke}"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${offset}"
      ></circle>
    </svg>
    <div class="achievement-ring__inner">
      <strong>${safeValue}%</strong>
      <span>${label}</span>
    </div>
  `;
}

export function renderKpis(data) {
  const diffSales = ((data.summary.totalSalesMay - data.summary.totalSalesApril) / data.summary.totalSalesApril) * 100;
  const diffQty = ((data.summary.qtyMay - data.summary.qtyApril) / data.summary.qtyApril) * 100;
  const cards = [
    ["Total Sales", formatCompactCurrency(data.summary.totalSalesMay), `${diffSales >= 0 ? "▲" : "▼"} ${Math.abs(diffSales).toFixed(1)}% vs Apr`, diffSales >= 0 ? "positive" : "negative", "Revenue netto MTD Mei"],
    ["Total Qty", `${formatNumber(data.summary.qtyMay)} unit`, `${diffQty >= 0 ? "▲" : "▼"} ${Math.abs(diffQty).toFixed(1)}% vs Apr`, diffQty >= 0 ? "positive" : "negative", "Movement unit terjual"],
    ["Total Stock", `${formatNumber(data.summary.totalStock)} unit`, "Stock aktif seluruh jaringan", "warning", "PO + Non-PO"],
    ["AVG DOS", `${data.summary.avgDos.toFixed(1).replace(".", ",")} hari`, "Target ideal < 60 hari", "warning", "Butuh akselerasi sell-out"]
  ];
  document.getElementById("kpiStrip").innerHTML = cards.map(([label, value, badge, tone, meta]) => `
    <article class="card kpi-card">
      <div class="kpi-card__line">
        <p class="kpi-label">${label}</p>
        <span class="kpi-card__orb"></span>
      </div>
      <h4 class="kpi-value" data-countup="${value}">${value}</h4>
      <span class="kpi-badge ${tone}">${badge}</span>
      <p class="kpi-meta">${meta}</p>
    </article>
  `).join("");
}

export function renderOverviewSections(data) {
  const overview = data.overview || {};
  const sourceLabel = data.source === "api" ? "Live API" : data.source === "cache" ? "Cached" : "Preview";
  const headlineMeta = [
    overview.periodLabel || "1 - 25 Mei 2026",
    `TG: ${overview.timegone ?? 81}%`,
    `${overview.underTimegone ?? 19}% under timegone`
  ];
  document.getElementById("overviewHeadlineMeta").innerHTML = `
    ${headlineMeta.map((item) => `<span>${item}</span>`).join("")}
    <span class="source-chip">${sourceLabel}</span>
  `;

  document.getElementById("achievementPanel").innerHTML = `
    <div class="ring-panel__header">
      <div>
        <p class="section-kicker">Achievement Snapshot</p>
        <h4>Target · MTD · Estimasi</h4>
        <p class="panel-caption">Ring performance utama untuk pembacaan cepat area B2C Region 5.</p>
      </div>
    </div>
    <div class="target-strip">
      <article class="target-box"><span>Target</span><strong>${formatNumber(overview.targetUnits)}</strong></article>
      <article class="target-box"><span>MTD</span><strong>${formatNumber(overview.mtdUnits)}</strong></article>
      <article class="target-box"><span>EST.</span><strong>${formatNumber(overview.estUnits)}</strong></article>
    </div>
    <div class="ring-duo">
      ${overview.rings.map((ring) => `
        <article class="achievement-ring-card">
          <div class="achievement-ring">
            ${renderRingSvg(ring.value, ring.tone, 132, 14, ring.label)}
          </div>
        </article>
      `).join("")}
    </div>
    <div class="quick-stat-row">
      ${overview.quickStats.map((item) => `
        <article class="quick-stat-box">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </article>
      `).join("")}
    </div>
  `;

  document.getElementById("overviewInsightStack").innerHTML = `
    <div class="insight-stack__block">
      <p class="section-kicker">Overview Action</p>
      <h4>Area utama yang perlu dikawal hari ini</h4>
      <ul class="insight-list">
        <li>Dorong closing category Device dan Operator yang sudah mendekati target.</li>
        <li>Monitor area dengan DOS tinggi agar estimasi tidak jatuh di akhir bulan.</li>
        <li>Fokuskan follow-up ke channel yang masih under timegone.</li>
      </ul>
    </div>
    <div class="insight-stack__pulse">
      <span>Execution Pulse</span>
      <strong>${overview.timegone}%</strong>
      <p>Tim berada di bawah timegone sebesar ${overview.underTimegone}% dan butuh akselerasi sell-out.</p>
    </div>
  `;

  document.getElementById("segmentGrid").innerHTML = overview.segments.map((segment) => `
    <article class="segment-card">
      <div class="segment-card__head">
        <div>
          <p class="section-kicker">${segment.brand || "b2c"}</p>
          <h5>${segment.title}</h5>
          <p class="segment-card__status ${getPerformanceTone(segment.est)}">${segment.est >= 100 ? "Over target" : segment.est >= 80 ? "Near target" : "Under target"}</p>
        </div>
        <div class="segment-mini-ring">
          ${renderRingSvg(segment.est, segment.tone, 72, 9, "EST")}
        </div>
      </div>
      <div class="segment-stats">
        <div><span>Target</span><strong title="${formatNumber(segment.target)}">${formatCompactMetric(segment.target)}</strong></div>
        <div><span>MTD</span><strong title="${formatNumber(segment.mtd)}">${formatCompactMetric(segment.mtd)}</strong></div>
        <div><span>EST</span><strong title="${formatNumber(segment.estValue)}">${formatCompactMetric(segment.estValue)}</strong></div>
      </div>
      <div class="segment-trend">
        <span>WoW ${segment.wow}</span>
        <span>MoM ${segment.mom}</span>
        <span>YoY ${segment.yoy}</span>
      </div>
    </article>
  `).join("");

  document.getElementById("categoryPerformance").innerHTML = overview.categories.map((item) => `
    <article class="category-card">
      <div class="category-card__top">
        <div>
          <p class="section-kicker">Category</p>
          <h5>${item.label}</h5>
          <p class="category-card__caption">Progress harian terhadap estimasi closing.</p>
        </div>
        <span class="badge ${getPerformanceTone(item.est)}">EST ${item.est}%</span>
      </div>
      <div class="category-card__stats">
        <div><span>Target</span><strong>${formatNumber(item.target)}</strong></div>
        <div><span>MTD</span><strong>${item.mtd}%</strong></div>
        <div><span>WoW</span><strong>${item.wow}</strong></div>
        <div><span>MoM</span><strong>${item.mom}</strong></div>
        <div><span>YoY</span><strong>${item.yoy}</strong></div>
      </div>
      <div class="category-progress">
        <div class="category-progress__bar"><span style="width:${Math.min(item.est, 100)}%"></span></div>
      </div>
    </article>
  `).join("");
}

export function renderDosAlert(data) {
  document.getElementById("dosAlertTitle").textContent = `⚠ ${data.summary.criticalStores} toko dengan DOS kritis`;
  document.getElementById("dosAlertText").textContent = `Rata-rata DOS region saat ini ${data.summary.avgDos.toFixed(1).replace(".", ",")} hari. Fokuskan tindakan ke tab Stock.`;
}

export function renderStoreFilters(state, onChange) {
  const channelRow = document.getElementById("channelFilters");
  const sortRow = document.getElementById("storeSortRow");
  channelRow.innerHTML = STORE_FILTERS.map((item) => `<button type="button" class="filter-pill ${state.channel === item ? "active" : ""}" data-filter="${item}">${item}</button>`).join("");
  sortRow.innerHTML = STORE_SORTS.map((item) => `<button type="button" class="sort-pill ${state.sort === item.key ? "active" : ""}" data-sort="${item.key}">${item.label}</button>`).join("");
  channelRow.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => onChange({ channel: button.dataset.filter })));
  sortRow.querySelectorAll("[data-sort]").forEach((button) => button.addEventListener("click", () => onChange({ sort: button.dataset.sort })));
}

const STORE_PAGE_SIZE = 30;

function buildStoreCard(store) {
  const tone = getDosTone(store.dos || 0);
  const ch = store.channel || "";
  const dot = ch.includes("IBOX") ? "IB" : ch.includes("ERABLUE") ? "EB" : "ER";
  return `
    <article class="card store-card" data-site="${store.siteCode}">
      <div class="store-header">
        <div class="store-title">
          <span class="brand-dot">${dot}</span>
          <div>
            <h4>${store.siteDesc || "-"}</h4>
            <p>Kode: ${store.siteCode} · TSH: ${store.tsh || "-"}</p>
          </div>
        </div>
        <span class="badge ${tone}">${ch || "-"}</span>
      </div>
      <div class="store-stats">
        <div class="metric-tile"><span>Apr</span><strong>${formatNumber(store.april || 0)}</strong></div>
        <div class="metric-tile"><span>May</span><strong>${formatNumber(store.may || 0)}</strong></div>
        <div class="metric-tile"><span>Stock</span><strong>${formatNumber(store.stock || 0)}</strong></div>
        <div class="metric-tile"><span>DOS</span><strong>${(store.dos || 0).toFixed(1).replace(".", ",")} hari</strong></div>
      </div>
      <div class="progress-meta">
        <p>Readiness index</p>
        <p>${Math.round(getDosProgress(store.dos || 0))}%</p>
      </div>
      <div class="progress-track"><div class="progress-fill ${tone}" style="width:${getDosProgress(store.dos || 0)}%; background:${tone === "safe" ? "var(--accent-green)" : tone === "warn" ? "var(--accent-amber)" : "var(--accent-red)"}"></div></div>
    </article>
  `;
}

export function renderStoreList(stores, onSelect, limit = STORE_PAGE_SIZE) {
  const target = document.getElementById("storeList");
  const visible = stores.slice(0, limit);
  const remaining = stores.length - visible.length;

  target.innerHTML = visible.map(buildStoreCard).join("") + (remaining > 0 ? `
    <button type="button" class="load-more-btn">
      Lihat ${remaining} toko lainnya
    </button>
  ` : "");

  target.querySelectorAll(".store-card").forEach((card) => {
    card.addEventListener("click", () => {
      const selected = visible.find((item) => item.siteCode === card.dataset.site);
      if (selected) onSelect(selected);
    });
  });

  const loadMore = target.querySelector(".load-more-btn");
  if (loadMore) {
    loadMore.addEventListener("click", () => renderStoreList(stores, onSelect, limit + STORE_PAGE_SIZE));
  }
}

let _brandAllModels = [];
let _brandActiveFilter = null;

function renderModelTable(rows, brandFilter) {
  const filtered = brandFilter ? rows.filter((r) => r[0] === brandFilter) : rows;
  const tableEl = document.getElementById("modelTable");
  const titleEl = document.getElementById("modelTableTitle");
  if (titleEl) titleEl.textContent = brandFilter ? `${brandFilter} · April vs Mei` : "Semua Brand · April vs Mei";
  if (!tableEl) return;
  if (!filtered.length) {
    tableEl.innerHTML = `<tbody><tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-tertiary)">Tidak ada data model untuk brand ini.</td></tr></tbody>`;
    return;
  }
  tableEl.innerHTML = `
    <thead><tr><th>Brand</th><th>Model</th><th>Storage</th><th>Apr</th><th>Mei</th></tr></thead>
    <tbody>${filtered.slice(0, 30).map((row) => `
      <tr>
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${formatNumber(row[3])}</td>
        <td><strong>${formatNumber(row[4])}</strong></td>
      </tr>`).join("")}</tbody>
  `;
}

export function renderBrandSection(data) {
  _brandAllModels = data.modelTable || [];
  _brandActiveFilter = null;

  const ranking = data.brandRanking || [];
  const listEl = document.getElementById("brandCardList");
  const labelEl = document.getElementById("brandSelectedLabel");

  if (!listEl) return;

  if (!ranking.length) {
    listEl.innerHTML = `<p style="color:var(--text-tertiary);padding:16px 0">Data brand belum tersedia.</p>`;
    renderModelTable(_brandAllModels, null);
    return;
  }

  const maxQty = ranking[0].may || 1;

  listEl.innerHTML = ranking.map((item, idx) => {
    const barWidth = Math.round((item.may / maxQty) * 100);
    const growthClass = item.growth > 0 ? "positive" : item.growth < 0 ? "negative" : "neutral";
    const growthSign = item.growth > 0 ? "▲" : item.growth < 0 ? "▼" : "—";
    return `
      <div class="brand-card" data-brand="${item.brand}">
        <span class="brand-card__rank">${idx + 1}</span>
        <span class="brand-card__name">${item.brand}</span>
        <div class="brand-card__bar-wrap">
          <div class="brand-card__bar-fill" style="width:${barWidth}%"></div>
        </div>
        <div class="brand-card__stats">
          <span class="brand-card__qty">${formatNumber(item.may)} unit</span>
          <span class="brand-card__growth ${growthClass}">${growthSign} ${Math.abs(item.growth)}% vs Apr</span>
        </div>
      </div>
    `;
  }).join("");

  listEl.querySelectorAll(".brand-card").forEach((card) => {
    card.addEventListener("click", () => {
      const brand = card.dataset.brand;
      if (_brandActiveFilter === brand) {
        _brandActiveFilter = null;
        listEl.querySelectorAll(".brand-card").forEach((c) => c.classList.remove("active"));
        if (labelEl) labelEl.textContent = "Semua Brand";
      } else {
        _brandActiveFilter = brand;
        listEl.querySelectorAll(".brand-card").forEach((c) => c.classList.toggle("active", c.dataset.brand === brand));
        if (labelEl) labelEl.textContent = brand;
      }
      renderModelTable(_brandAllModels, _brandActiveFilter);
    });
  });

  renderModelTable(_brandAllModels, null);
}

export function renderStockSection(data) {
  document.getElementById("stockSummary").innerHTML = data.stockSummary.map(([label, value]) => `
    <article class="summary-card"><span>${label}</span><strong>${value}</strong></article>
  `).join("");
  document.getElementById("riskTable").innerHTML = `
    <thead><tr><th>Toko</th><th>Channel</th><th>Stock</th><th>DOS</th><th>Status</th></tr></thead>
    <tbody>${data.risk.map((row) => {
      const tone = row[3] > 90 ? "danger" : row[3] >= 60 ? "warn" : "safe";
      const label = row[3] > 90 ? "KRITIS" : row[3] >= 60 ? "WASPADA" : "AMAN";
      return `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${formatNumber(row[2])}</td><td>${row[3].toFixed(1).replace(".", ",")}</td><td><span class="badge ${tone}">${label}</span></td></tr>`;
    }).join("")}</tbody>
  `;
}

export function renderAccessoriesSection(data) {
  document.getElementById("accessoryInsight").innerHTML = `
    <div>
      <p class="section-kicker">Mini Insight</p>
      <h4>Shopping Bag dan Screen Protector mendominasi volume aksesoris.</h4>
      <p>Private label dan electrical masih perlu review pricing dan rotasi stok untuk menurunkan DOS serta meningkatkan conversion di toko dengan traffic tinggi.</p>
    </div>
  `;
}

export function setupTabs(defaultTab, onChange) {
  const buttons = [...document.querySelectorAll(".nav-item")];
  const views = [...document.querySelectorAll(".tab-view")];
  const scrollEl = document.getElementById("appScroll");

  const activate = (tab) => {
    buttons.forEach((button) => button.classList.toggle("active", button.dataset.tabTarget === tab));
    views.forEach((view) => view.classList.toggle("active", view.dataset.tab === tab));
    if (scrollEl) scrollEl.scrollTop = 0;
    onChange(tab);
  };

  buttons.forEach((button) => button.addEventListener("click", () => activate(button.dataset.tabTarget)));
  activate(defaultTab);
}

export function bindStoreSearch(onInput) {
  document.getElementById("storeSearch").addEventListener("input", (event) => onInput(event.target.value));
}

export function bindDosAlert(onClick) {
  document.getElementById("dosAlertButton").addEventListener("click", onClick);
}

export function openStoreModal(store) {
  const modal = document.getElementById("storeModal");
  const delta = store.may - store.april;
  document.getElementById("storeModalContent").innerHTML = `
    <div class="card-header">
      <div>
        <p class="section-kicker">${store.channel}</p>
        <h4>${store.siteDesc}</h4>
      </div>
      <button class="mini-button" id="closeStoreModal">Tutup</button>
    </div>
    <p class="hero-note">Kode ${store.siteCode} · TSH ${store.tsh}</p>
    <div class="store-stats">
      <div class="metric-tile"><span>Qty Apr</span><strong>${formatNumber(store.april)}</strong></div>
      <div class="metric-tile"><span>Qty Mei</span><strong>${formatNumber(store.may)}</strong></div>
      <div class="metric-tile"><span>Stock</span><strong>${formatNumber(store.stock)}</strong></div>
      <div class="metric-tile"><span>DOS</span><strong>${store.dos.toFixed(1).replace(".", ",")} hari</strong></div>
    </div>
    <p class="hero-note">Estimasi run-rate ${formatNumber(Math.round(store.est))} unit per bulan. Perubahan April ke Mei: ${delta >= 0 ? "+" : ""}${formatNumber(delta)} unit.</p>
  `;
  modal.showModal();
  document.getElementById("closeStoreModal").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  }, { once: true });
}
