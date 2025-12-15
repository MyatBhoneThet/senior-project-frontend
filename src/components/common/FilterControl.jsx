import { useEffect, useMemo, useState } from "react";
import { applyFilterSort } from "../../utils/filtering";
import { LuFilter, LuSearch, LuX, LuRotateCcw } from "react-icons/lu";


export default function FilterControl({
  items = [],
  onChange = () => {},
  fieldMap = { date: "date", category: "category", amount: "amount", text: "source" },
  categories,
  label = "Filter",
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    q: "",
    dateFrom: "",
    dateTo: "",
    category: "",
    minAmount: "",
    maxAmount: "",
    sortBy: "date",
    sortDir: "desc",
  });

  const derivedCats = useMemo(() => {
    if (categories?.length) return categories;
    const s = new Set((items || []).map((it) => String(it[fieldMap.category] ?? it.type ?? "")));
    s.delete("");
    return Array.from(s).sort();
  }, [items, categories, fieldMap.category]);

  const applyNow = () => {
    const filtered = applyFilterSort(items, state, fieldMap);
    onChange(filtered, state);
    setOpen(false);
  };

  const resetAll = () => {
    const fresh = {
      q: "",
      dateFrom: "",
      dateTo: "",
      category: "",
      minAmount: "",
      maxAmount: "",
      sortBy: "date",
      sortDir: "desc",
    };
    setState(fresh);
    const filtered = applyFilterSort(items, fresh, fieldMap);
    onChange(filtered, fresh);
  };

  // keep in sync when incoming items change
  useEffect(() => {
    const filtered = applyFilterSort(items, state, fieldMap);
    onChange(filtered, state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
      >
        <LuFilter className="opacity-80" />
        {label}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-[340px] rounded-2xl border bg-white p-4 shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:text-white z-[60]"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="font-medium">Search, Filter & Sort</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Close"
            >
              <LuX />
            </button>
          </div>

          <label className="mb-2 block text-xs font-medium opacity-70">Search</label>
          <div className="mb-4 flex items-center gap-2 rounded-xl border px-3 py-2">
            <LuSearch className="opacity-60" />
            <input
              value={state.q}
              onChange={(e) => setState((s) => ({ ...s, q: e.target.value }))}
              placeholder="title/source or category…"
              className="w-full bg-transparent outline-none"
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium opacity-70">From</label>
              <input
                type="date"
                value={state.dateFrom}
                onChange={(e) => setState((s) => ({ ...s, dateFrom: e.target.value }))}
                className="w-full rounded-xl border px-3 py-2 bg-transparent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium opacity-70">To</label>
              <input
                type="date"
                value={state.dateTo}
                onChange={(e) => setState((s) => ({ ...s, dateTo: e.target.value }))}
                className="w-full rounded-xl border px-3 py-2 bg-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium opacity-70">Category</label>
            <select
              value={state.category}
              onChange={(e) => setState((s) => ({ ...s, category: e.target.value }))}
              className="w-full rounded-xl border px-3 py-2 bg-transparent"
            >
              <option value="">All</option>
              {derivedCats.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium opacity-70">Min Amount</label>
              <input
                type="number"
                inputMode="decimal"
                value={state.minAmount}
                onChange={(e) => setState((s) => ({ ...s, minAmount: e.target.value }))}
                className="w-full rounded-xl border px-3 py-2 bg-transparent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium opacity-70">Max Amount</label>
              <input
                type="number"
                inputMode="decimal"
                value={state.maxAmount}
                onChange={(e) => setState((s) => ({ ...s, maxAmount: e.target.value }))}
                className="w-full rounded-xl border px-3 py-2 bg-transparent"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium opacity-70">Sort by</label>
              <select
                value={state.sortBy}
                onChange={(e) => setState((s) => ({ ...s, sortBy: e.target.value }))}
                className="w-full rounded-xl border px-3 py-2 bg-transparent"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium opacity-70">Direction</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setState((s) => ({ ...s, sortDir: "asc" }))}
                  className={`flex-1 rounded-xl border px-3 py-2 inline-flex items-center justify-center gap-2 ${state.sortDir === "asc" ? "bg-black/5 dark:bg-white/10" : ""}`}
                >
                  ▲ Asc
                </button>
                <button
                  type="button"
                  onClick={() => setState((s) => ({ ...s, sortDir: "desc" }))}
                  className={`flex-1 rounded-xl border px-3 py-2 inline-flex items-center justify-center gap-2 ${state.sortDir === "desc" ? "bg-black/5 dark:bg-white/10" : ""}`}
                >
                  ▼ Desc
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <LuRotateCcw /> Reset
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyNow}
                className="rounded-xl bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
