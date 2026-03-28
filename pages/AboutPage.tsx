import React from 'react';
import { useAppContext } from '../context/AppContext';

const AboutPage: React.FC = () => {
  const { t } = useAppContext();

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block border border-gray-300 dark:border-gray-700 px-4 py-2 mb-8">
              <span className="text-xs font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">{t('about')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 dark:text-gray-100 mb-8 tracking-tight leading-tight">
              {t('aboutTitle')}
            </h1>
            
            <div className="w-16 h-px bg-gray-900 dark:bg-gray-100 mx-auto mb-8"></div>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light max-w-3xl mx-auto">
              {t('aboutText')}
            </p>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="border border-gray-200 dark:border-gray-700 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1400&h=800&fit=crop" 
              alt="LocaMarrakech" 
              className="w-full h-full object-cover aspect-[16/9]"
            />
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">{t('nosValeurs')}</span>
            <div className="w-12 h-px bg-gray-900 dark:bg-gray-100 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              {
                title: t('excellence'),
                description: t('excellenceDesc'),
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )
              },
              {
                title: t('service'),
                description: t('personalizedService'),
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: t('confiance'),
                description: t('confianceDesc'),
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className="border border-gray-200 dark:border-gray-700 p-8 md:p-12 transition-colors hover:border-gray-900 dark:hover:border-gray-300"
              >
                <div className="text-gray-900 dark:text-gray-100 mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wider">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">{t('ourStory')}</span>
              <div className="w-12 h-px bg-gray-900 dark:bg-gray-100 mt-4 mb-8"></div>
              
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                {t('premiumCarRental')}
              </h2>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                <p>
                  {t('aboutParagraph1')}
                </p>
                <p>
                  {t('aboutParagraph2')}
                </p>
                <p>
                  {t('aboutParagraph3')}
                </p>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700">
              <img 
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=1000&fit=crop" 
                alt="Notre équipe" 
                className="w-full h-full object-cover aspect-[4/5]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">{t('whyChooseUs')}</span>
            <div className="w-12 h-px bg-gray-900 dark:bg-gray-100 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: t('flottePremium'),
                description: t('flottePremiumDesc')
              },
              {
                title: t('prixTransparents'),
                description: t('prixTransparentsDesc')
              },
              {
                title: t('assistance'),
                description: t('service247Feature'),
              },
              {
                title: t('fullInsuranceLabel'),
                description: t('fullInsurance'),
              },
              {
                title: t('livraisonGratuite'),
                description: t('livraisonGratuiteDesc')
              },
              {
                title: t('experienceLocale'),
                description: t('experienceLocaleDesc')
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 pb-6 border-b border-gray-200 dark:border-gray-800 last:border-0"
              >
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-gray-900 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="border border-gray-200 dark:border-gray-700 p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-6">
              {t('readyToDiscover')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto font-light">
              {t('readyToDiscoverDesc')}
            </p>
            <a 
              href="/cars" 
              className="inline-block border-2 border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-widest transition-colors hover:bg-white hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100"
            >
              {t('seeOurVehicles')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;