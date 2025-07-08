import React, { memo, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { ArticleListProps } from '../types/api';

/**
 * Component for displaying a list of articles with search functionality
 */
const ArticleList: React.FC<ArticleListProps> = memo(({ searchTerm = '' }) => {
  const { articles, loading, error } = useArticles();
  const [searchParams] = useSearchParams();
  const tagFilter = searchParams.get('tag');

  // Ensure articles is an array before filtering
  const articlesArray = Array.isArray(articles) ? articles : [];
  
  // Filter articles based on search term and tag filter
  const filteredArticles = useMemo(() => {
    return articlesArray.filter(article => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Tag filter
      const matchesTag = !tagFilter || 
        article.tags.some(tag => tag.name.toLowerCase() === tagFilter.toLowerCase());
      
      return matchesSearch && matchesTag;
    });
  }, [articlesArray, searchTerm, tagFilter]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Loading articles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading articles</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">Articles</h1>
      
      {/* Tag filter indicator */}
      {tagFilter && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              Showing articles tagged with: <strong>{tagFilter}</strong>
            </span>
            <Link 
              to="/blog" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear filter ×
            </Link>
          </div>
        </div>
      )}
      
      {filteredArticles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            {tagFilter 
              ? `No articles found with tag "${tagFilter}"` 
              : searchTerm 
                ? `No articles found matching "${searchTerm}"` 
                : 'No articles available'
            }
          </p>
          {tagFilter && (
            <Link 
              to="/blog" 
              className="mt-2 inline-block text-blue-600 hover:text-blue-800"
            >
              View all articles
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredArticles.map((article) => (
            <li key={article.id} className="bg-white shadow p-4 rounded">
              <h2 className="text-2xl font-bold">{article.title}</h2>
              <p className="text-gray-600 mt-2 line-clamp-3">{article.content}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/blog?tag=${encodeURIComponent(tag.name)}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                    title={`Filter by tag: ${tag.name}`}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Link 
                  to={`/articles/${article.id}`} 
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Read More
                </Link>
                <span className="text-sm text-gray-500">
                  {new Date(article.created_at).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

ArticleList.displayName = 'ArticleList';

export default ArticleList;
