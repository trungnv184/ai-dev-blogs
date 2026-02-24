import { usePublicProfile } from '../../hooks/useCV';
import { resolveApiImageUrl } from '../../services/cvApi';
import { ContactIcons } from './ContactIcons';

export function CVHeader() {
  const { data: profile, isLoading } = usePublicProfile();

  if (isLoading) {
    return (
      <header className="print:mb-4">
        {/* Screen skeleton */}
        <div className="print:hidden relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex flex-col md:flex-row items-center gap-8 animate-pulse">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto md:mx-0" />
                <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto md:mx-0" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto md:mx-0" />
              </div>
            </div>
          </div>
        </div>
        {/* Print skeleton */}
        <div className="hidden print:block animate-pulse">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </div>
            <div className="w-20 h-20 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </header>
    );
  }

  if (!profile) {
    return (
      <header className="print:mb-4">
        <div className="print:hidden bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <p className="text-gray-500 dark:text-gray-400">Profile not configured yet.</p>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="print:mb-4">
      {/* ===== SCREEN VERSION ===== */}
      <div className="print:hidden relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
        <div className="absolute inset-0 bg-dot-pattern dark:bg-dot-pattern-dark bg-dot opacity-40 dark:opacity-20" />

        {/* Floating blobs */}
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary-400/10 dark:bg-primary-600/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-accent-purple/10 dark:bg-accent-purple/5 rounded-full blur-3xl animate-float-delayed" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Profile photo */}
            {resolveApiImageUrl(profile.profileImageUrl) ? (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 via-accent-purple to-accent-pink rounded-2xl opacity-50 group-hover:opacity-75 blur transition-opacity duration-300" />
                <img
                  src={resolveApiImageUrl(profile.profileImageUrl)}
                  alt={profile.name}
                  className="relative w-36 h-36 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-950"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            ) : (
              <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                <span className="text-5xl font-bold text-white">
                  {profile.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {profile.name}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-3">
                {profile.title}
              </p>

              {profile.location && (
                <a
                  href={profile.locationUrl || '#'}
                  target={profile.locationUrl ? '_blank' : undefined}
                  rel={profile.locationUrl ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors no-print-url mb-4"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </a>
              )}

              <ContactIcons contacts={profile.contacts} />
            </div>
          </div>

          {/* Summary */}
          {profile.summary && (
            <div className="mt-10 max-w-3xl">
              <SummaryContent summary={profile.summary} />
            </div>
          )}
        </div>
      </div>

      {/* ===== PRINT VERSION ===== */}
      <div className="hidden print:block">
        <div className="flex items-start justify-between gap-4 print:gap-2">
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 print:text-xl">
              {profile.name}
            </h1>
            <p className="text-base text-gray-600 max-w-md print:text-sm">
              {profile.title}
            </p>
            {profile.location && (
              <p className="text-sm text-gray-500">{profile.location}</p>
            )}
            <ContactIcons contacts={profile.contacts} />
          </div>
          {resolveApiImageUrl(profile.profileImageUrl) && (
            <img
              src={resolveApiImageUrl(profile.profileImageUrl)}
              alt={profile.name}
              className="w-20 h-20 rounded-xl object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>
        {profile.summary && (
          <div className="mt-4 print:mt-3">
            <h2 className="text-lg font-bold text-gray-900 mb-2 print:text-base">About</h2>
            <SummaryContent summary={profile.summary} />
          </div>
        )}
      </div>
    </header>
  );
}

function SummaryContent({ summary }: { summary: string }) {
  const lines = summary.split(/\r?\n/);
  const bulletPattern = /^[\s]*[-•*]\s+/;
  const hasBulletLines = lines.some(line => bulletPattern.test(line));
  const hasInlineBullets = summary.includes(' • ') || summary.includes('• ');

  if (!hasBulletLines && !hasInlineBullets) {
    const paragraphs = summary.split(/\n\n+/).filter(p => p.trim());
    return (
      <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed print:text-xs space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph.trim()}</p>
        ))}
      </div>
    );
  }

  if (hasInlineBullets && !hasBulletLines) {
    const parts = summary.split(/\s*•\s*/);
    const intro = parts[0]?.trim();
    const bullets = parts.slice(1).map(b => b.trim()).filter(Boolean);

    return (
      <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed print:text-xs">
        {intro && <p className="mb-4">{intro}</p>}
        {bullets.length > 0 && (
          <ul className="space-y-2 list-none">
            {bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary-500 dark:text-primary-400 mt-0.5 flex-shrink-0">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  const introLines: string[] = [];
  const bulletItems: string[] = [];
  let foundFirstBullet = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    if (bulletPattern.test(line)) {
      foundFirstBullet = true;
      bulletItems.push(trimmedLine.replace(bulletPattern, '').trim());
    } else if (!foundFirstBullet) {
      introLines.push(trimmedLine);
    } else {
      bulletItems.push(trimmedLine);
    }
  }

  const intro = introLines.join(' ');

  return (
    <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed print:text-xs">
      {intro && <p className="mb-4">{intro}</p>}
      {bulletItems.length > 0 && (
        <ul className="space-y-2 list-none">
          {bulletItems.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary-500 dark:text-primary-400 mt-0.5 flex-shrink-0">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
