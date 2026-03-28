import React from 'react';
import { useAppContext } from '../context/AppContext';
import BrandCarousel from '../components/BrandCarousel';
import CarCard from '../components/CarCard';
import { useLuxuryCars } from '../hooks/useCars';
import { usePosts } from '../hooks/usePosts';
import LoadingSpinner from '../components/LoadingSpinner';
import InstagramFeed from '../components/InstagramFeed';
import GoogleReviews from '../components/GoogleReviews';
import SEO from '../components/SEO';
import { generateOrganizationSchema, generateWebsiteSchema } from '../utils/schema';

const HomePage: React.FC = () => {
  const { t, language } = useAppContext();
  const { cars: luxuryCars, loading } = useLuxuryCars();
  const { posts, loading: postsLoading } = usePosts(3);
  const featuredCars = luxuryCars.slice(0, 6);
  const isRTL = language === 'ar';

  const CtaBlock: React.FC<{title: string, description: string, icon: React.ReactNode}> = ({title, description, icon}) => (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
      <div className="text-primary mx-auto mb-4 w-16 h-16">{icon}</div>
      <h3 className="text-2xl font-bold font-serif mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  const FeaturePill: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
    <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
      {icon}
      <span>{text}</span>
    </div>
  );

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getExcerpt = (content: string, maxLength: number = 120) => {
    const text = stripHtml(content);
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const homeUrl = typeof window !== 'undefined' ? window.location.href : 'https://locamarrakech.com';
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      <SEO
        title="LocaMarrakech - Location de Voitures de Luxe à Marrakech | Service 24/7"
        description="LocaMarrakech est une entreprise de location de voitures de luxe à Marrakech. Voitures neuves et bien entretenues, prix compétitifs, service 24/7, livraison gratuite à l'aéroport."
        url={homeUrl}
        type="website"
        schema={[organizationSchema, websiteSchema]}
        keywords="location voiture marrakech, voiture de luxe marrakech, location voiture maroc, rental car marrakech, location voiture aéroport marrakech"
      />
      <div>
      {/* Hero Section - FIXED: Added pt-32 for mobile to account for sticky header */}
      <section 
        className="relative min-h-screen bg-cover bg-center flex flex-col justify-center text-white pt-32 pb-20" 
        style={{backgroundImage: `url('https://i.ibb.co/kPMV0P3/pexels-jagmeetsingh-1134857.jpg')`}}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} mb-4`}>
            <div className="h-px w-16 bg-primary"></div>
            <span className="text-sm font-semibold tracking-widest">{t('heroSince')}</span>
            <div className="h-px w-16 bg-primary"></div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-extrabold mb-4">
            {t('heroMainTitlePart1')} <span className="text-primary">{t('heroMainTitlePart2')}</span>
          </h1>
          <p className="text-2xl md:text-3xl font-serif mb-6">{t('heroSubtitle')}</p>
          <p className="text-sm md:text-base mb-10 max-w-4xl mx-auto text-gray-300">{t('heroDescription')}</p>

          <div className={`flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 ${isRTL ? 'sm:space-x-reverse sm:space-x-6' : 'sm:space-x-6'} mb-12`}>
            <a href="/cars" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/cars'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-8 rounded-md text-lg transition-colors duration-300 uppercase">
              {t('heroCtaReserve')}
            </a>
            <a href="tel:+212627573069" className="bg-black/30 backdrop-blur-sm border-2 border-primary hover:bg-primary hover:text-black text-primary font-bold py-3 px-8 rounded-md text-lg transition-all duration-300 uppercase">
              {t('heroCtaCall')}
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <FeaturePill 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              text={t('heroFeature1')}
            />
            <FeaturePill 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.445a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.367-2.445a1 1 0 00-1.175 0l-3.367 2.445c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /></svg>}
              text={t('heroFeature2')}
            />
            <FeaturePill 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 7.568 3.668-7.568 3.668-3.668 7.568-3.668-7.568-7.568-3.668 7.568-3.668z"/></svg>}
              text={t('heroFeature3')}
            />
            <FeaturePill 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 7.568 3.668-7.568 3.668-3.668 7.568-3.668-7.568-7.568-3.668 7.568-3.668z"/></svg>}
              text={t('heroFeature4')}
            />
          </div>
        </div>
      </section>

      {/* Brand Carousel */}
      <BrandCarousel />

      {/* Featured Cars Section */}
      <section className="py-20 bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12">{t('featuredCars')}</h2>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredCars.map(car => <CarCard key={car.id} car={car} />)}
              </div>
              {luxuryCars.length > 6 && (
                <div className="text-center">
                  <a 
                    href="/cars" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      window.history.pushState({}, '', '/cars'); 
                      window.dispatchEvent(new PopStateEvent('popstate')); 
                    }} 
                    className="inline-block bg-gradient-to-b from-[#DAB875] to-[#C09A55] hover:from-[#C09A55] hover:to-[#DAB875] text-black font-bold py-4 px-8 rounded-lg text-lg uppercase transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {t('seeMoreCars') || 'See More Cars'}
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {/* Logo Column */}
            <div className="md:col-span-1 flex justify-center items-center">
              <img src="/logo.png" alt="LocaMarrakech Logo" className="w-80 h-auto" />
            </div>
            {/* Text Column */}
            <div className="md:col-span-2 text-white">
              <h3 className="text-4xl font-serif font-bold text-primary mb-6">{t('aboutSectionTitle')}</h3>
              <p className="text-lg text-gray-300 leading-relaxed">{t('aboutSectionText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <InstagramFeed account="med_faik" numberOfMediaElements={12} />

      {/* Google Reviews Section */}
      <GoogleReviews />
      
      {/* CTA Blocks Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CtaBlock 
                title={t('quickBooking')} 
                description={t('quickBookingDesc')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <CtaBlock 
                title={t('assistance')} 
                description={t('assistanceDesc')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
              />
              <CtaBlock 
                title={t('specialOffers')} 
                description={t('specialOffersDesc')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>}
              />
           </div>
        </div>
      </section>
      
      {/* Blog Section */}
      <section className="py-20 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Blogs</h2>
          </div>
          
          {postsLoading ? (
            <LoadingSpinner />
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => (
                  <article 
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {post.featured_media_url && (
                      <div className="w-full h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img 
                          src={post.featured_media_url} 
                          alt={post.title.rendered}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-primary font-semibold uppercase">{formatDate(post.date)}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold mb-3 text-text-light dark:text-text-dark hover:text-primary transition-colors line-clamp-2">
                        <a href={`/blog/${post.slug}`}>{post.title.rendered}</a>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{getExcerpt(post.content.rendered)}</p>
                      <a 
                        href={`/blog/${post.slug}`}
                        className="inline-block text-primary font-semibold hover:underline"
                      >
                        {t('readMore') || 'Read More'} →
                      </a>
                    </div>
                  </article>
                ))}
              </div>
              <div className="text-center">
                <a 
                  href="/blog" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    window.history.pushState({}, '', '/blog'); 
                    window.dispatchEvent(new PopStateEvent('popstate')); 
                  }} 
                  className="inline-block bg-gradient-to-b from-[#DAB875] to-[#C09A55] hover:from-[#C09A55] hover:to-[#DAB875] text-black font-bold py-4 px-8 rounded-lg text-lg uppercase transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  View All Articles
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t('noBlogPosts') || 'No blog posts available at the moment.'}</p>
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
};

export default HomePage;