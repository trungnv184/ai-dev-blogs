import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/common/Layout';
import { usePostById, useCategories } from '../../hooks/usePosts';
import api from '../../services/api';

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean(),
});

type PostFormData = z.infer<typeof postSchema>;

export function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const { data: post, isLoading: isLoadingPost } = usePostById(isNew ? '' : id || '');
  const { data: categories = [] } = useCategories();
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      categoryId: '',
      tags: '',
      published: false,
    },
  });

  useEffect(() => {
    if (post && !isNew) {
      reset({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        categoryId: post.category?.id || '',
        tags: post.tags?.join(', ') || '',
        published: post.published,
      });
    }
  }, [post, isNew, reset]);

  const preparePostData = (data: PostFormData) => {
    const postData: Record<string, unknown> = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      published: data.published,
      tags: data.tags?.split(',').map((t) => t.trim()).filter(Boolean) || [],
    };
    // Only include categoryId if it's not empty
    if (data.categoryId) {
      postData.categoryId = data.categoryId;
    }
    return postData;
  };

  const createMutation = useMutation({
    mutationFn: (data: PostFormData) => api.post('/posts', preparePostData(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/admin');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PostFormData) => api.put(`/posts/${id}`, preparePostData(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post-by-id', id] });
      navigate('/admin');
    },
  });

  const onSubmit = (data: PostFormData) => {
    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  const content = watch('content');
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (!isNew && isLoadingPost) {
    return (
      <Layout title="Loading...">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8" />
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isNew ? 'New Post' : 'Edit Post'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isNew ? 'Create New Post' : 'Edit Post'}
          </h1>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn btn-secondary"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {showPreview ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <article className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </article>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input {...register('title')} className="input" placeholder="Post title" />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Excerpt *
              </label>
              <textarea
                {...register('excerpt')}
                rows={3}
                className="input resize-none"
                placeholder="Short description for previews"
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content * (Markdown)
              </label>
              <textarea
                {...register('content')}
                rows={15}
                className="input resize-none font-mono text-sm"
                placeholder="Write your post content in Markdown..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select {...register('categoryId')} className="input">
                  <option value="">Select category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  {...register('tags')}
                  className="input"
                  placeholder="react, typescript, tutorial"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('published')}
                id="published"
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="published" className="text-sm text-gray-700 dark:text-gray-300">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : isNew ? 'Create Post' : 'Update Post'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
