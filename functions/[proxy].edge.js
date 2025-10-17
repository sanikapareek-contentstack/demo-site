/**
 * Edge function handler
 * @global default Default export that is the handler for all edge function calls.
 * @param {Request} request The incoming request object.
 * @returns {Response|Promise<Response>} returns a Response object for redirects or handles the request for normal processing.
 */
export default function handler(request) {
    
    const parsedUrl = new URL(request.url);

    // eslint-disable-next-line no-console
    console.log(`Received request for ${parsedUrl.host}`);

    // Define domain mapping for redirects
    const domainRedirects = {
        'onestarrewards.com': 'www.cherokeecasino.com/rewards-program'
    };

    // Get the hostname without port for matching
    const hostname = parsedUrl.hostname;
    const redirectTarget = domainRedirects[hostname];
    
    if (redirectTarget) {
        // eslint-disable-next-line no-console
        console.log(`Redirecting ${parsedUrl.host} to ${redirectTarget}`);
        
        // Build the new URL with the redirect target
        // Handle cases where redirect target includes a path
        const redirectUrl = redirectTarget.startsWith('http') 
            ? redirectTarget 
            : `${parsedUrl.protocol}//${redirectTarget}`;
        
        // Return 302 redirect response
        return new Response(null, {
            status: 302,
            headers: {
                'Location': redirectUrl
            }
        });
    }

    return fetch(request);

}
