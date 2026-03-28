import type { VercelRequest, VercelResponse } from '@vercel/node';

// Static fallback posts for testing/when API isn't available
const FALLBACK_POSTS = [
  {
    id: 'fallback-1',
    imageUrl: 'https://via.placeholder.com/500x500?text=LocaMarrakech+Car+Rental',
    caption: 'Luxury Car Rental in Marrakech',
    postUrl: 'https://instagram.com/location_de_voiture_marrakech1',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'fallback-2',
    imageUrl: 'https://via.placeholder.com/500x500?text=Premium+Vehicles',
    caption: 'Premium Vehicle Collection',
    postUrl: 'https://instagram.com/location_de_voiture_marrakech1',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'fallback-3',
    imageUrl: 'https://via.placeholder.com/500x500?text=Professional+Service',
    caption: '24/7 Professional Service',
    postUrl: 'https://instagram.com/location_de_voiture_marrakech1',
    timestamp: new Date().toISOString(),
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const username = req.query.username as string || 'location_de_voiture_marrakech1';
    const accessToken = process.env.VITE_INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.VITE_INSTAGRAM_USER_ID;

    // If we have proper API credentials, use Instagram Graph API
    if (accessToken && userId) {
      try {
        const response = await fetch(
          `https://graph.instagram.com/v18.0/${userId}/media?fields=id,media_type,media_url,permalink,caption,timestamp&access_token=${accessToken}&limit=12`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            const posts = data.data.map((item: any, index: number) => ({
              id: item.id || `post-${index}`,
              imageUrl: item.media_url || '',
              caption: item.caption || '',
              postUrl: item.permalink || `https://instagram.com/${username}`,
              timestamp: item.timestamp || new Date().toISOString(),
            }));

            // Sort by timestamp (newest first)
            posts.sort((a: any, b: any) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            return res.status(200).json({ success: true, posts });
          }
        }
      } catch (apiError) {
        console.error('Instagram Graph API error:', apiError);
      }
    }

    // Fallback 1: Try using Instagram's public API endpoint
    try {
      const response = await fetch(
        `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const user = data?.data?.user;

        if (user?.edge_owner_to_timeline_media?.edges && user.edge_owner_to_timeline_media.edges.length > 0) {
          const posts = user.edge_owner_to_timeline_media.edges
            .slice(0, 12)
            .map((edge: any, index: number) => {
              const node = edge.node;
              return {
                id: node.id || `post-${index}`,
                imageUrl: node.display_url || node.thumbnail_src || '',
                caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
                postUrl: `https://instagram.com/p/${node.shortcode}/`,
                timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
              };
            })
            .sort((a: any, b: any) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

          return res.status(200).json({ success: true, posts });
        }
      }
    } catch (err) {
      console.warn('Instagram public API endpoint failed:', err);
    }

    // Fallback 2: Try Instagram embed oEmbed endpoint (without authentication)
    try {
      const embedUrl = `https://www.instagram.com/${username}/`;
      const oEmbedUrl = `https://graph.instagram.com/instagram_oembed?url=${encodeURIComponent(embedUrl)}&fields=thumbnail_url,media_type`;
      
      const response = await fetch(oEmbedUrl);
      if (response.ok) {
        const data = await response.json();
        // oEmbed gives us limited data, but we can at least confirm the account exists
        if (data) {
          console.log('Instagram oEmbed available for:', username);
        }
      }
    } catch (err) {
      console.warn('Instagram oEmbed endpoint failed:', err);
    }

    // If all API methods fail, return fallback posts with a note
    console.warn('All Instagram API methods failed. Returning fallback posts. To enable real posts, please set VITE_INSTAGRAM_ACCESS_TOKEN and VITE_INSTAGRAM_USER_ID in your environment variables.');
    
    return res.status(200).json({ 
      success: true, 
      posts: FALLBACK_POSTS,
      isFallback: true,
      message: 'Using fallback posts. To display real Instagram posts, configure your API credentials in .env'
    });
  } catch (error) {
    console.error('Instagram API handler error:', error);
    
    // Even on error, return fallback posts instead of failing
    return res.status(200).json({ 
      success: true, 
      posts: FALLBACK_POSTS,
      isFallback: true,
      error: 'Failed to fetch Instagram posts. Showing fallback content.'
    });
  }
}

