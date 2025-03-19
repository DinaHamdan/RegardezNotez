export const prerender = false;
import { env } from '$env/dynamic/private';

// this will append the php session ID to the request headers
// of server-side fetchs, USING THE PROVIDED SVELTEKIT FETCH ONLY
/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch, event }) {
  /** @type {Record<string, string>} */
  const potentialHeaders = {};
  Array.from(request.headers.entries()).forEach(([key, value]) => {
    Object.assign(potentialHeaders, { [key]: value });
  });

  const cookieAccessToken = event?.cookies?.get('access_token');

  // If the request's headers don't already contains Authorization && has access token cookie
  // -> Define Authorization header
  const headers =
    potentialHeaders.Authorization || !cookieAccessToken
      ? new Headers(potentialHeaders)
      : new Headers({
          ...potentialHeaders,
          Authorization: `Bearer ${cookieAccessToken}`,
        });

  const url = request.url.replace(`${event.url.origin}/api`, env.NESTAPI_SERVER_URL);
  const requestClone = new Request(url, {
    ...request,
    headers,
    body: request.body,
    credentials: 'include',
    mode: 'cors',
  });

  return fetch(requestClone);
}
