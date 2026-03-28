// Simple status endpoint to test Vercel serverless functions
export default function handler(req, res) {
  const response = {
    success: true,
    message: 'Vercel API is working!',
    timestamp: new Date().toISOString(),
    method: req.method || 'GET',
    url: req.url || '/api/status',
    environment: process.env.NODE_ENV || 'production'
  };

  // Try Next.js/Vercel style first
  if (res && typeof res.status === 'function') {
    return res.status(200).json(response);
  }

  // Fallback to Node.js style
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
}

