import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function Layout({ children, title, description }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={title} description={description} />
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
