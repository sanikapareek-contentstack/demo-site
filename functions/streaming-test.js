export default async function handler(request, response) {
  const { speed = 'medium' } = request.query;
  
  // Set speed delays in milliseconds
  const speeds = {
    slow: 300,
    medium: 150,
    fast: 50
  };
  
  const delay = speeds[speed] || speeds.medium;
  
  // Set headers for streaming response
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.setHeader('Transfer-Encoding', 'chunked');
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Connection', 'keep-alive');
  
  // Sample text to stream word by word
  const text = `Welcome to the streaming API demo! This is a test of word-by-word streaming functionality. 
You can control the speed using the speed parameter. The slow option adds a 300ms delay between each word. 
The medium speed uses 150ms delays for a balanced streaming experience. The fast option streams at 50ms intervals. 
This allows you to see how different streaming speeds affect the user experience. 
Thank you for testing the streaming API endpoint!`;
  
  // Split text into words
  const words = text.split(' ');
  
  // Stream words with specified delay
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    response.write(word);
    
    // Add space after word (except for the last word)
    if (i < words.length - 1) {
      response.write(' ');
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  response.end();
}