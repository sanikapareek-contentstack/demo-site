export default async function handler(request, response) {
  const { speed, "long-running": longRunning } = request.query;

  if (longRunning === 'true') {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', '0');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('X-Accel-Buffering', 'no');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.removeHeader('Content-Length');

    response.writeHead(200);
    response.flushHeaders();

    const totalDurationMs = 20 * 60 * 1000;
    const chunkIntervalMs = 50;
    const startedAt = Date.now();
    let chunkIndex = 0;
    let aborted = false;

    const onClose = () => { aborted = true; };
    request.on('close', onClose);
    response.on('close', onClose);

    while (!aborted) {
      const elapsedMs = Date.now() - startedAt;
      if (elapsedMs >= totalDurationMs) break;

      response.write(`chunk=${chunkIndex} elapsed_ms=${elapsedMs}\n`);
      if (response.flush) response.flush();
      chunkIndex++;

      await new Promise(resolve => setTimeout(resolve, chunkIntervalMs));
    }

    request.off('close', onClose);
    response.off('close', onClose);

    if (!aborted) {
      response.end(`done total_chunks=${chunkIndex} elapsed_ms=${Date.now() - startedAt}\n`);
    }
    return;
  }

  // Set speed delays in milliseconds based on cloud provider
  const cloudProvider = process.env.CLOUD_PROVIDER || 'aws';
  
  // Platform-specific fast streaming thresholds
  const fastThresholds = {
    azure: 75,   // Azure Functions minimum threshold
    gcp: 100,    // GCP Cloud Functions minimum threshold  
    aws: 50      // AWS Lambda works with faster streaming
  };
  
  const fastSpeed = fastThresholds[cloudProvider.toLowerCase()] || 50; // Default to AWS
  
  const speeds = {
    slow: 300,
    medium: 150,
    fast: fastSpeed,
    delay: 150,
  };
  
  // Check if valid speed parameter is provided
  const isValidSpeed = speed && speeds.hasOwnProperty(speed);
  const delay = speeds[speed];
  
  // Sample text with dynamic fast speed description
  const text = `Welcome to the streaming API demo! This is a test of word-by-word streaming functionality. 
You can control the speed using the speed parameter. The slow option adds a 300ms delay between each word. 
The medium speed uses 150ms delays for a balanced streaming experience. The fast option streams at ${fastSpeed}ms intervals with 3-word chunks (optimized for ${cloudProvider.toUpperCase()} platform buffering). 
This allows you to see how different streaming speeds and chunking strategies affect the user experience. 
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
  
  if (speed === 'delay') {
    await new Promise((resolve) => setTimeout(resolve, 35000));
  }

  response.writeHead(200);
  response.flushHeaders();
  
  // Split text into words
  const words = text.split(' ');
  
  // Use larger chunks for fast mode to overcome platform buffering
  // Fast mode sends 3 words per chunk to cross cloud platform minimum buffering thresholds
  // Slow/medium modes send 1 word per chunk for granular streaming
  const wordsPerChunk = speed === 'fast' ? 3 : 1;
  
  // Stream words/chunks with specified delay
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    // Create chunk with multiple words for fast mode, single word for others
    const chunk = words.slice(i, i + wordsPerChunk).join(' ');
    response.write(chunk);
    
    // Add space after chunk (except for the last chunk)
    const isLastChunk = i + wordsPerChunk >= words.length;
    if (!isLastChunk) {
      response.write(' ');
    }
    
    // Flush the response to ensure it's sent immediately
    if (response.flush) {
      response.flush();
    }
    
    // Add delay before next chunk (except after last chunk)
    if (!isLastChunk) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  response.end();
}