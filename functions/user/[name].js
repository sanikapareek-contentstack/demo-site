export default function handler(request, response){
  response.status(200).send(`Hello ${request.query.name}!`);
}