export default function handler(request, response){
  const users= [
    {name: 'Sanika', age: '22'},
    {name: 'Siddhi', age:'22'},
    {name: 'Shravani', age: '22'}
  ];

  response.status(200).send(users);
}