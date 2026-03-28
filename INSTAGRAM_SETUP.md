# Instagram API Setup Guide

This guide will help you set up Instagram API integration to fetch real Instagram posts on your website.

## Quick Start

Your app now has a backend API endpoint (`/api/instagram`) that handles Instagram data fetching. To enable it:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app and get your **Access Token** and **User ID**
3. Add these to your `.env` file:
```
VITE_INSTAGRAM_ACCESS_TOKEN=your_access_token_here
VITE_INSTAGRAM_USER_ID=your_user_id_here
```
4. Restart your development server

## Option 1: Instagram Graph API (Recommended - Best for Latest Posts)

### Prerequisites
- A Facebook Business Account
- A Facebook App with Instagram Graph API product
- An Instagram Business or Creator Account

### Steps to Get Your Credentials

**1. Create a Facebook App**
- Go to [Facebook Developers](https://developers.facebook.com/)
- Click "My Apps" → "Create App"  
- Select **Business** as the app type
- Fill in your app details

**2. Add Instagram Graph API Product**
- In your app dashboard, find "Add Product"
- Search for and add **Instagram Graph API**

**3. Generate Long-Lived Access Token**
- Go to **Settings → Basic** to get your App ID and App Secret
- Go to **Tools → Graph API Explorer**
- Select your app from the dropdown
- Click "Get User Access Token"
- Request these permissions:
  - `instagram_basic`
  - `pages_read_engagement`  
  - `pages_show_list`
- Generate the token and copy it

**4. Get Your Instagram User ID**
- In the Graph API Explorer, run:
  ```
  GET /me?fields=id
  ```
- Copy the returned ID

### Add to .env File

```
VITE_INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token
VITE_INSTAGRAM_USER_ID=your_user_id
```

### Refresh Token (Every ~60 Days)

Access tokens expire after 60 days. To get a new one:
1. Return to Graph API Explorer
2. Click "Get User Access Token" again
3. Update your environment variables
4. Restart your server

## Option 2: Without API Credentials (Limited/Unreliable)

If you don't configure credentials, the app will attempt to:
- Use Instagram's public web API endpoint
- This may work occasionally but Instagram blocks these requests frequently

**Not recommended for production use.**

## How the Instagram Feed Works

The system has **multiple fallback methods**:

1. **Backend API** (`/api/instagram`) - Calls your configured endpoint  
2. **Instagram Graph API** - Direct call with your credentials
3. **Instagram Public API** - Last resort public endpoint

Each method is tried in order until one succeeds.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Unable to load Instagram posts" | Check `.env` file has correct token and user ID |
| Token error | Get a new long-lived token (expires every 60 days) |
| No posts showing | Verify the Instagram account is public and has posts |
| Still not working | Check browser console for specific error messages |

## Environment Files

Make sure your `.env` files have these variables:

`.env` (local development):
```
VITE_INSTAGRAM_ACCESS_TOKEN=your_token_here
VITE_INSTAGRAM_USER_ID=your_user_id_here
```

`.env.example` (template for others):
```
VITE_INSTAGRAM_ACCESS_TOKEN=
VITE_INSTAGRAM_USER_ID=
```

## Frontend Component Info

The Instagram feed component is located at: `/components/InstagramFeed.tsx`

- Fetches 12 latest posts
- Auto-refreshes every 10 minutes
- Displays posts in a Swiper carousel
- Responsive for mobile/desktop
- Links to individual Instagram posts

## Backend API Info

The backend endpoint is at: `/api/instagram.ts`

**Endpoint:** `GET /api/instagram?username=location_de_voiture_marrakech1`

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": "instagram_post_id",
      "imageUrl": "url_to_image",
      "caption": "post_caption",
      "postUrl": "https://instagram.com/p/...",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Important Notes

1. **Instagram is Restrictive**: Instagram frequently changes their API and may block public access. Using official Graph API credentials is most reliable.

2. **Token Security**: Never commit your tokens to version control. Keep them in `.env` files (which are in `.gitignore`).

3. **Rate Limits**: Instagram Graph API has rate limits. The feed refreshes every 10 minutes to respect these limits.

4. **Public Account**: Your Instagram account must be public for the feed to work.

## Need Help?

1. Check the browser console for specific error messages
2. Verify credentials in the `.env` file
3. Ensure Instagram account is public
4. Try refreshing your access token

      {
        params: {
          fields: 'id,media_type,media_url,permalink,caption,timestamp,thumbnail_url,like_count,comments_count',
          access_token: INSTAGRAM_ACCESS_TOKEN,
          limit: limit
        }
      }
    );

    res.json({ data: response.data.data });
  } catch (error) {
    console.error('Instagram API Error:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
});

module.exports = router;
```

5. **Set Environment Variables**

Create a `.env` file in your project root:

```env
VITE_INSTAGRAM_API_URL=http://localhost:3001/api/instagram/posts
VITE_INSTAGRAM_USERNAME=locamarrakech
```

Or if using a backend proxy, update `services/instagramService.ts`:

```typescript
const INSTAGRAM_API_ENDPOINT = 'https://your-backend.com/api/instagram/posts';
```

## Option 2: Using a Third-Party Service

### RapidAPI Instagram Services

1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to an Instagram API service
3. Get your API key
4. Update the service to use RapidAPI endpoints

### Example with RapidAPI:

```typescript
// In instagramService.ts
export const fetchInstagramPosts = async (limit: number = 12): Promise<InstagramPost[]> => {
  try {
    const response = await fetch('https://instagram-api1.p.rapidapi.com/api/user/posts', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'instagram-api1.p.rapidapi.com'
      }
    });
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
};
```

## Option 3: Serverless Function (Vercel/Netlify)

### Vercel Serverless Function Example:

Create `api/instagram/posts.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
  const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  try {
    const limit = request.query.limit || 12;
    
    const res = await fetch(
      `https://graph.instagram.com/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media?fields=id,media_type,media_url,permalink,caption,timestamp,thumbnail_url,like_count,comments_count&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=${limit}`
    );

    const data = await res.json();
    response.status(200).json({ data: data.data });
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
}
```

Set environment variables in Vercel dashboard:
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`

## Testing

Once set up, the component will automatically fetch and display your Instagram posts. If there's an error, it will show a fallback message with a link to your Instagram profile.

## Troubleshooting

1. **CORS Issues**: Make sure your backend has CORS enabled
2. **Token Expired**: Instagram tokens expire. Set up token refresh logic
3. **Rate Limits**: Instagram has rate limits. Implement caching
4. **No Posts Showing**: Check browser console for errors

## Security Notes

- Never expose your Instagram Access Token in client-side code
- Always use a backend proxy to handle API calls
- Store tokens in environment variables
- Implement token refresh mechanism for long-term use

