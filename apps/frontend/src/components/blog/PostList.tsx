import { PostCard } from './PostCard';

interface Post {
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
}

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
}

function PostSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
      <div className="p-6">
        <div className="flex gap-2 mb-2">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2" />
      </div>
    </div>
  );
}

export function PostList({ posts, isLoading }: PostListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No posts found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Check back later for new content.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
