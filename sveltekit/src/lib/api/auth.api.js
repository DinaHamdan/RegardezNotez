import { apiFetch } from './api-fetch';

export default {
  /**
   * @param {(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>} [fetchFn]
   */
  getCurrentUser: (fetchFn) => apiFetch('GET', 'auth/me', undefined, undefined, fetchFn),

  /**
   * @param {{ email: string; password: string; firstName?: string; lastName?: string; }} body
   * @param {(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>} [fetchFn]
   */
  signUp: (body, fetchFn) => apiFetch('POST', 'auth/sign-up', body, undefined, fetchFn),

  /**
   * @param {{ email: string; password: string; }} body
   * @param {(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>} [fetchFn]
   */
  signIn: (body, fetchFn) => apiFetch('POST', 'auth/sign-in', body, undefined, fetchFn),

  /**
   * @param {string | null} [accessToken]
   * @param {(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>} [fetchFn]
   */
  signOut: (accessToken, fetchFn) => {
    const queryParams = [accessToken ? `access_token=${accessToken}` : '']
      .filter(Boolean)
      .join('&');

    const queryParamsUrl = queryParams.length ? `?${queryParams}` : '';

    return apiFetch('GET', `auth/sign-out${queryParamsUrl}`, undefined, undefined, fetchFn);
  },
};
