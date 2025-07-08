import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { fetchTags } from '../api';

interface Tag {
  id?: number; // Optional for new tags
  name: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  tags: Tag[];
}

const SearchAndEdit: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const navigate = useNavigate();

  // Fetch articles and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const articlesResponse = await api.get('/articles/');
        const tagsResponse = await fetchTags();
        setArticles(articlesResponse.data);
        setFilteredArticles(articlesResponse.data);
        setAllTags(tagsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch articles or tags.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArticles(filtered);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/articles/${id}/`); // Delete the article
      setFilteredArticles(prev => prev.filter(article => article.id !== id));
      alert('Article deleted successfully.');
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article.');
    }
  };

  const handleEditSubmit = async (id: number, updatedTitle: string, updatedContent: string, updatedTags: Tag[]) => {
    try {
      const tagsArray = await Promise.all(updatedTags.map(async tag => {
        if (tag.id) {
          // Existing tag
          return { id: tag.id, name: tag.name };
        } else {
          // New tag, create it
          const response = await api.post('/tags/', { name: tag.name });
          return response.data; // Return the newly created tag
        }
      }));

      const articleData = {
        title: updatedTitle,
        content: updatedContent,
        tags: tagsArray,
      };

      await api.put(`/articles/${id}/`, articleData); // Update the article
      alert('Article updated successfully.');
      navigate(`/articles/${id}`); // Redirect to the article page
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update article.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <div className="search-bar mb-4">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search for articles..."
          className="p-2 border rounded w-full"
        />
      </div>

      {filteredArticles.length > 0 ? (
        <ul className="space-y-4">
          {filteredArticles.map(article => (
            <EditableArticle
              key={article.id}
              article={article}
              onEditSubmit={handleEditSubmit}
              onDelete={handleDelete}
              allTags={allTags}
            />
          ))}
        </ul>
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
};

interface EditableArticleProps {
  article: Article;
  onEditSubmit: (id: number, updatedTitle: string, updatedContent: string, updatedTags: Tag[]) => void;
  onDelete: (id: number) => void;
  allTags: Tag[];
}

const EditableArticle: React.FC<EditableArticleProps> = ({ article, onEditSubmit, onDelete, allTags }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(article.title);
  const [updatedContent, setUpdatedContent] = useState(article.content);
  const [tags, setTags] = useState<Tag[]>(article.tags);
  const [newTag, setNewTag] = useState('');

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (tags.length === 0) {
      alert('Please select at least one tag.');
      return;
    }
    onEditSubmit(article.id, updatedTitle, updatedContent, tags); // Submit updated article data
    setIsEditing(false);
  };

  const handleTagAdd = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.some(tag => tag.name === trimmedTag)) {
      setTags([...tags, { name: trimmedTag }]); // Add new tag
      setNewTag(''); // Clear input after adding
    }
  };

  const handleTagRemove = (tagToRemove: Tag) => {
    setTags(tags.filter(tag => tag !== tagToRemove)); // Remove selected tag
  };

  const handleTagSelect = (tagId: number) => {
    const selectedTag = allTags.find(tag => tag.id === tagId);
    if (selectedTag && !tags.some(tag => tag.id === selectedTag.id)) {
      setTags([...tags, selectedTag]); // Attach existing tag if not already selected
    }
  };

  return (
    <li className="p-4 bg-white rounded shadow">
      {isEditing ? (
        <form onSubmit={handleSaveClick}>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="mb-2 p-2 border rounded w-full"
          />
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            className="p-2 border rounded w-full mb-2"
            rows={5}
          />
          <div className="mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a new tag"
              className="p-2 border rounded w-full mb-2"
            />
            <button type="button" onClick={handleTagAdd} className="bg-primary text-white py-2 px-4 rounded mt-2">
              Add Tag
            </button>
          </div>
          <div className="mb-2">
            <label htmlFor="tag-select" className="block mb-2">Select Existing Tag:</label>
            <select id="tag-select" onChange={(e) => handleTagSelect(Number(e.target.value))} className="p-2 border rounded w-full">
              <option value="">-- Select a Tag --</option>
              {allTags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            {tags.map(tag => (
              <span key={tag.id || tag.name} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {tag.name}
                <button type="button" onClick={() => handleTagRemove(tag)} className="ml-2 text-red-500">x</button>
              </span>
            ))}
          </div>
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">Save</button>
        </form>
      ) : (
        <div>
          <h2 className="text-xl font-bold">{article.title}</h2>
          <p>{article.content}</p>
          <div className="mb-2">
            {tags.map(tag => (
              <span key={tag.id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {tag.name}
              </span>
            ))}
          </div>
          <button onClick={handleEditClick} className="bg-yellow-500 text-white py-2 px-4 rounded mr-2">Edit</button>
          <button onClick={() => onDelete(article.id)} className="bg-red-500 text-white py-2 px-4 rounded">Delete</button>
        </div>
      )}
    </li>
  );
};

export default SearchAndEdit;
