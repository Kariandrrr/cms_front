import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI } from '../api/api_posts';
import { Calendar, User, Clock, ArrowLeft, Eye } from 'lucide-react';

export default function PublicPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await postsAPI.getPostBySlug(slug);
      setPost(response.data);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Статья не найдена или недоступна');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#c8a2c8] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8] flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#4a4a4a] mb-4">Статья не найдена</h2>
          <p className="text-[#6b5e6b] mb-6">{error}</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white rounded-xl">
            <ArrowLeft size={18} />
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-[#e8d8e8] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#6b5e6b] hover:text-[#c8a2c8] transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">На главную</span>
          </Link>
          {post.status === 'published' && (
            <div className="flex items-center gap-1 text-[#43a047] text-sm">
              <Eye size={16} />
              <span>Опубликовано</span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12">
          {/* Заголовок */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#4a4a4a] mb-6">
            {post.title}
          </h1>

          {/* Мета-информация */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#6b5e6b] mb-8 pb-8 border-b border-[#e8d8e8]">
            {post.author_username && (
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author_username}</span>
              </div>
            )}
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(post.published_at)}</span>
              </div>
            )}
            {post.created_at && !post.published_at && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Создано: {formatDate(post.created_at)}</span>
              </div>
            )}
          </div>

          {/* Краткое описание */}
          {post.summary && (
            <div className="mb-8 p-4 bg-[#f8f0f8] rounded-xl border border-[#e8d8e8]">
              <p className="text-[#6b5e6b] italic">{post.summary}</p>
            </div>
          )}

          {/* Содержание */}
          <div className="prose prose-lg max-w-none">
            <div className="text-[#4a4a4a] leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-[#e8d8e8]">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#c8a2c8] hover:text-[#b088b0] font-medium"
            >
              <ArrowLeft size={18} />
              Вернуться к списку статей
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}