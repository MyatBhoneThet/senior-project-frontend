import React from 'react';

export const monthYearLabel = (date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);

export const shortDateLabel = (value) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value));

export const sourceTitle = (item) =>
  item.source?.trim() || item.categoryName || item.category || 'Expense';

export const categoryLabel = (item) =>
  item.categoryName || item.category || 'Uncategorized';

const isImageUrl = (value) =>
  typeof value === 'string' && /^https?:\/\//.test(value);

export const renderExpenseIcon = (icon) => {
  if (!icon) return <span>💳</span>;
  if (isImageUrl(icon)) {
    return <img src={icon} alt="Expense icon" className="h-7 w-7 rounded-lg object-cover" />;
  }
  return <span>{icon}</span>;
};
