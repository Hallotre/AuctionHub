import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsService } from '../../services/listingsService';
import { useAuth } from '../../hooks/useAuth';
import type { CreateListingData, Media } from '../../types/api';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    endsAt: '',
    tags: [] as string[],
    media: [] as Media[]
  });

  const [newTag, setNewTag] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaAlt, setNewMediaAlt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.endsAt) {
      setError('End date is required');
      return;
    }

    const endDate = new Date(formData.endsAt);
    const now = new Date();
    if (endDate <= now) {
      setError('End date must be in the future');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const listingData: CreateListingData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        endsAt: formData.endsAt,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        media: formData.media.length > 0 ? formData.media : undefined
      };

      const response = await listingsService.createListing(listingData);
      navigate(`/listing/${response.data.id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response !== null &&
        'data' in err.response && typeof err.response.data === 'object' && err.response.data !== null &&
        'errors' in err.response.data && Array.isArray(err.response.data.errors) &&
        err.response.data.errors.length > 0 && typeof err.response.data.errors[0] === 'object' &&
        err.response.data.errors[0] !== null && 'message' in err.response.data.errors[0]
        ? err.response.data.errors[0].message
        : 'Failed to create listing. Please try again.';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addMedia = () => {
    const url = newMediaUrl.trim();
    const alt = newMediaAlt.trim();
    
    if (url) {
      const newMedia: Media = {
        url,
        alt: alt || formData.title || 'Listing image'
      };
      
      setFormData({
        ...formData,
        media: [...formData.media, newMedia]
      });
      setNewMediaUrl('');
      setNewMediaAlt('');
    }
  };

  const removeMedia = (index: number) => {
    setFormData({
      ...formData,
      media: formData.media.filter((_, i) => i !== index)
    });
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // At least 1 minute in the future
    return now.toISOString().slice(0, 16);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You must be logged in to create a listing.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h1>
        <p className="text-gray-600">Create an auction listing for your item</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
          </label>
          <input
                id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter a descriptive title for your item"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Describe your item in detail..."
          />
        </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories & Tags</h2>
          
          <div className="space-y-4">
        <div>
              <label htmlFor="newTag" className="block text-sm font-medium text-gray-700 mb-1">
                Add Tags
          </label>
            <div className="flex gap-2">
                <input
                  id="newTag"
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Type a tag and press Enter"
                />
              <button
                type="button"
                onClick={addTag}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Add
              </button>
              </div>
            </div>
            
            {formData.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Current tags:</p>
              <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                  <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                        className="hover:text-emerald-600 flex-shrink-0"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
          
          <div className="space-y-4">
        <div>
              <label htmlFor="newMediaUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Add Image URL
          </label>
              <div className="flex gap-2">
              <input
                  id="newMediaUrl"
                type="url"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="https://example.com/image.jpg"
              />
            <button
              type="button"
              onClick={addMedia}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
            >
              Add Image
            </button>
              </div>
            </div>
            
            {formData.media.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Current images:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.media.map((item, index) => (
                    <div key={index} className="relative group">
                    <img
                        src={item.url}
                        alt={item.alt || 'Listing image'}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Auction Settings */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Auction Settings</h2>
          
          <div>
            <label htmlFor="endsAt" className="block text-sm font-medium text-gray-700 mb-1">
              Auction End Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              id="endsAt"
              type="datetime-local"
              value={formData.endsAt}
              onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
              min={getMinDateTime()}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Select when you want this auction to end
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link
            to="/"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Listing'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListingPage; 