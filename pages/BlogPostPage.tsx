import React from 'react';
import { usePost } from '../hooks/usePosts';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import SEO from '../components/SEO';
import { generateBlogPostSchema } from '../utils/schema';

interface BlogPostPageProps {
  slug: string;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug }) => {
  const { post, loading, error } = usePost(slug);
  const { t } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            Article non trouvé
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {error || 'L\'article demandé n\'existe pas.'}
          </p>
        </div>
      </div>
    );
  }

  // Generate SEO data
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };
  
  const postDescription = post.excerpt?.rendered 
    ? stripHtml(post.excerpt.rendered)
    : stripHtml(post.content.rendered).substring(0, 160);
  
  const postUrl = typeof window !== 'undefined' ? window.location.href : `https://locamarrakech.com/${post.slug}`;
  const postImage = post.featured_media_url || '/logo.png';
  const postSchema = generateBlogPostSchema(post);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <SEO
        title={`${post.title.rendered} | Blog LocaMarrakech`}
        description={postDescription}
        image={postImage}
        url={postUrl}
        type="article"
        schema={postSchema}
        publishedTime={post.date}
        modifiedTime={post.modified}
        author="LocaMarrakech"
        keywords="blog location voiture, conseils marrakech, actualités"
      />
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-400 text-sm mb-4">
                {formatDate(post.date)}
              </p>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
                {post.title.rendered}
              </h1>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featured_media_url && (
          <section className="py-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <img
                  src={post.featured_media_url}
                  alt={post.title.rendered}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="border border-gray-200 dark:border-gray-700 p-8 md:p-12">
                <div 
                  className="prose dark:prose-invert prose-lg max-w-none text-gray-600 dark:text-gray-300 leading-relaxed font-light [&>p]:mb-6 [&>h1]:mt-10 [&>h1]:mb-6 [&>h2]:mt-8 [&>h2]:mb-5 [&>h3]:mt-6 [&>h3]:mb-4 [&>h4]:mt-5 [&>h4]:mb-3 [&>h5]:mt-4 [&>h5]:mb-3 [&>h6]:mt-4 [&>h6]:mb-3 [&>ul]:my-6 [&>ol]:my-6 [&>li]:my-2 [&>p:first-child]:mt-0"
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPostPage;

