import { Link } from 'react-router-dom';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string;
    category?: {
      name: string;
      slug: string;
    };
    publishedAt?: string;
    readingTime: number;
  };
  variant?: 'default' | 'featured';
}

const categoryGradients: Record<string, string> = {
  leadership: 'from-purple-500/20 via-purple-400/10 to-pink-500/20 dark:from-purple-900/40 dark:via-purple-800/20 dark:to-pink-900/40',
  technology: 'from-blue-500/20 via-cyan-400/10 to-blue-500/20 dark:from-blue-900/40 dark:via-cyan-800/20 dark:to-blue-900/40',
  career: 'from-emerald-500/20 via-green-400/10 to-teal-500/20 dark:from-emerald-900/40 dark:via-green-800/20 dark:to-teal-900/40',
  devops: 'from-amber-500/20 via-orange-400/10 to-amber-500/20 dark:from-amber-900/40 dark:via-orange-800/20 dark:to-amber-900/40',
  default: 'from-gray-200/60 via-gray-100/40 to-gray-200/60 dark:from-gray-800/60 dark:via-gray-700/40 dark:to-gray-800/60',
};

function getGradient(categorySlug?: string): string {
  if (!categorySlug) return categoryGradients.default;
  return categoryGradients[categorySlug.toLowerCase()] || categoryGradients.default;
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group card card-hover ${isFeatured ? 'md:flex md:flex-row' : ''}`}
    >
      {/* Image or gradient placeholder */}
      <div className={`overflow-hidden bg-gray-100 dark:bg-gray-800 ${
        isFeatured
          ? 'aspect-video md:aspect-auto md:w-1/2 md:min-h-[280px]'
          : 'aspect-video'
      }`}>
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.category?.slug)} flex items-center justify-center`}>
            <div className="text-center px-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/60 dark:bg-gray-900/60 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              {post.category && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {post.category.name}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-6 ${isFeatured ? 'md:flex-1 md:flex md:flex-col md:justify-center md:p-8' : ''}`}>
        <div className="flex items-center gap-3 mb-3">
          {post.category && (
            <span className="badge badge-primary">
              {post.category.name}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {post.readingTime} min read
          </div>
        </div>

        <h3 className={`font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 mb-2 ${
          isFeatured ? 'text-xl sm:text-2xl line-clamp-3' : 'text-lg line-clamp-2'
        }`}>
          {post.title}
        </h3>

        <p className={`text-gray-500 dark:text-gray-400 leading-relaxed ${
          isFeatured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'
        }`}>
          {post.excerpt}
        </p>

        {post.publishedAt && (
          <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between ${
            isFeatured ? 'md:mt-6 md:pt-6' : ''
          }`}>
            <time className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              Read more
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
