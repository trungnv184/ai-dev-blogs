import { useState, useEffect } from 'react';
import { CVData, WorkHistoryEntry, EducationEntry } from '../../services/cvApi';
import { SkillsEditor } from './SkillsEditor';
import { WorkHistoryEditor } from './WorkHistoryEditor';
import { EducationEditor } from './EducationEditor';

interface CVEditorProps {
  data: CVData;
  onSave: (data: { skills: string[]; workHistory: WorkHistoryEntry[]; education: EducationEntry[] }) => void;
  onPublish: () => void;
  onUnpublish: () => void;
  isSaving: boolean;
}

export function CVEditor({
  data,
  onSave,
  onPublish,
  onUnpublish,
  isSaving,
}: CVEditorProps) {
  const [skills, setSkills] = useState<string[]>(data.skills);
  const [workHistory, setWorkHistory] = useState<WorkHistoryEntry[]>(data.workHistory);
  const [education, setEducation] = useState<EducationEntry[]>(data.education);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setSkills(data.skills);
    setWorkHistory(data.workHistory);
    setEducation(data.education);
    setHasChanges(false);
  }, [data]);

  useEffect(() => {
    const skillsChanged = JSON.stringify(skills) !== JSON.stringify(data.skills);
    const workHistoryChanged = JSON.stringify(workHistory) !== JSON.stringify(data.workHistory);
    const educationChanged = JSON.stringify(education) !== JSON.stringify(data.education);
    setHasChanges(skillsChanged || workHistoryChanged || educationChanged);
  }, [skills, workHistory, education, data]);

  const handleSave = () => {
    onSave({ skills, workHistory, education });
  };

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <div
        className={`p-4 rounded-lg ${
          data.published
            ? 'bg-green-50 border border-green-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                data.published
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {data.published ? 'Published' : 'Draft'}
            </span>
            {data.publishedAt && (
              <span className="ml-2 text-sm text-gray-600">
                Published on{' '}
                {new Date(data.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-sm text-orange-600">Unsaved changes</span>
            )}
            {data.published ? (
              <button
                onClick={onUnpublish}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 disabled:opacity-50"
              >
                Unpublish
              </button>
            ) : (
              <button
                onClick={onPublish}
                disabled={isSaving || hasChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                title={hasChanges ? 'Save changes before publishing' : ''}
              >
                Publish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CV Info */}
      {data.pdfFileName && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Uploaded PDF:</span> {data.pdfFileName}
          </p>
        </div>
      )}

      {/* Editors */}
      <div className="bg-white shadow rounded-lg p-6">
        <SkillsEditor skills={skills} onChange={setSkills} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <WorkHistoryEditor workHistory={workHistory} onChange={setWorkHistory} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <EducationEditor education={education} onChange={setEducation} />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
