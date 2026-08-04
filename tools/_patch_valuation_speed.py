from pathlib import Path

path = Path(r"C:\Users\leona\xau-dashboard\app.js")
text = path.read_text(encoding="utf-8")

start = text.find("async function ensureValuationCompSeries(compIds, { force = false } = {}) {")
end = text.find("async function loadValuationAndRender({ force = false } = {}) {", start)
if start < 0 or end < 0:
    raise SystemExit(f"markers not found start={start} end={end}")

new_fn = r'''async function ensureValuationCompSeries(compIds, { force = false } = {}) {
  const selectedId = String(state.selectedAssetId || "").toUpperCase();
  const unique = [...new Set((compIds || []).map((id) => String(id || "").toUpperCase()).filter(Boolean))];
  const results = {};

  const persistComps = () => {
    try {
      const toSave = {};
      Object.entries(state.valuationCompCache || {}).forEach(([id, payload]) => {
        if (!payload?.prices?.length) return;
        toSave[id] = {
          id,
          label: payload.label,
          source: payload.source,
          fetchedAt: payload.fetchedAt || new Date().toISOString(),
          prices: payload.prices.map((p) => ({
            date: p.date instanceof Date ? p.date.toISOString() : p.date,
            close: p.close,
          })),
        };
      });
      saveCache(CACHE_KEYS.VALUATION_COMPS, { fetchedAt: new Date().toISOString(), series: toSave });
    } catch {
      // ignore
    }
  };

  const hydrateFromDisk = () => {
    if (force) return;
    const cached = loadCache(CACHE_KEYS.VALUATION_COMPS, PRICE_CACHE_MAX_AGE_MS);
    const series = cached?.series || {};
    Object.entries(series).forEach(([id, payload]) => {
      if (state.valuationCompCache[id]?.prices?.length) return;
      const prices = (payload?.prices || [])
        .map((p) => ({ date: new Date(p.date), close: Number(p.close) }))
        .filter((p) => p.date instanceof Date && !Number.isNaN(p.date.getTime()) && Number.isFinite(p.close));
      if (prices.length < 200) return;
      state.valuationCompCache[id] = {
        id,
        label: payload.label || id,
        source: `${payload.source || "cache locale"} (cache)`,
        prices,
        fetchedAt: payload.fetchedAt || cached.fetchedAt,
      };
    });
  };

  hydrateFromDisk();

  const missing = [];
  for (const id of unique) {
    if (id === selectedId && state.priceData?.prices?.length) {
      const asset = getValuationCompAsset(id);
      const payload = {
        id,
        label: asset.label,
        prices: state.priceData.prices,
        source: state.priceData.source || "asset selezionato",
        fetchedAt: new Date().toISOString(),
      };
      state.valuationCompCache[id] = payload;
      results[id] = payload;
      continue;
    }
    if (!force && state.valuationCompCache[id]?.prices?.length) {
      results[id] = state.valuationCompCache[id];
      continue;
    }
    missing.push(id);
  }

  if (missing.length) {
    try {
      const base = getMacroBackendBaseUrl();
      const forceQ = force ? "&force=1" : "";
      const url = `${base}/api/price/series/batch?assets=${encodeURIComponent(missing.join(","))}${forceQ}`;
      const payload = await fetchJsonWithAuth(url);
      const seriesMap = payload?.series || {};
      for (const id of missing) {
        const asset = getValuationCompAsset(id);
        const row = seriesMap[id];
        const prices = (row?.prices || [])
          .map((p) => ({ date: parseMacroDate(p.date), close: Number(p.close) }))
          .filter((p) => p.date instanceof Date && !Number.isNaN(p.date.getTime()) && Number.isFinite(p.close))
          .sort((a, b) => a.date - b.date);
        if (prices.length >= 200) {
          const packed = {
            id,
            label: asset.label,
            prices,
            source: `Backend ${row?.mode || "LIVE"} | ${row?.source || "prezzi"}`,
            fetchedAt: new Date().toISOString(),
          };
          state.valuationCompCache[id] = packed;
          results[id] = packed;
        } else {
          results[id] = { id, label: asset.label, prices: [], source: row?.source || "storico insufficiente" };
        }
      }
      persistComps();
    } catch (batchError) {
      await Promise.all(
        missing.map(async (id) => {
          const asset = getValuationCompAsset(id);
          try {
            const series = await getPriceSeries(asset, { force });
            const packed = {
              id,
              label: asset.label,
              prices: series?.prices || [],
              source: series?.source || "--",
              fetchedAt: new Date().toISOString(),
            };
            state.valuationCompCache[id] = packed;
            results[id] = packed;
          } catch (error) {
            results[id] = { id, label: asset.label, prices: [], source: `errore: ${error.message}` };
          }
        })
      );
      persistComps();
    }
  }

  return results;
}

function prefetchValuationComps() {
  if (state.valuationPrefetchStarted) return;
  state.valuationPrefetchStarted = true;
  const ids = state.valuationCompIds || ["DXY", "XAUUSD", "ZB1"];
  ensureValuationCompSeries(ids, { force: false }).catch(() => {
    state.valuationPrefetchStarted = false;
  });
}

'''

path.write_text(text[:start] + new_fn + text[end:], encoding="utf-8")
print("patched", start, end)
