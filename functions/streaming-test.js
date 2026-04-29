export default async function handler(request, response) {
  const { speed } = request.query;
  
  // Set speed delays in milliseconds
  const speeds = {
    slow: 300,
    medium: 150,
    fast: 50
  };
  
  // Check if valid speed parameter is provided
  const isValidSpeed = speed && speeds.hasOwnProperty(speed);
  const delay = speeds[speed];
  
  // Sample text
  const text = `Welcome to the streaming API demo! This is a test of word-by-word streaming functionality. 
You can control the speed using the speed parameter. The slow option adds a 300ms delay between each word. 
The medium speed uses 150ms delays for a balanced streaming experience. The fast option streams at 50ms intervals. 
This allows you to see how different streaming speeds affect the user experience. 
Thank you for testing the streaming API endpoint!`;
  
  // Set common headers
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (!isValidSpeed) {
    // Return buffered response when no valid speed parameter
    response.setHeader('Cache-Control', 'public, max-age=300');
    response.status(200).send(text);
    return;
  }
  
  // Set headers for streaming response
  response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Expires', '0');
  response.setHeader('Connection', 'keep-alive');
  
  // Explicitly disable compression for streaming
  response.setHeader('X-Accel-Buffering', 'no');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  
  // For chunked transfer encoding - let Node.js handle this automatically
  // Node.js will set Transfer-Encoding: chunked when we don't set Content-Length
  // Note: Content-Encoding (compression) ≠ Transfer-Encoding (chunking)
  response.removeHeader('Content-Length');
  
  // Start the response and flush headers immediately
  response.writeHead(200);
  response.flushHeaders();
  
  // Split text into words
  const words = text.split(' ');
  
  // Stream words with specified delay
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    response.write(word);
    
    // Add space after word (except for the last word)
    if (i < words.length - 1) {
      response.write(' ');
    }
    
    // Flush the response to ensure it's sent immediately
    if (response.flush) {
      response.flush();
    }
    
    // Add delay before next word (except after last word)
    if (i < words.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  response.end();
}