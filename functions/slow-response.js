export default function handler(request, response) {
  setTimeout(() => {
    response.status(200).send({
      message: 'Response after 35 seconds delay',
      timestamp: new Date().toISOString(),
    });
  }, 35000);
}
