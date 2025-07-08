import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

interface Tag {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  comments: Comment[];
  tags: Tag[];
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    setLoading(true);  
    api.get(`/articles/${id}`)
      .then((response) => {
        console.log(response.data);
        setArticle(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching article:", error);
        setError('Article not found or failed to fetch.');
        setLoading(false);
      });
  }, [id]);

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (newComment.trim() === '') return; 

    try {
      await api.post(`/articles/${article?.id}/comments/`, {
        content: newComment,
        article: article?.id,  
      });

      setArticle((prev) => (prev ? {
        ...prev,
        comments: [...(prev.comments || []), { id: Date.now(), content: newComment, created_at: new Date().toISOString() }]
      } : prev));
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
      setError('Failed to add comment.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!article) return <p>No article found.</p>;

  return (
    <div className="article-detail p-4">
      <>
        <h1 className="text-3xl mb-2">{article.title}</h1>
        <p className="text-gray-500 mb-4">Posted on {new Date(article.created_at).toLocaleString()}</p>
        <p className="mb-4">{article.content}</p>
        <div className="tags mb-4">
          <span className="font-semibold">Tags:</span>
          {article.tags.map(tag => (
            <Link 
              to={`/blog?tag=${encodeURIComponent(tag.name)}`} 
              key={tag.id} 
              className="inline-block bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2 mb-2 transition-colors hover:bg-blue-600"
              title={`View all articles with tag: ${tag.name}`}
            >
              {tag.name}
            </Link>
          ))}
        </div>
        <Link to="/blog" className="bg-primary text-white py-2 px-4 rounded">Back to Articles</Link>
        <div className="comments mt-8">
          <h2 className="text-2xl mb-4">Comments</h2>
          {article.comments && article.comments.length > 0 ? (
            <ul className="space-y-4">
              {article.comments.map(comment => (
                <li key={comment.id} className="p-4 bg-white rounded shadow">
                  <p className="mb-2">{comment.content}</p>
                  <p className="text-gray-500 text-sm">Posted on {new Date(comment.created_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit" className="mt-2 bg-primary text-white py-2 px-4 rounded">Submit Comment</button>
        </form>
      </>
    </div>
  );
};

export default ArticleDetail;
