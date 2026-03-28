// Instagram API Service
// Using public Instagram API services to fetch posts

const INSTAGRAM_USERNAME = 'location_de_voiture_marrakech1';
const INSTAGRAM_API_ENDPOINT = '/api/instagram/posts';

export interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  thumbnail_url?: string;
}

export interface InstagramResponse {
  data: InstagramPost[];
  error?: string;
}

/**
 * Fetch Instagram posts using CORS proxy
 * This fetches from Instagram's public profile using a CORS proxy
 */
export const fetchInstagramPosts = async (limit: number = 12): Promise<InstagramPost[]> => {
  try {
    // First, try to use backend API if available
    if (INSTAGRAM_API_ENDPOINT && INSTAGRAM_API_ENDPOINT !== '/api/instagram/posts') {
      try {
        const response = await fetch(`${INSTAGRAM_API_ENDPOINT}?limit=${limit}`);
        
        if (response.ok) {
          const result: InstagramResponse = await response.json();
          if (result.data && result.data.length > 0) {
            return result.data;
          }
        }
      } catch (e) {
        console.log('Backend API not available, trying public API...');
      }
    }

    // Use CORS proxy to fetch Instagram public profile
    // Using allorigins.win as a free CORS proxy
    const instagramUrl = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(instagramUrl)}`;
    
    try {
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Instagram profile');
      }

      const proxyData = await response.json();
      const htmlContent = proxyData.contents;

      // Parse Instagram's embedded JSON data from the HTML
      // Instagram embeds user data in a <script> tag
      const scriptMatch = htmlContent.match(/<script type="application\/json" id="__NEXT_DATA__">(.*?)<\/script>/);
      
      if (scriptMatch) {
        try {
          const jsonData = JSON.parse(scriptMatch[1]);
          const userData = jsonData?.props?.pageProps?.graphql?.user;
          
          if (userData?.edge_owner_to_timeline_media?.edges) {
            const edges = userData.edge_owner_to_timeline_media.edges.slice(0, limit);
            return edges.map((edge: any, index: number) => {
              const node = edge.node;
              return {
                id: node.id || `post-${index}`,
                media_type: node.is_video ? 'VIDEO' : (node.edge_sidecar_to_children ? 'CAROUSEL_ALBUM' : 'IMAGE'),
                media_url: node.display_url || node.thumbnail_src || '',
                permalink: `https://www.instagram.com/p/${node.shortcode}/`,
                caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
                timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
                like_count: node.edge_liked_by?.count || 0,
                comments_count: node.edge_media_to_comment?.count || 0,
                thumbnail_url: node.thumbnail_src || node.display_url || '',
              };
            });
          }
        } catch (parseError) {
          console.error('Error parsing Instagram JSON:', parseError);
        }
      }

      // Alternative: Try to extract from window._sharedData
      const sharedDataMatch = htmlContent.match(/window\._sharedData\s*=\s*({.+?});/);
      if (sharedDataMatch) {
        try {
          const sharedData = JSON.parse(sharedDataMatch[1]);
          const userData = sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user;
          
          if (userData?.edge_owner_to_timeline_media?.edges) {
            const edges = userData.edge_owner_to_timeline_media.edges.slice(0, limit);
            return edges.map((edge: any, index: number) => {
              const node = edge.node;
              return {
                id: node.id || `post-${index}`,
                media_type: node.is_video ? 'VIDEO' : (node.edge_sidecar_to_children ? 'CAROUSEL_ALBUM' : 'IMAGE'),
                media_url: node.display_url || node.thumbnail_src || '',
                permalink: `https://www.instagram.com/p/${node.shortcode}/`,
                caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
                timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
                like_count: node.edge_liked_by?.count || 0,
                comments_count: node.edge_media_to_comment?.count || 0,
                thumbnail_url: node.thumbnail_src || node.display_url || '',
              };
            });
          }
        } catch (parseError) {
          console.error('Error parsing _sharedData:', parseError);
        }
      }

    } catch (e) {
      console.error('Error fetching via CORS proxy:', e);
    }

    // If all methods fail, return empty array
    console.warn('Unable to fetch Instagram posts. Instagram may have changed their structure or CORS proxy is unavailable.');
    return [];
    
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
};

/**
 * Alternative: Fetch from Instagram Basic Display API
 * This requires a different endpoint structure
 */
export const fetchInstagramPostsBasic = async (): Promise<InstagramPost[]> => {
  try {
    const response = await fetch(`${INSTAGRAM_API_ENDPOINT}/basic`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram posts: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
};

/**
 * Fallback: If you want to use Instagram's public RSS feed (limited functionality)
 * Note: Instagram doesn't officially support RSS, but some third-party services provide it
 */
export const fetchInstagramRSS = async (): Promise<InstagramPost[]> => {
  try {
    // Example: Using a third-party RSS service
    // Replace with your actual RSS feed URL if available
    const rssUrl = `https://rss.app/feeds/${INSTAGRAM_USERNAME}.xml`;
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      throw new Error('RSS feed not available');
    }

    // Parse RSS XML (you'd need an RSS parser library)
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching Instagram RSS:', error);
    return [];
  }
};

