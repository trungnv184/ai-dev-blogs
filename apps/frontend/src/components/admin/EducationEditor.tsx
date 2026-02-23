import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EducationEntry } from '../../services/cvApi';

interface EducationEditorProps {
  education: EducationEntry[];
  onChange: (education: EducationEntry[]) => void;
}

const emptyEntry: Omit<EducationEntry, 'id'> = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  current: false,
};

export function EducationEditor({ education, onChange }: EducationEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddEntry = () => {
    const newEntry: EducationEntry = {
      ...emptyEntry,
      id: uuidv4(),
    };
    onChange([newEntry, ...education]);
    setExpandedId(newEntry.id);
  };

  const handleUpdateEntry = (id: string, updates: Partial<EducationEntry>) => {
    onChange(
      education.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const handleRemoveEntry = (id: string) => {
    onChange(education.filter((entry) => entry.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Education
        </label>
        <button
          type="button"
          onClick={handleAddEntry}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Entry
        </button>
      </div>

      <div className="space-y-3">
        {education.map((entry) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() =>
                setExpandedId(expandedId === entry.id ? null : entry.id)
              }
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
            >
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {entry.degree || 'New Education'}
                  {entry.field && ` in ${entry.field}`}
                </p>
                <p className="text-sm text-gray-600">
                  {entry.institution || 'Institution'} •{' '}
                  {entry.startDate || 'Start'} -{' '}
                  {entry.current ? 'Present' : entry.endDate || 'End'}
                </p>
              </div>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedId === entry.id ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedId === entry.id && (
              <div className="p-4 space-y-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={entry.institution}
                    onChange={(e) =>
                      handleUpdateEntry(entry.id, { institution: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Degree
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Bachelor's, Master's"
                      value={entry.degree}
                      onChange={(e) =>
                        handleUpdateEntry(entry.id, { degree: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Computer Science"
                      value={entry.field || ''}
                      onChange={(e) =>
                        handleUpdateEntry(entry.id, { field: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2016"
                      value={entry.startDate}
                      onChange={(e) =>
                        handleUpdateEntry(entry.id, { startDate: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2020"
                      value={entry.endDate || ''}
                      disabled={entry.current}
                      onChange={(e) =>
                        handleUpdateEntry(entry.id, { endDate: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`current-edu-${entry.id}`}
                    checked={entry.current}
                    onChange={(e) =>
                      handleUpdateEntry(entry.id, {
                        current: e.target.checked,
                        endDate: e.target.checked ? undefined : entry.endDate,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`current-edu-${entry.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    Currently studying
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveEntry(entry.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Entry
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {education.length === 0 && (
        <p className="text-sm text-gray-500">No education entries yet.</p>
      )}
    </div>
  );
}
