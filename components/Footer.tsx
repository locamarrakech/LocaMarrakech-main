import React from 'react';
import { useAppContext } from '../context/AppContext';
import { usePages } from '../hooks/usePages';

const Footer: React.FC = () => {
    const { t, language } = useAppContext();
    const { pages, loading } = usePages();
    const isRTL = language === 'ar';

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.history.pushState({}, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    // Helper function to find page by slug
    const findPageBySlug = (slug: string) => {
        return pages.find(page => page.slug === slug);
    };

    // Common page slugs to display in footer
    const footerPages = [
        { slug: 'privacy-policy', label: 'Politique de confidentialité', fallback: '/privacy' },
        { slug: 'about', label: 'À propos', fallback: '/about' },
        { slug: 'faq', label: 'FAQ\'s', fallback: '/faqs' },
    ];

    return (
        <div>
            {/* Fixed Floating Buttons - Bottom Right */}
            <div className={`fixed bottom-6 z-50 ${isRTL ? 'left-6 right-auto' : 'right-6 left-auto'}`}>
                <div className="flex justify-center items-center gap-2">
                    <a href="tel:+212627573069" target="_blank" rel="noopener noreferrer">
                        <button className="h-16 w-16 border-[3px] border-[#D8AE5E] shadow-md rounded-full bg-black flex justify-center items-center hover:bg-gray-900 transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-7 text-[#D8AE5E]"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </a>
                    <a href={`https://wa.me/212627573069?text=${encodeURIComponent('Quelles sont les voitures disponibles ?')}`} target="_blank" rel="noopener noreferrer">
                        <button className="py-2 px-5 border-[3px] border-white shadow-md rounded-full bg-[#25D366] text-white font-medium text-lg flex justify-center items-center hover:bg-[#20BA5A] transition-colors">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-9 w-9 mr-0.5"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g
                                    id="SVGRepo_tracerCarrier"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M17.6 6.31999C16.8669 5.58141 15.9943 4.99596 15.033 4.59767C14.0716 4.19938 13.0406 3.99622 12 3.99999C10.6089 4.00135 9.24248 4.36819 8.03771 5.06377C6.83294 5.75935 5.83208 6.75926 5.13534 7.96335C4.4386 9.16745 4.07046 10.5335 4.06776 11.9246C4.06507 13.3158 4.42793 14.6832 5.12 15.89L4 20L8.2 18.9C9.35975 19.5452 10.6629 19.8891 11.99 19.9C14.0997 19.9001 16.124 19.0668 17.6222 17.5816C19.1205 16.0965 19.9715 14.0796 19.99 11.97C19.983 10.9173 19.7682 9.87634 19.3581 8.9068C18.948 7.93725 18.3505 7.05819 17.6 6.31999ZM12 18.53C10.8177 18.5308 9.65701 18.213 8.64 17.61L8.4 17.46L5.91 18.12L6.57 15.69L6.41 15.44C5.55925 14.0667 5.24174 12.429 5.51762 10.8372C5.7935 9.24545 6.64361 7.81015 7.9069 6.80322C9.1702 5.79628 10.7589 5.28765 12.3721 5.37368C13.9853 5.4597 15.511 6.13441 16.66 7.26999C17.916 8.49818 18.635 10.1735 18.66 11.93C18.6442 13.6859 17.9355 15.3645 16.6882 16.6006C15.441 17.8366 13.756 18.5301 12 18.53ZM15.61 13.59C15.41 13.49 14.44 13.01 14.26 12.95C14.08 12.89 13.94 12.85 13.81 13.05C13.6144 13.3181 13.404 13.5751 13.18 13.82C13.07 13.96 12.95 13.97 12.75 13.82C11.6097 13.3694 10.6597 12.5394 10.06 11.47C9.85 11.12 10.26 11.14 10.64 10.39C10.6681 10.3359 10.6827 10.2759 10.6827 10.215C10.6827 10.1541 10.6681 10.0941 10.64 10.04C10.64 9.93999 10.19 8.95999 10.03 8.56999C9.87 8.17999 9.71 8.23999 9.58 8.22999H9.19C9.08895 8.23154 8.9894 8.25465 8.898 8.29776C8.8066 8.34087 8.72546 8.403 8.66 8.47999C8.43562 8.69817 8.26061 8.96191 8.14676 9.25343C8.03291 9.54495 7.98287 9.85749 8 10.17C8.0627 10.9181 8.34443 11.6311 8.81 12.22C9.6622 13.4958 10.8301 14.5293 12.2 15.22C12.9185 15.6394 13.7535 15.8148 14.58 15.72C14.8552 15.6654 15.1159 15.5535 15.345 15.3915C15.5742 15.2296 15.7667 15.0212 15.91 14.78C16.0428 14.4856 16.0846 14.1583 16.03 13.84C15.94 13.74 15.81 13.69 15.61 13.59Z"
                                        fill="#ffffff"
                                    ></path>
                                </g>
                            </svg>
                            Réservation rapide
                        </button>
                    </a>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black mt-16 py-10 px-5 md:px-0">
                <div className="max-w-[1200px] mx-auto">
                    <div className="lg:flex gap-8">
                        {/* Logo and Description */}
                        <div className="lg:w-4/12 mb-12 md:mb-0">
                            <a 
                                href="/" 
                                onClick={(e) => handleLinkClick(e, '/')}
                                className="block"
                            >
                                <img
                                    src="/logo.png"
                                    className="mb-5 w-[180px]"
                                    alt="LocaMarrakech Logo"
                                />
                            </a>
                            <p className="text-zinc-100 font-normal text-md">
                                LocaMarrakech est une entreprise née d'une passion pour les véhicules exotiques et de luxe. 
                                Notre mission est de rendre ces marques et modèles exclusifs accessibles à tous afin que chacun puisse en profiter.
                            </p>
                        </div>

                        {/* Contactez-nous */}
                        <div className="lg:w-4/12 mb-12 md:mb-0">
                            <h4 className="text-zinc-100 font-semibold font-serif text-xl mb-6">
                                Contactez-nous
                            </h4>
                            <ul>
                                <li className="mb-2.5 text-zinc-100 hover:text-zinc-300 transition-all font-normal text-[17px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className={`size-5 relative -top-[1px] inline-block text-[#D8AE5E] ${isRTL ? 'ml-2 mr-0' : 'mr-2 ml-0'}`}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    +212 6 27 57 30 69
                                </li>
                                <li className="mb-2.5 text-zinc-100 hover:text-zinc-300 transition-all font-normal text-[17px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-5 relative -top-[1px] inline-block text-[#D8AE5E] ${isRTL ? 'ml-2 mr-0' : 'mr-2 ml-0'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                        />
                                    </svg>
                                    contact@locamarrakech.com
                                </li>
                                <li className="mb-2.5 text-zinc-100 hover:text-zinc-300 transition-all font-normal text-[17px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-5 relative -top-[1px] inline-block text-[#D8AE5E] ${isRTL ? 'ml-2 mr-0' : 'mr-2 ml-0'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                        />
                                    </svg>
                                    Rue des Vieux Marrakechis, Marrakech 40000
                                </li>
                                <li className="mb-2.5 text-zinc-100 hover:text-zinc-300 transition-all font-normal text-[17px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-5 relative -top-[1px] inline-block text-[#D8AE5E] ${isRTL ? 'ml-2 mr-0' : 'mr-2 ml-0'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                    Hours: 24H/7Days
                                </li>
                            </ul>
                        </div>

                        {/* Liens utiles */}
                        <div className="lg:w-2/12 mb-12 md:mb-0">
                            <h4 className="text-zinc-100 font-semibold font-serif text-xl mb-6">
                                Liens utiles
                            </h4>
                            <ul>
                                {footerPages.map((pageConfig) => {
                                    const page = findPageBySlug(pageConfig.slug);
                                    const href = page ? `/${page.slug}` : pageConfig.fallback;
                                    const label = page ? page.title.rendered : pageConfig.label;
                                    
                                    return (
                                        <li key={pageConfig.slug} className="mb-2.5">
                                            <a
                                                href={href}
                                                onClick={(e) => handleLinkClick(e, href)}
                                                className="text-zinc-100 hover:text-[#D8AE5E] transition-all font-normal text-lg capitalize"
                                            >
                                                {label}
                                            </a>
                                        </li>
                                    );
                                })}
                                <li className="mb-2.5">
                                    <a
                                        href="/blog"
                                        onClick={(e) => handleLinkClick(e, '/blog')}
                                        className="text-zinc-100 hover:text-[#D8AE5E] transition-all font-normal text-lg capitalize"
                                    >
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Social Media */}
                        <div className="lg:w-2/12">
                            <h4 className="text-zinc-100 font-semibold font-serif text-xl mb-6">
                                Social Media
                            </h4>
                            <ul>
                                <li className="mb-2.5">
                                    <a
                                        href="https://www.facebook.com/locamarrakech/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-100 hover:text-[#D8AE5E] transition-all font-normal text-lg capitalize"
                                    >
                                        Facebook
                                    </a>
                                </li>
                                <li className="mb-2.5">
                                    <a
                                        href="https://www.instagram.com/locamarrakech/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-100 hover:text-[#D8AE5E] transition-all font-normal text-lg capitalize"
                                    >
                                        Instagram
                                    </a>
                                </li>
                                <li className="mb-2.5">
                                    <a
                                        href="/privacy"
                                        onClick={(e) => handleLinkClick(e, '/privacy')}
                                        className="text-zinc-100 hover:text-[#D8AE5E] transition-all font-normal text-lg capitalize"
                                    >
                                        Twitter
                                    </a>
                                </li>
                                <li className="mb-2.5">
                                    <a
                                        href="https://api.whatsapp.com/send?phone=212627573069&text=Hello%20%F0%9F%91%8B%20Are%20there%20cars%20available%3F"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-100 hover:text-[#D8AE5E] transition-all font-normal text-lg capitalize"
                                    >
                                        WhatsApp
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;