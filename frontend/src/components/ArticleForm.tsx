import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTags } from '../hooks/useTags';
import { useArticles } from '../hooks/useArticles';
import { Tag, CreateArticleRequest } from '../types/api';

interface FormErrors {
  title?: string;
  content?: string;
  tags?: string;
}

/**
 * Form component for creating new articles
 */
const ArticleForm: React.FC = memo(() => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { tags: allTags, loading: tagsLoading } = useTags();
  const { createArticle } = useArticles();

  const handleTagAdd = useCallback(() => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !selectedTags.some(tag => tag.name.toLowerCase() === trimmedTag.toLowerCase())) {
      // Create a temporary tag object with all required properties
      const newTagObj: Tag = { 
        id: Date.now(), // Temporary ID for new tag
        name: trimmedTag,
        created_at: new Date().toISOString() // Add the required created_at field
      };
      setSelectedTags(prev => [...prev, newTagObj]);
      setNewTag('');
    }
  }, [newTag, selectedTags]);

  const handleTagRemove = useCallback((tagToRemove: Tag) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagToRemove.id));
  }, []);

  const handleTagSelect = useCallback((tagId: number) => {
    const selectedTag = allTags.find(tag => tag.id === tagId);
    if (selectedTag && !selectedTags.some(tag => tag.id === selectedTag.id)) {
      setSelectedTags(prev => [...prev, selectedTag]);
    }
  }, [allTags, selectedTags]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long.';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required.';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long.';
    }
    
    if (selectedTags.length === 0) {
      newErrors.tags = 'At least one tag is required.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, content, selectedTags]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Only send the name property for tags as required by the backend
      const articleData: CreateArticleRequest = {
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags.map(tag => ({ name: tag.name })),
      };
      
      console.log('Submitting article data:', JSON.stringify(articleData, null, 2));
      
      await createArticle(articleData);
      
      // Show success message and navigate
      alert('Article created successfully.');
      navigate('/blog');
    } catch (error: unknown) {
      console.error('Error creating article:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create article. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, selectedTags, validateForm, createArticle, navigate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  }, [handleTagAdd]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4">Create a New Article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            className={`p-2 border rounded w-full ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isSubmitting}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Content Input */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter article content"
            className={`p-2 border rounded w-full ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
            rows={6}
            disabled={isSubmitting}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        {/* Tags Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags *
          </label>
          
          {/* Add new tag */}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new tag"
              className="p-2 border border-gray-300 rounded flex-1"
              disabled={isSubmitting}
            />
            <button 
              type="button" 
              onClick={handleTagAdd} 
              className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark disabled:opacity-50"
              disabled={isSubmitting || !newTag.trim()}
            >
              Add Tag
            </button>
          </div>

          {/* Select existing tags */}
          {!tagsLoading && allTags.length > 0 && (
            <div className="mb-2">
              <select
                onChange={(e) => handleTagSelect(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded w-full"
                disabled={isSubmitting}
                defaultValue=""
              >
                <option value="" disabled>Select an existing tag</option>
                {allTags
                  .filter(tag => !selectedTags.some(selected => selected.id === tag.id))
                  .map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Selected tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Article'}
        </button>
      </form>
    </div>
  );
});

ArticleForm.displayName = 'ArticleForm';

export default ArticleForm;
