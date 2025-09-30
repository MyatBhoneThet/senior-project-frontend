import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "./UserContext";

const CurrencyContext = createContext(null);
const STORAGE_KEY = "fxRates_THB_cache_v2";

const PROVIDER   = (import.meta.env.VITE_FX_PROVIDER || "erapi").toLowerCase(); // erapi | host | frankfurter
const FX_BASE    = (import.meta.env.VITE_FX_BASE || "THB").toUpperCase();       // keep THB
const FORCE_DATE = (import.meta.env.VITE_FX_DATE || "").trim();                 // e.g. 2025-07-01 or ""
let   OVERRIDE   = {};
try { OVERRIDE = JSON.parse(import.meta.env.VITE_FX_OVERRIDE || "{}"); } catch { OVERRIDE = {}; }

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const normalizeLang = (v) => {
  const s = String(v || "en").toLowerCase();
  const map = { english: "en", en: "en", thai: "th", th: "th", burmese: "my", myanmar: "my", my: "my" };
  return map[s] || (s.length > 2 ? s.slice(0, 2) : s);
};

function numberFormat(amount, currency, lang = "en") {
  try {
    return new Intl.NumberFormat(lang, { style: "currency", currency }).format(amount);
  } catch {
    const symbols = { THB: "฿", USD: "$", MMK: "MMK " };
    return `${symbols[currency] || ""}${(Number(amount) || 0).toLocaleString()}`;
  }
}

// Build URL for the chosen provider + optional historical date
function buildFxUrl(base, date = "") {
  const d = (date || FORCE_DATE || "").trim();

  // Prefer the chosen provider; if it can't do historical, fall back
  if (PROVIDER === "erapi" && !d) {
    return `https://open.er-api.com/v6/latest/${base}`;
  }

  // exchangerate.host supports both latest + historical
  if (PROVIDER === "host" || (PROVIDER === "erapi" && d)) {
    const path = d ? `/${d}` : "/latest";
    return `https://api.exchangerate.host${path}?base=${base}`;
  }

  // frankfurter.app supports both latest + historical
  if (PROVIDER === "frankfurter") {
    const path = d ? `/${d}` : "/latest";
    return `https://api.frankfurter.app${path}?from=${base}`;
  }

  // default safe fallback
  return `https://api.exchangerate.host/latest?base=${base}`;
}

export const CurrencyProvider = ({ children }) => {
  const { prefs } = useContext(UserContext) || {};
  const targetCurrency = String(prefs?.currency || "THB").toUpperCase();
  const language = normalizeLang(prefs?.language || "en");

  const [rates, setRates] = useState({ [FX_BASE]: 1 });
  const [lastUpdated, setLastUpdated] = useState(0);
  const [effectiveDate, setEffectiveDate] = useState(FORCE_DATE || ""); // for display/debug
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cached
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.rates) {
          setRates({ ...parsed.rates, [FX_BASE]: 1 });
          setLastUpdated(parsed.lastUpdated || 0);
          setEffectiveDate(parsed.effectiveDate || FORCE_DATE || "");
        }
      }
    } catch {}
  }, []);

  // Refresh on mount if stale or missing keys
  useEffect(() => {
    const stale = Date.now() - (lastUpdated || 0) > ONE_DAY_MS;
    if (!rates?.USD || !rates?.MMK || stale) {
      refreshRates(FORCE_DATE || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdated]);

  const refreshRates = async (date = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = buildFxUrl(FX_BASE, date);
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();

      // Normalize structure:
      // exchangerate.host => { rates: {USD:..., ...} }
      // frankfurter       => { rates: {USD:..., ...}, date: "YYYY-MM-DD" }
      // erapi             => { rates: {...} } (if we ever use it for latest)
      const fetchedRates = json?.rates || {};
      fetchedRates[FX_BASE] = 1;

      // Merge manual overrides (env) on top
      const merged = { ...fetchedRates, ...OVERRIDE };
      setRates(merged);

      const usedDate = date || FORCE_DATE || json?.date || ""; // prefer explicit
      setEffectiveDate(usedDate);

      const ts = Date.now();
      setLastUpdated(ts);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ rates: merged, lastUpdated: ts, effectiveDate: usedDate })
      );
    } catch (e) {
      setError(e?.message || "FX fetch failed");
      console.error("FX fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  const convert = (amountTHB, to = targetCurrency) => {
    const n = Number(amountTHB) || 0;
    if (!to || to.toUpperCase() === FX_BASE) return n;
    const rate = rates?.[to.toUpperCase()];
    if (!rate || !isFinite(rate)) return n;
    return n * rate;
  };

  const format = (amountTHB, to = targetCurrency, lang = language) =>
    numberFormat(convert(amountTHB, to), to, lang);

  const value = useMemo(
    () => ({
      rates,
      lastUpdated,
      loading,
      error,
      effectiveDate,   // useful to show “Rates as of 2025-07-01”
      targetCurrency,
      language,
      refreshRates,    // can pass a date: refreshRates('2025-12-31')
      convert,
      format,
    }),
    [rates, lastUpdated, loading, error, effectiveDate, targetCurrency, language]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () =>
  useContext(CurrencyContext) || {
    rates: { THB: 1 },
    lastUpdated: 0,
    effectiveDate: "",
    loading: false,
    error: null,
    targetCurrency: "THB",
    language: "en",
    refreshRates: () => {},
    convert: (x) => x,
    format: (x) => numberFormat(x, "THB", "en"),
  };
