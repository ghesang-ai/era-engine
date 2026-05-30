import { CONFIG } from "./config.js?v=20260530a";

Chart.defaults.color = CONFIG.COLORS.text;
Chart.defaults.borderColor = CONFIG.COLORS.grid;
Chart.defaults.font.family = "'Inter', sans-serif";

const chartStore = {};

function currencyTick(value) {
  return `${(value / 1e9).toFixed(0)} M`;
}

export function renderSalesTrendChart(data) {
  const ctx = document.getElementById("salesTrendChart");
  if (!ctx) return;
  chartStore.salesTrend?.destroy();
  chartStore.salesTrend = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.trend.map((item) => item.month),
      datasets: [
        {
          label: "PO Sales",
          data: data.trend.map((item) => item.po),
          borderColor: CONFIG.COLORS.cyan,
          backgroundColor: "rgba(0, 212, 255, 0.12)",
          fill: true,
          tension: 0.38,
          pointRadius: 4
        },
        {
          label: "Non-PO Sales",
          data: data.trend.map((item) => item.nonPo),
          borderColor: CONFIG.COLORS.violet,
          backgroundColor: "rgba(124, 58, 237, 0.12)",
          fill: true,
          tension: 0.38,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: {
          callbacks: {
            label: (ctx) => `Rp ${(ctx.raw / 1e9).toFixed(2)} M`
          }
        }
      },
      scales: {
        y: { ticks: { callback: currencyTick } }
      }
    }
  });
}

export function renderTshChart(data) {
  const ctx = document.getElementById("tshChart");
  if (!ctx) return;
  chartStore.tsh?.destroy();
  chartStore.tsh = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.tshRanking.map((item) => item[0]),
      datasets: [{
        label: "Sales Mei",
        data: data.tshRanking.map((item) => item[1]),
        backgroundColor: data.tshRanking.map(() => "rgba(0, 212, 255, 0.74)"),
        borderRadius: 14,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `Rp ${(ctx.raw / 1e9).toFixed(2)} M` } }
      },
      scales: {
        x: { ticks: { callback: currencyTick } }
      }
    }
  });
}


export function renderStockChart(data) {
  const ctx = document.getElementById("stockChart");
  if (!ctx) return;
  chartStore.stock?.destroy();
  chartStore.stock = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.stockStack.map((item) => item.tsh),
      datasets: [
        { label: "ERAFONE", data: data.stockStack.map((item) => item.erafone), backgroundColor: "rgba(0, 212, 255, 0.82)" },
        { label: "IBOX", data: data.stockStack.map((item) => item.ibox), backgroundColor: "rgba(124, 58, 237, 0.82)" },
        { label: "ERA & MORE", data: data.stockStack.map((item) => item.eramore), backgroundColor: "rgba(0, 255, 148, 0.72)" },
        { label: "ERABLUE", data: data.stockStack.map((item) => item.erablue), backgroundColor: "rgba(255, 184, 0, 0.72)" },
        { label: "XIAOMI", data: data.stockStack.map((item) => item.xiaomi), backgroundColor: "rgba(255, 59, 92, 0.72)" }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      scales: {
        x: { stacked: true },
        y: { stacked: true }
      }
    }
  });
}

export function renderAccessoriesChart(data) {
  const ctx = document.getElementById("accessoriesChart");
  if (!ctx) return;
  chartStore.accessories?.destroy();
  chartStore.accessories = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.accessories.map((item) => item.label),
      datasets: [{
        data: data.accessories.map((item) => item.value),
        backgroundColor: "rgba(0, 212, 255, 0.72)",
        borderRadius: 12,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}
