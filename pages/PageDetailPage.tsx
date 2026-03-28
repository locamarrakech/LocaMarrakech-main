import React from 'react';
import { usePage } from '../hooks/usePages';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';

interface PageDetailPageProps {
  slug: string;
}

const PageDetailPage: React.FC<PageDetailPageProps> = ({ slug }) => {
  const { page, loading, error } = usePage(slug);
  const { t } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            Page non trouvée
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {error || 'La page demandée n\'existe pas.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
            {page.title.rendered}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="border border-gray-200 dark:border-gray-700 p-8 md:p-12">
              <div 
                className="prose dark:prose-invert prose-lg max-w-none text-gray-600 dark:text-gray-300 leading-relaxed font-light [&>p]:mb-6 [&>h1]:mt-10 [&>h1]:mb-6 [&>h2]:mt-8 [&>h2]:mb-5 [&>h3]:mt-6 [&>h3]:mb-4 [&>h4]:mt-5 [&>h4]:mb-3 [&>h5]:mt-4 [&>h5]:mb-3 [&>h6]:mt-4 [&>h6]:mb-3 [&>ul]:my-6 [&>ol]:my-6 [&>li]:my-2 [&>p:first-child]:mt-0"
                dangerouslySetInnerHTML={{ __html: page.content.rendered }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageDetailPage;

