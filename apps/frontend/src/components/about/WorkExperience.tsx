interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  highlights: string[];
  location?: string;
  badges?: string[];
}

interface WorkExperienceProps {
  experiences: Experience[];
}

export function WorkExperience({ experiences }: WorkExperienceProps) {
  return (
    <>
      {/* ===== SCREEN VERSION — Vertical Timeline ===== */}
      <div className="print:hidden space-y-0">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative group">
            {/* Timeline line */}
            {index < experiences.length - 1 && (
              <div className="absolute left-[19px] top-12 bottom-0 w-px bg-gray-200 dark:bg-gray-800 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors" />
            )}

            <div className="flex gap-6 pb-10">
              {/* Timeline dot */}
              <div className="relative flex-shrink-0 mt-1.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  exp.current
                    ? 'bg-primary-100 dark:bg-primary-900/40 ring-4 ring-primary-50 dark:ring-primary-900/20'
                    : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30'
                }`}>
                  {exp.current ? (
                    <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
                  ) : (
                    <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full group-hover:bg-primary-400 transition-colors" />
                  )}
                </div>
              </div>

              {/* Content card */}
              <div className="flex-1 min-w-0">
                <div className="card p-5 group-hover:shadow-lg group-hover:border-primary-100 dark:group-hover:border-primary-900/50 transition-all duration-300">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                        {exp.company}
                      </h3>
                      {exp.badges && exp.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {exp.badges.map((badge, i) => (
                            <span
                              key={i}
                              className="badge badge-primary text-[11px]"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="tabular-nums whitespace-nowrap">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                  </div>

                  {/* Role + Location */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                    <p className="font-mono text-sm text-primary-600 dark:text-primary-400">
                      {exp.role}
                    </p>
                    {exp.location && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {exp.location}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed mb-3">
                      {exp.description}
                    </p>
                  )}

                  {/* Highlights */}
                  {exp.highlights.length > 0 && (
                    <ul className="space-y-1.5">
                      {exp.highlights.map((highlight, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <span className="text-primary-400 dark:text-primary-500 mt-1 flex-shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                          <span className="leading-relaxed">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== PRINT VERSION — Compact list ===== */}
      <div className="hidden print:block space-y-2">
        {experiences.map((exp) => (
          <div key={exp.id} className="print:p-0">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900 print:text-sm">
                    {exp.company}
                  </h3>
                  {exp.badges && exp.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {exp.badges.map((badge, i) => (
                        <span key={i} className="inline-flex items-center rounded-md bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-800">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 tabular-nums whitespace-nowrap">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs text-gray-600">{exp.role}</p>
                {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
              </div>
            </div>
            {exp.description && (
              <p className="mt-1 text-xs text-gray-600 whitespace-pre-line">{exp.description}</p>
            )}
            {exp.highlights.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {exp.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
