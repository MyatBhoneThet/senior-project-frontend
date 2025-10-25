import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

export default function SavingsQuickCard() {
  const [stats, setStats] = useState({ jars: 0, goals: 0, total: 0 });

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
    <div className="rounded-xl border p-4 bg-white/90 dark:bg-gray-900/90 dark:border-gray-700 shadow-sm">
      <div className="font-semibold dark:text-white">Savings</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Jars & Goals overview</div>
      <div className="flex gap-6 text-sm dark:text-gray-200">
        <div>Jars: <b>{stats.jars}</b></div>
        <div>Goals: <b>{stats.goals}</b></div>
        <div>Total reserved: <b>THB {stats.total.toLocaleString()}</b></div>
      </div>
      <Link
        to="/savings"
        className="inline-block mt-3 px-3 py-1 rounded bg-black text-white dark:bg-violet-600 hover:dark:bg-violet-700"
      >
        Open Savings
      </Link>
    </div>
  );
}
