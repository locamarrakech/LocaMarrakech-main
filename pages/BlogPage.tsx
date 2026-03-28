import React from 'react';
import { useAppContext } from '../context/AppContext';
import { usePosts } from '../hooks/usePosts';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { generateWebsiteSchema } from '../utils/schema';

const BlogPage: React.FC = () => {
  const { t, language } = useAppContext();
  const { posts, loading, error } = usePosts(20);
  const isRTL = language === 'ar';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    const text = stripHtml(content);
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-8 md:px-16 text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const blogUrl = typeof window !== 'undefined' ? window.location.href : 'https://locamarrakech.com/blog';
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      <SEO
        title="Blog - Actualités et Conseils | LocaMarrakech"
        description={t('blogPageDescription')}
        url={blogUrl}
        type="website"
        schema={websiteSchema}
        keywords="blog location voiture marrakech, conseils location voiture, actualités marrakech, guide location voiture"
      />
      <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block border border-gray-300 dark:border-gray-700 px-4 py-2 mb-8">
              <span className="text-xs font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">Blog</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 dark:text-gray-100 mb-8 tracking-tight leading-tight">
              {t('blog') || 'Blog'}
            </h1>
            
            <div className="w-16 h-px bg-gray-900 dark:bg-gray-100 mx-auto mb-8"></div>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              {t('blogPageSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg font-light">
                {t('noArticlesAvailable')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors hover:border-gray-900 dark:hover:border-gray-300 group"
                >
                  {/* Featured Image */}
                  {post.featured_media_url && (
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-gray-200 dark:border-gray-800">
                      <img
                        src={post.featured_media_url}
                        alt={post.title.rendered}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8">
                    {/* Date */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-widest">
                      {formatDate(post.date)}
                    </p>

                    {/* Title */}
                    <h2 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4 leading-tight line-clamp-2">
                      <a
                        href={`/${post.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState({}, '', `/${post.slug}`);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                        className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                      >
                        {post.title.rendered}
                      </a>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6 font-light leading-relaxed line-clamp-3">
                      {post.excerpt?.rendered 
                        ? stripHtml(post.excerpt.rendered) 
                        : getExcerpt(post.content.rendered)}
                    </p>

                    {/* Read More Link */}
                    <a
                      href={`/${post.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState({}, '', `/${post.slug}`);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }}
                      className="inline-flex items-center text-xs text-gray-900 dark:text-gray-100 uppercase tracking-widest border-b border-gray-900 dark:border-gray-100 pb-1 hover:text-gray-600 dark:hover:text-gray-400 hover:border-gray-600 dark:hover:border-gray-400 transition-colors group/link"
                    >
                      Lire la suite
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-3 w-3 ${isRTL ? 'mr-2 ml-0 group-hover/link:-translate-x-1' : 'ml-2 mr-0 group-hover/link:translate-x-1'} transition-transform`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
};

export default BlogPage;