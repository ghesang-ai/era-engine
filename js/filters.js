export function getFilteredStores(stores, state) {
  const keyword = state.query.trim().toLowerCase();
  const filtered = stores.filter((store) => {
    const matchesChannel = state.channel === "Semua" || store.channel === state.channel;
    const matchesSearch = !keyword || store.siteDesc.toLowerCase().includes(keyword);
    return matchesChannel && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (state.sort === "dos") return b.dos - a.dos;
    if (state.sort === "qty") return b.may - a.may;
    return b.may - a.may;
  });

  return sorted;
}

export function getDosTone(dos) {
  if (dos < 45) return "safe";
  if (dos <= 75) return "warn";
  return "danger";
}

export function getDosProgress(dos) {
  return Math.min(100, Math.max(8, (dos / 90) * 100));
}
