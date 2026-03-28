# Vercel API Routes 404 Fix

## Issue
API routes returning 404 errors on Vercel deployment.

## Solution Steps

1. **Verify API files are in `/api` directory** ✅
   - Files are located at: `api/send-email.js`, `api/contact.js`, etc.

2. **Check vercel.json configuration** ✅
   - Configuration includes explicit builds for API files
   - Uses `@vercel/node` for API files
   - Uses `@vercel/static-build` for static files

3. **Verify API file format** ✅
   - Files export default handler function
   - Handler signature: `export default async function handler(req, res)`

4. **Test with simple endpoint**
   - Try accessing `/api/status` or `/api/hello` first
   - These are simpler endpoints to verify routing works

5. **Check Vercel deployment logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Check the build logs for any errors
   - Check Function logs for runtime errors

6. **Verify environment variables**
   - Ensure EMAIL_USER and EMAIL_PASS are set in Vercel
   - Go to Settings → Environment Variables

## Common Issues

- **API files not being deployed**: Check that files are committed to git
- **Build errors**: Check Vercel build logs
- **Runtime errors**: Check Vercel function logs
- **Routing issues**: Verify vercel.json configuration

## Testing

1. First test: `/api/status` - should return JSON
2. Second test: `/api/hello` - should return JSON  
3. Then test: `/api/send-email` - requires POST with body

