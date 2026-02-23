import { v4 as uuidv4 } from 'uuid';
import { ManagementSkill } from '../../services/cvApi';

interface ManagementSkillsEditorProps {
  skills: ManagementSkill[];
  onChange: (skills: ManagementSkill[]) => void;
  maxSkills?: number;
}

export function ManagementSkillsEditor({
  skills,
  onChange,
  maxSkills = 10,
}: ManagementSkillsEditorProps) {
  const handleAddSkill = () => {
    if (skills.length >= maxSkills) return;

    const newSkill: ManagementSkill = {
      id: uuidv4(),
      name: '',
      percentage: 50,
    };
    onChange([...skills, newSkill]);
  };

  const handleUpdateSkill = (id: string, updates: Partial<ManagementSkill>) => {
    onChange(
      skills.map((skill) =>
        skill.id === id ? { ...skill, ...updates } : skill
      )
    );
  };

  const handleRemoveSkill = (id: string) => {
    onChange(skills.filter((skill) => skill.id !== id));
  };

  const handlePercentageChange = (id: string, value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;

    const clamped = Math.min(100, Math.max(1, num));
    handleUpdateSkill(id, { percentage: clamped });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Management Skills
          </label>
          <p className="text-xs text-gray-500 mt-1">
            These will be displayed as a pie chart on your public profile.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddSkill}
          disabled={skills.length >= maxSkills}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Skill
        </button>
      </div>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div
            key={skill.id}
            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-sm text-gray-500 w-6">{index + 1}.</span>

            <div className="flex-1">
              <input
                type="text"
                value={skill.name}
                onChange={(e) =>
                  handleUpdateSkill(skill.id, { name: e.target.value })
                }
                placeholder="Skill name"
                maxLength={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="w-24">
              <div className="flex items-center">
                <input
                  type="number"
                  value={skill.percentage}
                  onChange={(e) =>
                    handlePercentageChange(skill.id, e.target.value)
                  }
                  min={1}
                  max={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="ml-1 text-sm text-gray-500">%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveSkill(skill.id)}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <p className="text-sm text-gray-500">
          No management skills added yet. Add skills to display a pie chart on
          your public profile.
        </p>
      )}

      {skills.length >= maxSkills && (
        <p className="text-sm text-yellow-600">
          Maximum of {maxSkills} skills reached.
        </p>
      )}

      <p className="text-xs text-gray-500">
        Note: Percentages represent proficiency levels and will be normalized
        for the pie chart display.
      </p>
    </div>
  );
}
