import { SkillBadge } from './SkillBadge';

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'leadership' | 'management';
  proficiency: number;
  icon?: string;
}

interface SkillsSectionProps {
  skills: Skill[];
}

const categoryLabels = {
  technical: 'Technical Skills',
  leadership: 'Leadership Skills',
  management: 'Management Skills',
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <div className="space-y-8">
      {(Object.keys(groupedSkills) as Array<keyof typeof categoryLabels>).map((category) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {categoryLabels[category]}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedSkills[category].map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
