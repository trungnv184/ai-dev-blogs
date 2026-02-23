import { useState } from 'react';

interface CVDownloadProps {
  cvUrl?: string;
}

export function CVDownload({ cvUrl }: CVDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cvUrl) return;

    setIsDownloading(true);

    // Track download event
    console.log('CV Download tracked');

    // Simulate download delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Open CV URL
    window.open(cvUrl, '_blank');

    setIsDownloading(false);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!cvUrl || isDownloading}
      className="btn btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed print:hidden"
    >
      {isDownloading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Downloading...
        </>
      ) : (
        <>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download CV
        </>
      )}
    </button>
  );
}
