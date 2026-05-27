export default async function handler(request, response) {
  await new Promise((resolve) => setTimeout(resolve, 35000));
  response
    .status(200)
    .set('Cache-Control', 'no-cache, no-store, s-maxage=0')
    .send({
      message: 'Response after 35 seconds delay',
      timestamp: new Date().toISOString(),
    });
}
