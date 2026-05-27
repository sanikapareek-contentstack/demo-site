export default async function handler(request, response) {
  await new Promise((resolve) => setTimeout(resolve, 35000));
  response.status(200).send({
    message: 'Response after 35 seconds delay',
    timestamp: new Date().toISOString(),
  });
}
