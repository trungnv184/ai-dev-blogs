import React, { useCallback, useState } from 'react';
import { CVParseResult } from '../../services/cvApi';

interface CVUploadProps {
  onUpload: (file: File) => Promise<CVParseResult>;
  onUploadComplete: (result: CVParseResult) => void;
  onError: (error: string) => void;
  isUploading?: boolean;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function CVUpload({
  onUpload,
  onUploadComplete,
  onError,
  isUploading: externalIsUploading = false,
  disabled = false,
}: CVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [internalIsUploading, setInternalIsUploading] = useState(false);

  const isUploading = externalIsUploading || internalIsUploading;

  const validateFile = useCallback(
    (file: File): boolean => {
      if (file.type !== 'application/pdf') {
        onError('Invalid file type. Please upload a PDF file.');
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        onError('File too large. Maximum size is 10MB.');
        return false;
      }

      return true;
    },
    [onError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file && validateFile(file)) {
          setSelectedFile(file);
        }
      }
    },
    [disabled, isUploading, validateFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file && validateFile(file)) {
          setSelectedFile(file);
        }
      }
    },
    [validateFile]
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFile || isUploading) return;

    setInternalIsUploading(true);
    try {
      const result = await onUpload(selectedFile);
      onUploadComplete(result);
      setSelectedFile(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Upload failed. Please try again.';
      onError(message);
    } finally {
      setInternalIsUploading(false);
    }
  }, [selectedFile, isUploading, onUpload, onUploadComplete, onError]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="hidden"
          id="cv-file-input"
        />

        <label
          htmlFor="cv-file-input"
          className={`${disabled || isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF up to 10MB</p>
          </div>
        </label>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <svg
              className="h-8 w-8 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
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
          <span>Processing PDF...</span>
        </div>
      )}
    </div>
  );
}
