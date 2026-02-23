import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WorkHistoryEntry } from '../../services/cvApi';

interface WorkHistoryEditorProps {
  workHistory: WorkHistoryEntry[];
  onChange: (workHistory: WorkHistoryEntry[]) => void;
}

const emptyEntry: Omit<WorkHistoryEntry, 'id'> = {
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  highlights: [],
  location: '',
  badges: [],
};

export function WorkHistoryEditor({ workHistory, onChange }: WorkHistoryEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddEntry = () => {
    const newEntry: WorkHistoryEntry = {
      ...emptyEntry,
      id: uuidv4(),
    };
    onChange([newEntry, ...workHistory]);
    setExpandedId(newEntry.id);
  };

  const handleUpdateEntry = (id: string, updates: Partial<WorkHistoryEntry>) => {
    onChange(
      workHistory.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const handleRemoveEntry = (id: string) => {
    onChange(workHistory.filter((entry) => entry.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const handleAddHighlight = (id: string, highlight: string) => {
    const entry = workHistory.find((e) => e.id === id);
    if (entry && highlight.trim()) {
      handleUpdateEntry(id, {
        highlights: [...entry.highlights, highlight.trim()],
      });
    }
  };

  const handleRemoveHighlight = (id: string, index: number) => {
    const entry = workHistory.find((e) => e.id === id);
    if (entry) {
      handleUpdateEntry(id, {
        highlights: entry.highlights.filter((_, i) => i !== index),
      });
    }
  };

  const handleAddBadge = (id: string, badge: string) => {
    const entry = workHistory.find((e) => e.id === id);
    if (entry && badge.trim()) {
      handleUpdateEntry(id, {
        badges: [...(entry.badges || []), badge.trim()],
      });
    }
  };

  const handleRemoveBadge = (id: string, index: number) => {
    const entry = workHistory.find((e) => e.id === id);
    if (entry && entry.badges) {
      handleUpdateEntry(id, {
        badges: entry.badges.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Work History
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
        {workHistory.map((entry) => (
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
                  {entry.role || 'New Position'}
                </p>
                <p className="text-sm text-gray-600">
                  {entry.company || 'Company'} •{' '}
                  {entry.startDate || 'Start Date'} -{' '}
                  {entry.current ? 'Present' : entry.endDate || 'End Date'}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <input
                      type="text"
                      value={entry.company}
                      onChange={(e) =>
                        handleUpdateEntry(entry.id, { company: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <input
                      type="text"
                      value={entry.role}
                      onChange={(e) =>
                        handleUpdateEntry(entry.id, { role: e.target.value })
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
                      placeholder="e.g., Jan 2020"
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
                      placeholder="e.g., Dec 2023"
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
                    id={`current-${entry.id}`}
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
                    htmlFor={`current-${entry.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    Current position
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={entry.location || ''}
                    onChange={(e) =>
                      handleUpdateEntry(entry.id, { location: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={entry.description || ''}
                    onChange={(e) =>
                      handleUpdateEntry(entry.id, { description: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Skills / Tags
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Add technologies, skills, or tags (e.g., Remote, React, TypeScript)
                  </p>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(entry.badges || []).map((badge, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                        >
                          {badge}
                          <button
                            type="button"
                            onClick={() => handleRemoveBadge(entry.id, index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                    <BadgeInput
                      onAdd={(badge) => handleAddBadge(entry.id, badge)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Highlights
                  </label>
                  <div className="mt-2 space-y-2">
                    {entry.highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2"
                      >
                        <span className="flex-1 text-sm text-gray-600">
                          • {highlight}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(entry.id, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <HighlightInput
                      onAdd={(highlight) => handleAddHighlight(entry.id, highlight)}
                    />
                  </div>
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

      {workHistory.length === 0 && (
        <p className="text-sm text-gray-500">No work history entries yet.</p>
      )}
    </div>
  );
}

function HighlightInput({ onAdd }: { onAdd: (highlight: string) => void }) {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
        placeholder="Add a highlight..."
        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md"
      />
      <button
        type="button"
        onClick={handleAdd}
        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
      >
        Add
      </button>
    </div>
  );
}

function BadgeInput({ onAdd }: { onAdd: (badge: string) => void }) {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
        placeholder="Add a skill or tag..."
        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md"
      />
      <button
        type="button"
        onClick={handleAdd}
        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
      >
        Add
      </button>
    </div>
  );
}
