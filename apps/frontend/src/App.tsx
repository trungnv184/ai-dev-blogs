import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { LargeListDemo } from './pages/LargeListDemo';

// Admin Pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { EditPost } from './pages/admin/EditPost';
import { CVManagement } from './pages/admin/CVManagement';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/demos/large-list" element={<LargeListDemo />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/posts/:id" element={<EditPost />} />
              <Route path="/admin/cv" element={<CVManagement />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
