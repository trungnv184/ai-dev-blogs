import { Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { PostCard } from '../components/blog/PostCard';
import { PostList } from '../components/blog/PostList';
import { CVDownload } from '../components/about/CVDownload';
import { SkillsPieChart } from '../components/about/SkillsPieChart';
import { usePosts } from '../hooks/usePosts';

const skillCategories = [
  {
    name: 'Leadership',
    value: 35,
    color: '#8b5cf6',
    skills: ['Team Leadership', 'Agile/Scrum', 'Strategic Planning', 'Mentoring'],
  },
  {
    name: 'Backend',
    value: 30,
    color: '#10b981',
    skills: ['Node.js', 'NestJS', 'PostgreSQL', 'System Design'],
  },
  {
    name: 'Frontend',
    value: 25,
    color: '#3b82f6',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
  },
  {
    name: 'DevOps',
    value: 10,
    color: '#f59e0b',
    skills: ['Docker', 'CI/CD', 'AWS', 'Monitoring'],
  },
];

const topics = [
  {
    name: 'Engineering Leadership',
    description: 'Managing teams, growing engineers, and building culture',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    border: 'hover:border-purple-200 dark:hover:border-purple-800',
  },
  {
    name: 'System Architecture',
    description: 'Designing scalable systems, microservices, and APIs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    border: 'hover:border-blue-200 dark:hover:border-blue-800',
  },
  {
    name: 'Web Development',
    description: 'React, TypeScript, Node.js, and modern tooling',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    border: 'hover:border-emerald-200 dark:hover:border-emerald-800',
  },
  {
    name: 'Career Growth',
    description: 'Navigating tech careers, IC to manager, and beyond',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    border: 'hover:border-amber-200 dark:hover:border-amber-800',
  },
];

const stats = [
  {
    value: '10+',
    label: 'Years Experience',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    value: '5+',
    label: 'Teams Led',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    value: '50+',
    label: 'Projects Delivered',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
];

export function Home() {
  const { data, isLoading } = usePosts({ limit: 3 });
  const posts = data?.data || [];

  return (
    <Layout>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="absolute inset-0 bg-dot-pattern dark:bg-dot-pattern-dark bg-dot opacity-40 dark:opacity-20" />

        {/* Floating blobs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-400/15 dark:bg-primary-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent-purple/10 dark:bg-accent-purple/5 rounded-full blur-3xl animate-float-delayed" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div>
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium mb-6 animate-fade-in">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Available for new opportunities
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 opacity-0 animate-fade-in-up">
                <span className="text-gray-900 dark:text-gray-100">Engineering</span>
                <br />
                <span className="text-gray-900 dark:text-gray-100">Manager </span>
                <span className="gradient-text">&amp; Tech Leader</span>
              </h1>

              {/* Sub */}
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-lg opacity-0 animate-fade-in-up animation-delay-200">
                Building high-performing teams and scalable systems. Sharing insights on technology, leadership, and career growth.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-10 opacity-0 animate-fade-in-up animation-delay-400">
                <Link to="/blog" className="btn btn-primary px-6">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Read My Blog
                </Link>
                <Link to="/about" className="btn btn-secondary px-6">
                  About Me
                </Link>
                <CVDownload cvUrl="/cv.pdf" />
              </div>

              {/* Social proof */}
              <div className="opacity-0 animate-fade-in-up animation-delay-600">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                  Previously at
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {['Company A', 'Company B', 'Company C'].map((company) => (
                    <span
                      key={company}
                      className="text-sm font-semibold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Stats cards */}
            <div className="opacity-0 animate-fade-in-up animation-delay-400">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="card p-5 flex items-center gap-4 group hover:border-primary-200 dark:hover:border-primary-800 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT I WRITE ABOUT ===== */}
      <section className="py-20 bg-gray-50/50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">What I Write About</h2>
            <p className="section-subheading mx-auto">
              Practical insights from the intersection of engineering and leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.name}
                className={`card p-5 text-center group cursor-default ${topic.border} transition-all`}
              >
                <div className={`w-12 h-12 mx-auto rounded-xl ${topic.color} flex items-center justify-center mb-4`}>
                  {topic.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1.5">
                  {topic.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KEY EXPERTISE (Pie Chart) ===== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-heading mb-3">Key Expertise</h2>
            <p className="section-subheading mx-auto">
              A blend of technical depth and leadership breadth, refined over a decade of building products and teams.
            </p>
          </div>

          <SkillsPieChart categories={skillCategories} />
        </div>
      </section>

      {/* Divider */}
      <div className="divider-gradient max-w-6xl mx-auto" />

      {/* ===== RECENT POSTS ===== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="section-heading mb-2">Recent Posts</h2>
              <p className="section-subheading">
                Thoughts on building great software and leading teams.
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:gap-3 transition-all font-medium text-sm"
            >
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* All posts — consistent horizontal layout (image left, content right) */}
          {isLoading ? (
            <PostList posts={[]} isLoading={true} />
          ) : posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} variant="featured" />
              ))}
            </div>
          ) : (
            <PostList posts={[]} isLoading={false} />
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/blog" className="btn btn-secondary">
              View all posts
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-purple dark:from-primary-800 dark:via-primary-900 dark:to-purple-950" />
        <div className="absolute inset-0 bg-dot-pattern bg-dot opacity-10" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Let's Build Something Great
          </h2>
          <p className="text-primary-100/80 mb-8 max-w-2xl mx-auto text-lg">
            Interested in working together or just want to chat about technology and leadership? I'd love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-7 py-3 rounded-xl font-semibold hover:bg-primary-50 hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get in Touch
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-7 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Learn More About Me
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
