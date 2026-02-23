import { Layout } from '../components/common/Layout';
import { ContactForm } from '../components/contact/ContactForm';
import { SocialLinks } from '../components/about/SocialLinks';
import { useContact } from '../hooks/useContact';

const socialLinks = {
  linkedin: 'https://linkedin.com/in/yourprofile',
  github: 'https://github.com/trungnv184',
  twitter: 'https://twitter.com/yourprofile',
  email: 'trungnv184@gmail.com',
};

export function Contact() {
  const { submitContact } = useContact();

  return (
    <Layout title="Contact" description="Get in touch with me.">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="section-heading mb-3">
            Get in Touch
          </h1>
          <p className="section-subheading mx-auto">
            Have a question or want to work together? I'd love to hear from you.
            Fill out the form below or reach out through social media.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <ContactForm onSubmit={submitContact} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="card p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a href={`mailto:${socialLinks.email}`} className="text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {socialLinks.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-sm">Remote / Worldwide</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="card p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Connect with Me
              </h2>
              <SocialLinks links={socialLinks} />
            </div>

            {/* Response Time */}
            <div className="rounded-2xl border border-primary-200 dark:border-primary-800/50 bg-primary-50/50 dark:bg-primary-900/10 p-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-1">
                    Response Time
                  </h2>
                  <p className="text-primary-600/80 dark:text-primary-400/80 text-sm leading-relaxed">
                    I typically respond within 24-48 hours. For urgent matters, reach out on LinkedIn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
