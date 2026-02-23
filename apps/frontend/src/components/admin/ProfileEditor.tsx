import { useState, useRef } from 'react';
import { useProfile, useProfileMutations } from '../../hooks/useCV';
import { UpdateProfileData, ContactInfo } from '../../services/cvApi';

export function ProfileEditor() {
  const { data: profile, isLoading } = useProfile();
  const { update, uploadImage } = useProfileMutations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateProfileData>({
    name: '',
    title: '',
    summary: '',
    location: '',
    locationUrl: '',
    contacts: {
      email: '',
      phone: '',
      website: '',
      linkedin: '',
      github: '',
      twitter: '',
    },
  });

  // Update form when profile data loads
  useState(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        title: profile.title,
        summary: profile.summary,
        location: profile.location || '',
        locationUrl: profile.locationUrl || '',
        contacts: {
          email: profile.contacts.email || '',
          phone: profile.contacts.phone || '',
          website: profile.contacts.website || '',
          linkedin: profile.contacts.linkedin || '',
          github: profile.contacts.github || '',
          twitter: profile.contacts.twitter || '',
        },
      });
    }
  });

  // Sync form data when profile changes
  if (profile && formData.name === '' && profile.name) {
    setFormData({
      name: profile.name,
      title: profile.title,
      summary: profile.summary,
      location: profile.location || '',
      locationUrl: profile.locationUrl || '',
      contacts: {
        email: profile.contacts.email || '',
        phone: profile.contacts.phone || '',
        website: profile.contacts.website || '',
        linkedin: profile.contacts.linkedin || '',
        github: profile.contacts.github || '',
        twitter: profile.contacts.twitter || '',
      },
    });
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [name]: value,
      },
    }));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    try {
      await uploadImage.mutateAsync(file);
    } catch (error) {
      console.error('Failed to upload image:', error);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up empty contact fields
    const cleanedContacts: ContactInfo = {};
    Object.entries(formData.contacts).forEach(([key, value]) => {
      if (value && value.trim()) {
        cleanedContacts[key as keyof ContactInfo] = value.trim();
      }
    });

    try {
      await update.mutateAsync({
        ...formData,
        contacts: cleanedContacts,
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Profile Information
      </h3>

      {/* Profile Image */}
      <div className="flex items-center gap-4">
        <div
          className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview || profile?.profileImageUrl ? (
            <img
              src={imagePreview || profile?.profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary text-sm"
            disabled={uploadImage.isPending}
          >
            {uploadImage.isPending ? 'Uploading...' : 'Change Photo'}
          </button>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG or WebP. Max 5MB.</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input"
            placeholder="Your Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="input"
            placeholder="Full Stack Developer"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Professional Summary
        </label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          className="input min-h-[150px]"
          placeholder="A brief professional summary..."
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Supports bullet points. Use <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">-</code> or <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">•</code> at the start of each line for bullet lists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="input"
            placeholder="San Francisco, CA"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location URL (optional)
          </label>
          <input
            type="url"
            name="locationUrl"
            value={formData.locationUrl}
            onChange={handleInputChange}
            className="input"
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
          Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.contacts.email}
              onChange={handleContactChange}
              className="input"
              placeholder="hello@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.contacts.phone}
              onChange={handleContactChange}
              className="input"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.contacts.website}
              onChange={handleContactChange}
              className="input"
              placeholder="https://yoursite.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.contacts.linkedin}
              onChange={handleContactChange}
              className="input"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              GitHub
            </label>
            <input
              type="url"
              name="github"
              value={formData.contacts.github}
              onChange={handleContactChange}
              className="input"
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              X (Twitter)
            </label>
            <input
              type="url"
              name="twitter"
              value={formData.contacts.twitter}
              onChange={handleContactChange}
              className="input"
              placeholder="https://x.com/..."
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={update.isPending}
        >
          {update.isPending ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {update.isSuccess && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">
          Profile saved successfully!
        </div>
      )}
      {update.isError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
          Failed to save profile. Please try again.
        </div>
      )}
    </form>
  );
}
