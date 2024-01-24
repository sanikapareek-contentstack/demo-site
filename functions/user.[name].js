export default function helloUser(request, response){
  response.status(200).send(`Hello ${request.query.name}`);
}