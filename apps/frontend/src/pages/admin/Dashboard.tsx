import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/common/Layout';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { data: postsData, isLoading } = usePosts({ published: undefined });
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name}
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/cv" className="btn btn-secondary">
              Manage CV
            </Link>
            <Link to="/admin/posts/new" className="btn btn-primary">
              New Post
            </Link>
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Posts
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {postsData?.meta.totalItems || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Published
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {postsData?.data.filter((p) => p.published).length || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Drafts
            </h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
              {postsData?.data.filter((p) => !p.published).length || 0}
            </p>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Posts
            </h2>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : postsData?.data.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No posts yet.{' '}
              <Link to="/admin/posts/new" className="text-primary-600">
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {postsData?.data.map((post) => (
                <div
                  key={post.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {post.published ? 'Published' : 'Draft'} •{' '}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/posts/${post.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-gray-600 hover:text-gray-700 dark:text-gray-400 text-sm"
                      target="_blank"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-600 hover:text-red-700 text-sm"
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
