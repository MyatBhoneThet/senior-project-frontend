import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useCurrency } from '../../context/CurrencyContext';
import { toast } from 'react-hot-toast';
import { LuTarget, LuTrash2, LuCalendarClock, LuPiggyBank, LuPlus } from 'react-icons/lu';

export default function GoalList() {
  const [goals, setGoals] = useState([]);
  const [jars, setJars] = useState([]);

  // form
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [jarId, setJarId] = useState('');
  const [aaEnabled, setAaEnabled] = useState(false);
  const [aaType, setAaType] = useState('percent');
  const [aaValue, setAaValue] = useState('10');

  const { format } = useCurrency();

  const jarMap = useMemo(() => {
    const m = {};
    for (const j of jars) m[j._id] = j;
    return m;
  }, [jars]);

  const load = async () => {
    try {
      const [{ data: gs }, { data: js }] = await Promise.all([
        axiosInstance.get(API_PATHS.GOALS.BASE),
        axiosInstance.get(API_PATHS.JARS.BASE),
      ]);
      setGoals(Array.isArray(gs) ? gs : []);
      setJars(Array.isArray(js) ? js : []);
      if (!jarId && js[0]) setJarId(js[0]._id);
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || 'Failed to load goals/jars');
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount || !targetDate || !jarId) return;
    try {
      await axiosInstance.post(API_PATHS.GOALS.BASE, {
        title: title.trim(),
        targetAmount: Number(targetAmount),
        targetDate,
        jarId,
        autoAllocate: { enabled: aaEnabled, type: aaType, value: Number(aaValue) },
      });
      setTitle(''); setTargetAmount(''); setTargetDate('');
      toast.success('Goal created');
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to create goal');
    }
  };

  const fund = async (id, amt) => {
    const n = Number(amt || 0);
    if (!n || n <= 0) return;
    try {
      const { data } = await axiosInstance.post(API_PATHS.GOALS.FUND(id), { amount: n });
      toast.success(data?.message || `Funded THB ${n.toLocaleString()}`);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Fund failed');
    }
  };

  const autoAlloc = async (amt) => {
    const n = Number(amt || 0);
    if (!n || n <= 0) return;
    try {
      const { data } = await axiosInstance.post(API_PATHS.GOALS.AUTO_ALLOCATE, { amount: n });
      toast.success('Auto-allocated');
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Auto-allocate failed');
    }
  };

  const removeGoal = async (id) => {
    if (!confirm('Delete this goal? This cannot be undone.')) return;
    try {
      await axiosInstance.delete(`${API_PATHS.GOALS.BASE}/${id}`);
      toast.success('Goal deleted');
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Goal */}
      <form onSubmit={create} className="rounded-2xl border p-4 bg-white/90 backdrop-blur shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Goal title</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={title}
              onChange={e=>setTitle(e.target.value)}
              placeholder="e.g., Buy MacBook"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Target amount (THB)</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={targetAmount}
              onChange={e=>setTargetAmount(e.target.value)}
              placeholder="35000"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Target date</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              type="date"
              value={targetDate}
              onChange={e=>setTargetDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Jar</label>
            <select
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={jarId}
              onChange={e=>setJarId(e.target.value)}
            >
              {jars.map(j => <option key={j._id} value={j._id}>{j.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-2 rounded-xl bg-gray-50 p-3 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={aaEnabled} onChange={e=>setAaEnabled(e.target.checked)} />
              <span className="text-sm">Enable auto-allocate on income</span>
            </label>
            <select
              className="border rounded-lg px-2 py-1 text-sm"
              value={aaType}
              onChange={e=>setAaType(e.target.value)}
            >
              <option value="percent">Percent</option>
              <option value="fixed">Fixed</option>
            </select>
            <input
              className="border rounded-lg px-2 py-1 text-sm"
              value={aaValue}
              onChange={e=>setAaValue(e.target.value)}
              placeholder={aaType === 'percent' ? '10 (%)' : '1000 (THB)'}
            />
            <span className="text-xs text-gray-500">Auto-allocation moves a portion of each income into this goal’s jar.</span>
          </div>
        </div>

        <div className="mt-4">
          <button className="px-4 py-2 rounded-xl bg-violet-600 text-white shadow hover:bg-violet-700 flex items-center gap-2">
            <LuPlus /> Create goal
          </button>
        </div>
      </form>

      {/* Goal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map(g => {
          const saved = Number(g.currentAmount || 0);
          const target = Math.max(1, Number(g.targetAmount || 0));
          const pct = Math.min(100, Math.round((saved / target) * 100));
          const jar = jarMap[g.jarId];

          return (
            <div
              key={g._id}
              className="rounded-2xl border p-4 bg-white/90 backdrop-blur shadow-sm hover:shadow-md transition ring-1 ring-transparent hover:ring-violet-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-violet-50 text-violet-700"><LuTarget /></div>
                  <div>
                    <div className="font-semibold">{g.title}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1"><LuPiggyBank /> {jar?.name || 'Jar'}</span>
                      <span className="inline-flex items-center gap-1"><LuCalendarClock /> {new Date(g.targetDate).toLocaleDateString()}</span>
                      {g.status === 'achieved' && (
                        <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 text-[11px]">
                          Achieved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeGoal(g._id)}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  title="Delete goal"
                >
                  <LuTrash2 />
                </button>
              </div>

              <div className="mt-3 text-sm text-gray-600">Progress</div>
              <div className="text-sm font-medium">
                {format(saved)} <span className="text-gray-500">of</span> {format(target)} &nbsp;•&nbsp; {pct}%
              </div>
              <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-violet-600 to-indigo-600" style={{ width: `${pct}%` }} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => fund(g._id, 500)}
                  className="px-3 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                >
                  Fund ฿500
                </button>
                <button
                  onClick={() => autoAlloc(2000)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                  title="Simulate income allocation (e.g., 10% of ฿2000 → jar)"
                >
                  Test Auto-Allocate (฿2000)
                </button>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-full text-sm text-gray-500">No goals yet. Create one above.</div>
        )}
      </div>
    </div>
  );
}
