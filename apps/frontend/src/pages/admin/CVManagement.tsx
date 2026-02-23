import { useState, useCallback } from 'react';
import { Layout } from '../../components/common/Layout';
import { CVUpload } from '../../components/admin/CVUpload';
import { CVEditor } from '../../components/admin/CVEditor';
import { ProfileEditor } from '../../components/admin/ProfileEditor';
import { useCV, useCVMutations } from '../../hooks/useCV';
import { CVParseResult } from '../../services/cvApi';

export function CVManagement() {
  const { data: cvData, isLoading: cvLoading } = useCV();
  const mutations = useCVMutations();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUploadComplete = (result: CVParseResult) => {
    setError(null);
    setSuccess(result.message);
    if (result.warnings && result.warnings.length > 0) {
      setSuccess(`${result.message} Warning: ${result.warnings.join(', ')}`);
    }
  };

  const handleUpload = useCallback(async (file: File): Promise<CVParseResult> => {
    const result = await mutations.upload.mutateAsync(file);
    return result;
  }, [mutations.upload]);

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };

  const handleSaveCV = async (data: {
    skills: string[];
    workHistory: typeof cvData extends null ? never : NonNullable<typeof cvData>['workHistory'];
    education: typeof cvData extends null ? never : NonNullable<typeof cvData>['education'];
  }) => {
    try {
      await mutations.update.mutateAsync(data);
      setSuccess('CV saved successfully.');
      setError(null);
    } catch (err) {
      setError('Failed to save CV. Please try again.');
      setSuccess(null);
    }
  };

  const handlePublish = async () => {
    try {
      await mutations.publish.mutateAsync();
      setSuccess('CV published successfully.');
      setError(null);
    } catch (err) {
      setError('Failed to publish CV. Please try again.');
      setSuccess(null);
    }
  };

  const handleUnpublish = async () => {
    try {
      await mutations.unpublish.mutateAsync();
      setSuccess('CV unpublished successfully.');
      setError(null);
    } catch (err) {
      setError('Failed to unpublish CV. Please try again.');
      setSuccess(null);
    }
  };

  const isSaving =
    mutations.upload.isPending ||
    mutations.update.isPending ||
    mutations.publish.isPending ||
    mutations.unpublish.isPending;

  return (
    <Layout title="CV Management">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            CV Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your profile and CV information
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
            <button
              onClick={() => setSuccess(null)}
              className="ml-2 text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <ProfileEditor />
          </section>

          {/* Upload Section */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Upload CV
            </h2>
            <CVUpload
              onUpload={handleUpload}
              onUploadComplete={handleUploadComplete}
              onError={handleUploadError}
              isUploading={mutations.upload.isPending}
            />
          </section>

          {/* CV Editor Section */}
          {cvLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            cvData && (
              <section>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Edit CV Data
                </h2>
                <CVEditor
                  data={cvData}
                  onSave={handleSaveCV}
                  onPublish={handlePublish}
                  onUnpublish={handleUnpublish}
                  isSaving={isSaving}
                />
              </section>
            )
          )}
        </div>
      </div>
    </Layout>
  );
}
