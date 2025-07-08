import { useState, useEffect, useCallback } from 'react';
import { Article, CreateArticleRequest, UpdateArticleRequest, UseArticlesReturn } from '../types/api';
import { fetchArticles as apiFetchArticles, createArticle as apiCreateArticle, updateArticle as apiUpdateArticle, deleteArticle as apiDeleteArticle } from '../api';

/**
 * Custom hook for managing articles data and operations
 */
export const useArticles = (): UseArticlesReturn => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchArticles();
      setArticles(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch articles';
      setError(errorMessage);
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createArticle = useCallback(async (data: CreateArticleRequest): Promise<Article> => {
    setError(null);
    try {
      const newArticle = await apiCreateArticle(data);
      setArticles(prev => [newArticle, ...prev]);
      return newArticle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create article';
      setError(errorMessage);
      console.error('Error creating article:', err);
      throw err;
    }
  }, []);

  const updateArticle = useCallback(async (id: number, data: UpdateArticleRequest): Promise<Article> => {
    setError(null);
    try {
      const updatedArticle = await apiUpdateArticle(id, data);
      setArticles(prev => prev.map(article => 
        article.id === id ? updatedArticle : article
      ));
      return updatedArticle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update article';
      setError(errorMessage);
      console.error('Error updating article:', err);
      throw err;
    }
  }, []);

  const deleteArticle = useCallback(async (id: number): Promise<void> => {
    setError(null);
    try {
      await apiDeleteArticle(id);
      setArticles(prev => prev.filter(article => article.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete article';
      setError(errorMessage);
      console.error('Error deleting article:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
  };
};
