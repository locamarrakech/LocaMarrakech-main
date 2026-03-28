// Simple test endpoint to verify Vercel API routes are working
export default async function handler(req, res) {
  try {
    // Handle both Vercel and standard formats
    if (res && typeof res.status === 'function') {
      return res.status(200).json({ 
        success: true, 
        message: 'API is working!',
        method: req.method || 'GET',
        url: req.url || '/api/hello'
      });
    }
    
    // Fallback for Node.js style
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      success: true, 
      message: 'API is working!',
      method: req.method || 'GET',
      url: req.url || '/api/hello'
    }));
  } catch (error) {
    console.error('Error in hello handler:', error);
    if (res && typeof res.status === 'function') {
      return res.status(500).json({ success: false, error: error.message });
    }
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
}

