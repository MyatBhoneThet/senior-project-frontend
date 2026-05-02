import React, { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/layout/Modal';
import RecurringPageShell from '../../components/recurring/RecurringPageShell';
import RecurringHeader from '../../components/recurring/RecurringHeader';
import RecurringSummaryCards from '../../components/recurring/RecurringSummaryCards';
import RecurringRulesSection from '../../components/recurring/RecurringRulesSection';
import RecurringRuleModalForm from '../../components/recurring/RecurringRuleModalForm';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useCurrency } from '../../context/CurrencyContext';
import useT from '../../hooks/useT';
import { UserContext } from '../../context/UserContext';

const initialForm = {
  type: 'expense',
  categoryId: '',
  category: 'Rent',
  source: '',
  icon: '💸',
  amount: '',
  repeat: 'monthly',
  dayOfMonth: 1,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  notes: '',
  isActive: true,
};

export default function RecurringPage() {
  const { prefs } = useContext(UserContext) || {};
  const isDark = prefs?.theme === 'dark';
  const { t } = useT();
  const { format } = useCurrency();
  const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openRuleModal, setOpenRuleModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.RECURRING.BASE);
      setRules(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error(tt('recurring.loadError', 'Failed to load recurring rules'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setOpenRuleModal(true);
  };

  const openEdit = (rule) => {
    setEditing(rule);
    setForm({
      type: rule.type || 'expense',
      categoryId: rule.categoryId || '',
      category: rule.category || '',
      source: rule.source || '',
      icon: rule.icon || (rule.type === 'income' ? '💰' : '💸'),
      amount: String(rule.amount ?? ''),
      repeat: rule.repeat || 'monthly',
      dayOfMonth: rule.dayOfMonth || 1,
      startDate: String(rule.startDate || '').slice(0, 10),
      endDate: String(rule.endDate || '').slice(0, 10),
      notes: rule.notes || '',
      isActive: rule.isActive !== false,
    });
    setOpenRuleModal(true);
  };

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const saveRule = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        type: form.type,
        categoryId: form.categoryId || undefined,
        category: form.category,
        source: form.source || '',
        icon: form.icon || '',
        amount: Number(form.amount),
        repeat: String(form.repeat || 'monthly').toLowerCase(),
        dayOfMonth: Number(form.dayOfMonth || 1),
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        isActive: !!form.isActive,
        notes: form.notes || '',
      };

      if (editing?._id) {
        await axiosInstance.patch(`${API_PATHS.RECURRING.BASE}/${editing._id}`, body);
      } else {
        await axiosInstance.post(API_PATHS.RECURRING.BASE, body);
      }

      await axiosInstance.post(`${API_PATHS.RECURRING.BASE}/run`);
      toast.success(editing?._id ? tt('recurring.ruleUpdated', 'Rule updated') : tt('recurring.ruleCreated', 'Rule created'));
      setOpenRuleModal(false);
      setEditing(null);
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleRule = async (id, isActive) => {
    try {
      await axiosInstance.patch(`${API_PATHS.RECURRING.BASE}/${id}/toggle`, { isActive });
      await axiosInstance.post(`${API_PATHS.RECURRING.BASE}/run`);
      await load();
    } catch {
      toast.error(tt('recurring.toggleError', 'Failed to toggle'));
    }
  };

  const removeRule = async (id) => {
    if (!window.confirm(tt('recurring.confirmDelete', 'Delete this rule?'))) return;
    try {
      await axiosInstance.delete(`${API_PATHS.RECURRING.BASE}/${id}`);
      await axiosInstance.post(`${API_PATHS.RECURRING.BASE}/run`);
      await load();
    } catch {
      toast.error(tt('recurring.deleteError', 'Failed to delete'));
    }
  };

  const monthlyCommitted = useMemo(
    () =>
      rules
        .filter((rule) => rule.isActive)
        .reduce((sum, rule) => {
          const amount = Number(rule.amount || 0);
          if (rule.repeat === 'yearly') return sum + amount / 12;
          if (rule.repeat === 'weekly') return sum + amount * 4.345;
          return sum + amount;
        }, 0),
    [rules]
  );

  const nextRule = useMemo(() => rules.find((rule) => rule.isActive) || rules[0], [rules]);
  const annualRecurring = useMemo(() => monthlyCommitted * 12, [monthlyCommitted]);
  const activeCount = rules.filter((rule) => rule.isActive).length;

  const pageClass = isDark
    ? 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.11),transparent_26%),radial-gradient(circle_at_top_right,rgba(71,215,255,0.08),transparent_22%),linear-gradient(180deg,#090b11_0%,#05070b_100%)] text-white'
    : 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.72),transparent_20%),linear-gradient(180deg,#fefbf8_0%,#f7f3ea_100%)] text-[#11131b]';
  const cardClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/18 bg-white/14 text-[#11131b] shadow-[0_28px_90px_rgba(15,23,42,0.11)] ring-1 ring-white/45 backdrop-blur-3xl';
  const inputClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white placeholder:text-[#848aa0]'
    : 'border-white/16 bg-white/12 text-[#11131b] placeholder:text-[#8a8f9f] backdrop-blur-3xl';
  const mutedText = isDark ? 'text-[#7b8095]' : 'text-[#6b6f80]';
  const labelText = isDark ? 'text-[#8a90a7]' : 'text-[#6b7080]';
  const outlineButton = isDark
    ? 'border-white/10 text-[#d0d3e4] hover:bg-white/[0.08] backdrop-blur-2xl'
    : 'border-white/16 text-[#31374a] hover:bg-white/22 backdrop-blur-3xl';
  const surfaceBorder = isDark ? 'border-white/10' : 'border-white/16';
  const sectionDivider = isDark ? 'border-white/10' : 'border-white/16';

  return (
    <DashboardLayout activeMenu="Recurring">
      <RecurringPageShell isDark={isDark} pageClass={pageClass}>
        <RecurringHeader
          mutedText={mutedText}
          sectionDivider={sectionDivider}
          title={tt('menu.recurring', 'Recurring')}
          subtitle={tt('recurring.subtitle', 'Subscriptions and automated rules')}
        />

        <RecurringSummaryCards
          isDark={isDark}
          cardClass={cardClass}
          labelText={labelText}
          mutedText={mutedText}
          format={format}
          monthlyCommitted={monthlyCommitted}
          activeCount={activeCount}
          nextRule={nextRule}
          annualRecurring={annualRecurring}
          rules={rules}
          tt={tt}
        />

        <RecurringRulesSection
          isDark={isDark}
          cardClass={cardClass}
          sectionDivider={sectionDivider}
          loading={loading}
          rules={rules}
          mutedText={mutedText}
          outlineButton={outlineButton}
          format={format}
          tt={tt}
          onOpenCreate={openCreate}
          onOpenEdit={openEdit}
          onToggleRule={toggleRule}
          onRemoveRule={removeRule}
        />

        <Modal
          isOpen={openRuleModal}
          onClose={() => setOpenRuleModal(false)}
          title={editing?._id ? tt('recurring.editRule', 'Edit Rule') : tt('recurring.addRule', 'Add Rule')}
        >
          <RecurringRuleModalForm
            editing={editing}
            onSubmit={saveRule}
            saving={saving}
            form={form}
            setField={setField}
            isDark={isDark}
            surfaceBorder={surfaceBorder}
            inputClass={inputClass}
            labelText={labelText}
            tt={tt}
          />
        </Modal>
      </RecurringPageShell>
    </DashboardLayout>
  );
}
