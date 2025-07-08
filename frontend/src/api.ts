import axios from 'axios';
import { Article, Tag, CreateArticleRequest, UpdateArticleRequest, PaginatedResponse } from './types/api';
import { API_CONFIG } from './config/constants';

const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Axios Request Config:', config);
    return config;
  },
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Axios Response:', response);
    if (response.config?.url?.includes('/tags/')) {
      console.log('Fetched Tags:', response.data);
    }
    return response;
  },
  (error) => {
    console.error('Axios Response Error:', error.response || error);
    
    // Handle common error cases
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Bad request');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// Fetch all tags
export const fetchTags = async (): Promise<Tag[]> => {
  try {
    const response = await api.get<PaginatedResponse<Tag>>('/tags/');
    // Check if response is paginated or direct array
    if (response.data && typeof response.data === 'object' && 'results' in response.data) {
      return response.data.results;
    }
    // Fallback for non-paginated response
    return response.data as unknown as Tag[];
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Fetch all articles
export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await api.get<PaginatedResponse<Article>>('/articles/');
    // Check if response is paginated or direct array
    if (response.data && typeof response.data === 'object' && 'results' in response.data) {
      return response.data.results;
    }
    // Fallback for non-paginated response
    return response.data as unknown as Article[];
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error; 
  }
};

// Create a new article
export const createArticle = async (articleData: CreateArticleRequest): Promise<Article> => {
  try {
    const response = await api.post<Article>('/articles/', articleData);
    return response.data; 
  } catch (error) {
    console.error('Error creating article:', error);
    throw error; 
  }
};

// Update an existing article
export const updateArticle = async (articleId: number, articleData: UpdateArticleRequest): Promise<Article> => {
  try {
    const response = await api.put<Article>(`/articles/${articleId}/`, articleData);
    return response.data; 
  } catch (error) {
    console.error('Error updating article:', error);
    throw error; 
  }
};

// Delete an article
export const deleteArticle = async (articleId: number): Promise<void> => {
  try {
    await api.delete(`/articles/${articleId}/`);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error; 
  }
};

// Export the api instance for other modules
export default api;
