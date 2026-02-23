import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { PostContent } from '../components/blog/PostContent';
import { usePost } from '../hooks/usePosts';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePost(slug || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout title="Post Not Found">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog" className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={post.title}
      description={post.excerpt}
    >
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <Link
            to="/blog"
            className="text-primary-600 dark:text-primary-400 hover:underline mb-4 inline-block"
          >
            ← Back to Blog
          </Link>

          {post.category && (
            <span className="ml-4 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
              {post.category.name}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            <span>•</span>
            <span>{post.readingTime} min read</span>
            <span>•</span>
            <span>{post.viewCount} views</span>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-xl mb-8 shadow-lg"
          />
        )}

        {/* Content */}
        <PostContent content={post.content} />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
}
