import { useState } from 'react';
import { usePublicCV } from '../../hooks/useCV';
import { WorkExperience } from './WorkExperience';
import { CVDownload } from './CVDownload';
import { getDownloadUrl } from '../../services/cvApi';

export function CVSection() {
  const { data: cvData, isLoading } = usePublicCV();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 print:py-8">
        <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!cvData) return null;

  const hasSkills = cvData.skills.length > 0;
  const hasWorkHistory = cvData.workHistory.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasManagement = cvData.managementSkills.length > 0;
  const hasDownload = !!cvData.downloadUrl;

  if (!hasSkills && !hasWorkHistory && !hasEducation) return null;

  return (
    <>
      {/* ===== SCREEN VERSION ===== */}
      <div className="print:hidden">
        {/* Work Experience */}
        {hasWorkHistory && (
          <section className="py-16 border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <h2 className="section-heading mb-2">Work Experience</h2>
                <p className="section-subheading">Where I've been building and leading.</p>
              </div>
              <WorkExperience
                experiences={cvData.workHistory.map((wh) => ({
                  id: wh.id,
                  company: wh.company,
                  role: wh.role,
                  startDate: wh.startDate,
                  endDate: wh.endDate,
                  current: wh.current,
                  description: wh.description,
                  highlights: wh.highlights,
                  location: wh.location,
                  badges: wh.badges,
                }))}
              />
            </div>
          </section>
        )}

        {/* Skills + Management — side by side on large screens */}
        {(hasSkills || hasManagement) && (
          <section className="py-16 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <h2 className="section-heading mb-2">Skills &amp; Expertise</h2>
                <p className="section-subheading">Technical proficiencies and leadership capabilities.</p>
              </div>

              <div className={`grid gap-12 ${hasManagement && hasSkills ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Technical Skills */}
                {hasSkills && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-5">
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Management Skills Donut */}
                {hasManagement && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-5">
                      Leadership &amp; Management
                    </h3>
                    <ManagementDonut skills={cvData.managementSkills} />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Education */}
        {hasEducation && (
          <section className="py-16 border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <h2 className="section-heading mb-2">Education</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cvData.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="card p-5 group hover:border-primary-100 dark:hover:border-primary-900/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                          {edu.institution}
                        </h3>
                        <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {edu.degree}
                          {edu.field && ` in ${edu.field}`}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 tabular-nums">
                          {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Download CTA */}
        {hasDownload && (
          <section className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="inline-flex flex-col items-center gap-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Want a printable version?
                  </p>
                  <CVDownload cvUrl={getDownloadUrl()} />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ===== PRINT VERSION ===== */}
      <div className="hidden print:block space-y-4">
        {hasWorkHistory && (
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">Work Experience</h2>
            <WorkExperience
              experiences={cvData.workHistory.map((wh) => ({
                id: wh.id,
                company: wh.company,
                role: wh.role,
                startDate: wh.startDate,
                endDate: wh.endDate,
                current: wh.current,
                description: wh.description,
                highlights: wh.highlights,
                location: wh.location,
                badges: wh.badges,
              }))}
            />
          </section>
        )}

        {hasEducation && (
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">Education</h2>
            <div className="space-y-1">
              {cvData.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{edu.institution}</h3>
                      <p className="font-mono text-xs text-gray-600">
                        {edu.degree}{edu.field && ` in ${edu.field}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 tabular-nums">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasSkills && (
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {cvData.skills.map((skill, index) => (
                <span key={`${skill}-${index}`} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

// ===== Management Skills Donut Chart =====

interface ManagementSkill {
  id: string;
  name: string;
  percentage: number;
}

const DONUT_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#ef4444', // red
  '#84cc16', // lime
];

function ManagementDonut({ skills }: { skills: ManagementSkill[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = skills.reduce((sum, s) => sum + s.percentage, 0);
  let currentAngle = 0;

  const segments = skills.map((skill, i) => {
    const startAngle = currentAngle;
    const sweep = (skill.percentage / total) * 360;
    currentAngle += sweep;
    return {
      ...skill,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
      startAngle,
      endAngle: startAngle + sweep,
    };
  });

  const activeSkill = activeIndex !== null ? segments[activeIndex] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      {/* Chart */}
      <div className="relative w-48 h-48 flex-shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {segments.map((seg, i) => (
            <DonutSegment
              key={seg.id}
              cx={100}
              cy={100}
              radius={85}
              innerRadius={55}
              startAngle={seg.startAngle + 1}
              endAngle={seg.endAngle - 1}
              color={seg.color}
              isActive={activeIndex === i}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center transition-all duration-200">
            {activeSkill ? (
              <>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {activeSkill.percentage}%
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium max-w-[60px] leading-tight">
                  {activeSkill.name}
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-400 dark:text-gray-500">Hover</div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 grid grid-cols-1 gap-2">
        {segments.map((seg, i) => (
          <div
            key={seg.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer ${
              activeIndex === i
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{seg.name}</span>
            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 tabular-nums">
              {seg.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutSegment({
  cx, cy, radius, innerRadius, startAngle, endAngle, color, isActive, onMouseEnter, onMouseLeave,
}: {
  cx: number; cy: number; radius: number; innerRadius: number;
  startAngle: number; endAngle: number; color: string;
  isActive: boolean; onMouseEnter: () => void; onMouseLeave: () => void;
}) {
  const scale = isActive ? 1.04 : 1;
  const r = radius * scale;
  const ir = innerRadius * (isActive ? 0.96 : 1);

  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const startRad = toRad(startAngle);
  const endRad = toRad(endAngle);

  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const x3 = cx + ir * Math.cos(endRad);
  const y3 = cy + ir * Math.sin(endRad);
  const x4 = cx + ir * Math.cos(startRad);
  const y4 = cy + ir * Math.sin(startRad);

  const large = endAngle - startAngle > 180 ? 1 : 0;

  const d = `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${ir} ${ir} 0 ${large} 0 ${x4} ${y4} Z`;

  return (
    <path
      d={d}
      fill={color}
      opacity={isActive ? 1 : 0.8}
      style={{
        transition: 'all 0.2s ease-out',
        filter: isActive ? `drop-shadow(0 2px 8px ${color}55)` : 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
