export default function handler(request, response) {
  console.log("🚀 ~ handler ~ request:", request.body)
  const users = [
    { name: 'sanika' },
    { name: 'siddhi' },
    { name: 'shravani' },
        { name: 'Anuja' },
        { name: 'Aryan' },
  ];

  console.log("query params", request.query)

  response.status(200).send({
    body: request.body,
    users,
    query: request.query
  });
}
