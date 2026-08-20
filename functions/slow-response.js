export default async function handler(request, response) {
  await new Promise((resolve) => setTimeout(resolve, 100000));
  response.setHeader('Cache-Control', 'no-cache, no-store, s-maxage=0');
  response.status(200).json({
    message: 'Response after 35 seconds delay',
    timestamp: new Date().toISOString(),
  });
}
