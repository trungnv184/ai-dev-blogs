import { Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';

export function NotFound() {
  return (
    <Layout title="Page Not Found">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
            <Link to="/blog" className="btn btn-secondary">
              View Blog
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
