export async function load({ request }) {
  const COOKIES = request.headers.get('cookie') || '';
  const cookiesArray = COOKIES.split(';').map((cookie) => cookie.trim());

  const accessTokenCookie = cookiesArray.find((cookie) => cookie.indexOf('access_token') === 0);
  const accessToken = accessTokenCookie ? accessTokenCookie.split('=')[1] : null;

  return {
    accessToken: accessToken || null,
  };
}
