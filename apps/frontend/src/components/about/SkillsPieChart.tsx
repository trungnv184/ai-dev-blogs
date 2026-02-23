import { useState } from 'react';

interface SkillCategory {
  name: string;
  value: number;
  color: string;
  skills: string[];
}

interface SkillsPieChartProps {
  categories: SkillCategory[];
}

function DonutSegment({
  cx,
  cy,
  radius,
  startAngle,
  endAngle,
  color,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: {
  cx: number;
  cy: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  color: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const innerRadius = radius * 0.6;
  const activeScale = isActive ? 1.05 : 1;
  const effectiveRadius = radius * activeScale;
  const effectiveInner = innerRadius * (isActive ? 0.95 : 1);

  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;

  const x1Outer = cx + effectiveRadius * Math.cos(startRad);
  const y1Outer = cy + effectiveRadius * Math.sin(startRad);
  const x2Outer = cx + effectiveRadius * Math.cos(endRad);
  const y2Outer = cy + effectiveRadius * Math.sin(endRad);

  const x1Inner = cx + effectiveInner * Math.cos(endRad);
  const y1Inner = cy + effectiveInner * Math.sin(endRad);
  const x2Inner = cx + effectiveInner * Math.cos(startRad);
  const y2Inner = cy + effectiveInner * Math.sin(startRad);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  const d = [
    `M ${x1Outer} ${y1Outer}`,
    `A ${effectiveRadius} ${effectiveRadius} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}`,
    `L ${x1Inner} ${y1Inner}`,
    `A ${effectiveInner} ${effectiveInner} 0 ${largeArc} 0 ${x2Inner} ${y2Inner}`,
    'Z',
  ].join(' ');

  return (
    <path
      d={d}
      fill={color}
      opacity={isActive ? 1 : 0.85}
      style={{
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        filter: isActive ? `drop-shadow(0 4px 12px ${color}66)` : 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}

export function SkillsPieChart({ categories }: SkillsPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = categories.reduce((sum, cat) => sum + cat.value, 0);
  let currentAngle = 0;

  const segments = categories.map((cat) => {
    const startAngle = currentAngle;
    const sweep = (cat.value / total) * 360;
    currentAngle += sweep;
    return { ...cat, startAngle, endAngle: startAngle + sweep };
  });

  const activeCategory = activeIndex !== null ? categories[activeIndex] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Chart */}
      <div className="flex justify-center">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
            {/* Gap ring */}
            {segments.map((seg, i) => (
              <DonutSegment
                key={seg.name}
                cx={100}
                cy={100}
                radius={90}
                startAngle={seg.startAngle + 1}
                endAngle={seg.endAngle - 1}
                color={seg.color}
                isActive={activeIndex === i}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              />
            ))}
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center transition-all duration-300">
              {activeCategory ? (
                <>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {activeCategory.value}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                    {activeCategory.name}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Skills
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Hover to explore
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend + skill tags */}
      <div className="space-y-6">
        {categories.map((cat, i) => (
          <div
            key={cat.name}
            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
              activeIndex === i
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg'
                : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Category header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {cat.name}
                </span>
              </div>
              <span className="text-sm font-mono font-medium text-gray-500 dark:text-gray-400 tabular-nums">
                {cat.value}%
              </span>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
