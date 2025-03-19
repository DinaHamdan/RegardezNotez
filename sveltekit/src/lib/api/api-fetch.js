import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { accessToken } from '$lib/store';

export const jsonHeaders = {
  Accept: '*/*',
  'Content-Type': 'application/json',
};

const getApiUrl = () => {
  return browser ? `${window?.location?.origin}/api` : '/api';
};

/**
 * @param {string} method
 * @param {string} route
 * @param {Record<string, any>} [body]
 * @param {Record<string, string>} [headers]
 * @param {(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>} [fetchFn]
 */
export const apiFetch = async (method, route, body, headers = {}, fetchFn) => {
  if (!fetchFn) {
    fetchFn = (...args) => fetch(...args);
  }

  if (browser) {
    // Set the authorization bearer if not already done
    if (!headers?.Authorization?.includes('Bearer') && get(accessToken)) {
      headers = {
        ...jsonHeaders,
        ...headers,
        Authorization: `Bearer ${get(accessToken)}`,
      };
    }
    if (!headers?.['Access-Control-Allow-Origin']) {
      headers = {
        ...jsonHeaders,
        ...headers,
        'Access-Control-Allow-Origin': '*',
      };
    }
  }

  /**
   * @type {RequestInit}
   */
  const fetchParams = {
    credentials: 'include',
    method: method || 'GET',
  };

  if (body) {
    fetchParams.body = JSON.stringify(body);
  }
  if (Object.keys(headers || {}).length) {
    fetchParams.headers = headers;
  }

  const apiUrl = getApiUrl();
  // Remove start & end /
  const routeSanitized = `/${route}`.split('/').filter(Boolean).join('/');

  const response = await fetchFn(`${apiUrl}/${routeSanitized}`, fetchParams);

  if (!response) {
    throw Error(`No Response fetching ${route}`);
  }

  if (response.ok) {
    return {
      status: response.status,
      data: await response.json(),
    };
  }

  return Promise.reject({
    status: response.status,
    data: await response.json(),
  });
};
