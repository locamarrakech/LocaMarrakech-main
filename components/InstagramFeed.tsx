import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MANUAL_REELS, ManualReel } from '../constants/reels';
import LoadingSpinner from './LoadingSpinner';

declare const Swiper: any;

interface UnifiedPost {
    id: string;
    image: string;
    url: string;
    message?: string;
}

const InstagramFeed: React.FC = () => {
    const { t } = useAppContext();
    const swiperRef = useRef<HTMLDivElement>(null);
    const swiperInstanceRef = useRef<any>(null);
    const [posts, setPosts] = useState<UnifiedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const JUICER_FEED_ID = 'location_de_voiture_marrakech1';

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                
                // Map manual reels to unified format
                const manualPosts: UnifiedPost[] = MANUAL_REELS.map(reel => ({
                    id: reel.id,
                    image: reel.imageUrl,
                    url: reel.videoUrl || `https://instagram.com/p/${reel.id}`,
                    message: reel.caption
                }));

                const response = await fetch(
                    `https://www.juicer.io/api/feeds/${JUICER_FEED_ID}?per=12`,
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    // If Juicer fails, we still have our manual reels
                    setPosts(manualPosts);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                
                if (data.posts && data.posts.items) {
                    const juicerPosts: UnifiedPost[] = data.posts.items.map((item: any) => ({
                        id: item.id.toString(),
                        image: item.image,
                        url: item.external || item.full_url || `https://instagram.com/${JUICER_FEED_ID}`,
                        message: item.message
                    }));

                    // Combine manual reels with Juicer posts, removing duplicates if any
                    const combinedPosts = [...manualPosts];
                    juicerPosts.forEach(jp => {
                        if (!combinedPosts.some(mp => mp.image === jp.image)) {
                            combinedPosts.push(jp);
                        }
                    });

                    setPosts(combinedPosts.slice(0, 12));
                    setError(false);
                } else {
                    setPosts(manualPosts);
                }
            } catch (err) {
                console.error('Error fetching Juicer posts:', err);
                // Fallback to manual reels if error
                const manualPosts: UnifiedPost[] = MANUAL_REELS.map(reel => ({
                    id: reel.id,
                    image: reel.imageUrl,
                    url: reel.videoUrl || `https://instagram.com/p/${reel.id}`,
                    message: reel.caption
                }));
                setPosts(manualPosts);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Initialize Swiper when posts are loaded
    useEffect(() => {
        if (posts.length > 0 && !loading && swiperRef.current && typeof window !== 'undefined' && (window as any).Swiper) {
            // Destroy existing instance if any
            if (swiperInstanceRef.current) {
                swiperInstanceRef.current.destroy();
                swiperInstanceRef.current = null;
            }

            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                if (swiperRef.current) {
                    swiperInstanceRef.current = new (window as any).Swiper(swiperRef.current, {
                        loop: posts.length > 6,
                        spaceBetween: 16,
                        slidesPerView: 2,
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                        breakpoints: {
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 6,
                                spaceBetween: 24,
                            },
                        },
                    });
                }
            }, 100);

            return () => {
                clearTimeout(timer);
                if (swiperInstanceRef.current) {
                    swiperInstanceRef.current.destroy();
                    swiperInstanceRef.current = null;
                }
            };
        }
    }, [posts, loading]);

    if (loading) {
        return (
            <section className="bg-background-light dark:bg-background-dark py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-text-light dark:text-text-dark">
                            {t('instagramTitle')}
                        </h2>
                    </div>
                    <LoadingSpinner />
                </div>
            </section>
        );
    }

    if (error || posts.length === 0) {
        return (
            <section className="bg-background-light dark:bg-background-dark py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-text-light dark:text-text-dark">
                            {t('instagramTitle')}
                        </h2>
                        <a 
                            href={`https://instagram.com/${JUICER_FEED_ID}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary text-lg font-semibold hover:underline"
                        >
                            @{JUICER_FEED_ID}
                        </a>
                    </div>
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <p>Unable to load Instagram posts.</p>
                        <p className="mt-2 text-sm">
                            Follow us on{' '}
                            <a 
                                href={`https://instagram.com/${JUICER_FEED_ID}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary hover:underline"
                            >
                                Instagram
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-background-light dark:bg-background-dark py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-text-light dark:text-text-dark">
                        {t('instagramTitle')}
                    </h2>
                    <a 
                        href={`https://instagram.com/${JUICER_FEED_ID}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary text-lg font-semibold hover:underline inline-flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span>@{JUICER_FEED_ID}</span>
                    </a>
                </div>
                
                {/* Swiper Carousel */}
                <div className="relative">
                    <div ref={swiperRef} className="swiper">
                        <div className="swiper-wrapper">
                            {posts.map((post) => (
                                <div key={post.id} className="swiper-slide">
                                    <a
                                        href={post.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative block w-full aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <img
                                            src={post.image}
                                            alt={post.message || 'Instagram Post'}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                                            <div className="flex items-center space-x-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2">
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    className="h-6 w-6" 
                                                    viewBox="0 0 24 24" 
                                                    fill="currentColor"
                                                >
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                </svg>
                                            </div>
                                            {post.message && (
                                                <p className="text-white text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-3">
                                                    {post.message}
                                                </p>
                                            )}
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Navigation Arrows */}
                    {posts.length > 6 && (
                        <>
                            <div className="swiper-button-prev -left-2 sm:-left-4"></div>
                            <div className="swiper-button-next -right-2 sm:-right-4"></div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;
