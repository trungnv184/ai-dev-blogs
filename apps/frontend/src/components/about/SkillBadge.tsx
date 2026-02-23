interface SkillBadgeProps {
  skill: {
    name: string;
    proficiency: number;
    icon?: string;
  };
  showLevel?: boolean;
}

export function SkillBadge({ skill, showLevel = true }: SkillBadgeProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {skill.icon && <span className="text-xl">{skill.icon}</span>}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {skill.name}
        </span>
      </div>
      {showLevel && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${skill.proficiency}%` }}
          />
        </div>
      )}
    </div>
  );
}
