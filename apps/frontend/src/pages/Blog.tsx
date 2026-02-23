import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { PostList } from '../components/blog/PostList';
import { CategoryFilter } from '../components/blog/CategoryFilter';
import { SearchBar } from '../components/blog/SearchBar';
import { usePosts, useCategories } from '../hooks/usePosts';

export function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;

  const { data: postsData, isLoading } = usePosts({ page, category, search });
  const { data: categories = [] } = useCategories();

  const handleCategoryChange = useCallback(
    (newCategory: string | undefined) => {
      const params = new URLSearchParams(searchParams);
      if (newCategory) {
        params.set('category', newCategory);
      } else {
        params.delete('category');
      }
      setSearchParams(params);
      setPage(1);
    },
    [searchParams, setSearchParams]
  );

  const handleSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set('search', query);
      } else {
        params.delete('search');
      }
      setSearchParams(params);
      setPage(1);
    },
    [searchParams, setSearchParams]
  );

  return (
    <Layout title="Blog" description="Read articles about technology, leadership, and career growth.">
      {/* Blog header */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="section-heading mb-3">
            Blog
          </h1>
          <p className="section-subheading">
            Thoughts on technology, leadership, and building great teams.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <CategoryFilter
            categories={categories}
            selectedCategory={category}
            onSelect={handleCategoryChange}
          />
        </div>

        {/* Posts */}
        <PostList posts={postsData?.data || []} isLoading={isLoading} />

        {/* Pagination */}
        {postsData && postsData.meta.totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!postsData.meta.hasPreviousPage}
              className="btn btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 tabular-nums">
              {page} / {postsData.meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!postsData.meta.hasNextPage}
              className="btn btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
