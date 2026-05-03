import React from 'react';

const toneClass = (isDark) =>
  isDark
    ? 'border border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
    : 'border border-white/30 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]';

export const SkeletonBlock = ({ className = '', isDark = true, style }) => (
  <div
    aria-hidden="true"
    className={`dashboard-skeleton rounded-xl ${toneClass(isDark)} ${className}`}
    style={style}
  />
);

export const StatCardSkeleton = ({ isDark = true }) => (
  <div className="relative flex h-full min-h-[154px] flex-col justify-between">
    <div className="flex items-start justify-between gap-4">
      <div className="w-full">
        <SkeletonBlock isDark={isDark} className="h-3 w-28 rounded" />
        <SkeletonBlock isDark={isDark} className="mt-5 h-10 w-32 rounded-lg" />
      </div>
      <SkeletonBlock isDark={isDark} className="h-12 w-12 flex-none rounded-2xl" />
    </div>
    <SkeletonBlock isDark={isDark} className="mt-4 h-3 w-44 rounded" />
    <div className="mt-5 flex items-center justify-between gap-3">
      <SkeletonBlock isDark={isDark} className="h-8 w-32 rounded-xl" />
      <SkeletonBlock isDark={isDark} className="h-3 w-20 rounded" />
    </div>
  </div>
);

export const ChartSkeleton = ({ isDark = true }) => (
  <div className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden rounded-2xl px-3 pb-6 pt-3">
    <div className={`absolute inset-x-2 bottom-6 top-3 ${isDark ? 'opacity-35' : 'opacity-50'}`}>
      {[0, 1, 2, 3].map((line) => (
        <div
          key={line}
          className={`absolute left-0 right-0 border-t border-dashed ${
            isDark ? 'border-white/10' : 'border-[#11131b]/10'
          }`}
          style={{ bottom: `${line * 25}%` }}
        />
      ))}
    </div>
    <div className="relative z-10 flex h-full items-end gap-3">
      {[38, 56, 44, 72, 61, 84, 52, 68].map((height, index) => (
        <SkeletonBlock
          key={index}
          isDark={isDark}
          className="min-w-0 flex-1 rounded-t-xl rounded-b-sm"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  </div>
);

export const DonutSkeleton = ({ isDark = true }) => (
  <div className="flex flex-1 items-center justify-between">
    <div className="relative flex h-full w-1/2 items-center justify-center">
      <SkeletonBlock isDark={isDark} className="h-32 w-32 rounded-full" />
      <div className={`absolute h-16 w-16 rounded-full ${isDark ? 'bg-[#11141b]' : 'bg-[#f7faef]'}`} />
    </div>
    <div className="flex w-1/2 flex-col gap-3 pl-4">
      {[72, 92, 64, 84].map((width, index) => (
        <div key={index} className="flex items-center gap-2">
          <SkeletonBlock isDark={isDark} className="h-3 w-3 rounded-sm" />
          <SkeletonBlock isDark={isDark} className="h-3 rounded" style={{ width: `${width}%` }} />
        </div>
      ))}
    </div>
  </div>
);

export const ListSkeleton = ({ rows = 5, isDark = true }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonBlock isDark={isDark} className="h-9 w-9 flex-none rounded-xl" />
          <div className="min-w-0">
            <SkeletonBlock isDark={isDark} className="h-3 w-32 rounded" />
            <SkeletonBlock isDark={isDark} className="mt-2 h-2.5 w-20 rounded" />
          </div>
        </div>
        <SkeletonBlock isDark={isDark} className="h-3 w-16 rounded" />
      </div>
    ))}
  </div>
);

export const CompactRowsSkeleton = ({ rows = 3, isDark = true }) => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <SkeletonBlock isDark={isDark} className="h-3 w-28 rounded" />
          <SkeletonBlock isDark={isDark} className="h-3 w-10 rounded" />
        </div>
        <SkeletonBlock isDark={isDark} className="h-2 w-full rounded-full" />
      </div>
    ))}
  </div>
);
