// API Response Types
export interface Tag {
  id: number;
  name: string;
  created_at: string;
}

export interface Comment {
  id: number;
  article: number;
  content: string;
  author_name: string;
  created_at: string;
  is_approved: boolean;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  tags: Tag[];
  comments: Comment[];
  created_at: string;
  updated_at: string;
  is_published: boolean;
  is_recent: boolean;
  comments_count?: number;
}

// Pagination Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API Request Types
export interface CreateArticleRequest {
  title: string;
  content: string;
  tags: { name: string }[];
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  id?: number;
}

export interface CreateCommentRequest {
  content: string;
}

export interface CreateTagRequest {
  name: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  details?: Record<string, string[]>;
}

// Component Props Types
export interface ArticleListProps {
  searchTerm?: string;
}

export interface ArticleDetailProps {
  articleId: string;
}

export interface ArticleFormProps {
  article?: Article;
  onSubmit: (article: CreateArticleRequest | UpdateArticleRequest) => Promise<void>;
  onCancel?: () => void;
}

// Hook Return Types
export interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  fetchArticles: () => Promise<void>;
  createArticle: (data: CreateArticleRequest) => Promise<Article>;
  updateArticle: (id: number, data: UpdateArticleRequest) => Promise<Article>;
  deleteArticle: (id: number) => Promise<void>;
}

export interface UseTagsReturn {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
}
