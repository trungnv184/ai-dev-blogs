import React, { useState, useCallback } from 'react';

interface SkillsEditorProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInputValue('');
    }
  }, [inputValue, skills, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddSkill();
      }
    },
    [handleAddSkill]
  );

  const handleRemoveSkill = useCallback(
    (skillToRemove: string) => {
      onChange(skills.filter((skill) => skill !== skillToRemove));
    },
    [skills, onChange]
  );

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Technical Skills
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
          >
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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

      {skills.length === 0 && (
        <p className="text-sm text-gray-500">No skills added yet.</p>
      )}
    </div>
  );
}
