import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';
import { useCurrency } from '../../context/CurrencyContext';

export default function SavingsQuickCard() {
  const [stats, setStats] = useState({ jars: 0, goals: 0, total: 0 });
  const { prefs } = useContext(UserContext);
  const { format } = useCurrency(); // use currency formatting
  const isDark = prefs?.theme === 'dark';
  const { t } = useT();

  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  useEffect(() => {
    (async () => {
      const [j, g] = await Promise.all([
        axiosInstance.get(API_PATHS.JARS.BASE),
        axiosInstance.get(API_PATHS.GOALS.BASE),
      ]);
      const total = (j.data || []).reduce((s, x) => s + Number(x.balance || 0), 0);
      setStats({ jars: j.data?.length || 0, goals: g.data?.length || 0, total });
    })();
  }, []);

  return (
    <div className={`rounded-xl border p-4 shadow-sm transition-colors ${
      isDark
        ? 'bg-gray-900 border-gray-700 text-gray-200'
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      {/* Header */}
      <div className="font-semibold text-lg mb-1">{tt("dashboard.savings", "Savings")}</div>
      <div className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {tt("dashboard.jarsGoalsOverview", "Jars & Goals overview")}
      </div>

      {/* Stats */}
      <div className={`flex gap-6 text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        <div>{tt("dashboard.jars", "Jars")}: <b>{stats.jars}</b></div>
        <div>{tt("dashboard.goals", "Goals")}: <b>{stats.goals}</b></div>
        <div>
          {tt("dashboard.totalReserved", "Total reserved")}:
          <b className="text-green-600"> {format(stats.total)}</b>
        </div>
      </div>

      {/* Link */}
      <Link
        to="/savings"
        className={`inline-block mt-3 px-3 py-1 rounded font-medium transition-colors ${
          isDark
            ? 'bg-violet-600 text-white hover:bg-violet-700'
            : 'bg-green-600 text-white hover:bg-green-800'
        }`}
      >
        {tt("dashboard.openSavings", "Open Savings")}
      </Link>
    </div>
  );
}
