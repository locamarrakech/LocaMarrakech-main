export default function handler(request, response) {
  response.status(200).json({
    message: 'API routes are working correctly!',
    timestamp: new Date().toISOString(),
    requestMethod: request.method,
    requestUrl: request.url
  });
}