import { Layout } from '../components/common/Layout';
import { CVHeader } from '../components/about/CVHeader';
import { CVSection } from '../components/about/CVSection';

export function About() {
  return (
    <Layout title="About" description="Learn more about my background, skills, and experience.">
      {/* Screen layout — wide, modern portfolio */}
      <div className="print:hidden">
        <CVHeader />
        <CVSection />
      </div>

      {/* Print layout — narrow CV format */}
      <article className="hidden print:block max-w-2xl mx-auto px-0 py-0">
        <CVHeader />
        <CVSection />
      </article>
    </Layout>
  );
}
