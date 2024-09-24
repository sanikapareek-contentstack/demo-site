import { faker } from '@faker-js/faker';

export default async function handler(req, context) {
  const parsedUrl = new URL(req.url);
  const route = parsedUrl.pathname;
  const envVariable = context.env.TEST_KEY;

  const firstRandom = faker.number.int();
  console.log("🚀 ~ handler ~ firstRandom:", firstRandom)

  if (route === '/test') {
    console.log("Inside /test");
    const res = await fetch(`https://random-data-api.com/api/v2/appliances`);
    let response = await res.json();
    response = {
      ...response,
      time: new Date(),
      envVariableValue: envVariable,
    }
    return new Response(JSON.stringify(response), {
      headers: {
        'X-Message': 'Change response headers'
      }
    })
  }

  return fetch(req)
}
