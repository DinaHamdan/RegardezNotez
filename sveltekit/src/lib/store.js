import { writable } from 'svelte/store';

/**
 * @type {import('svelte/store').Writable<string | null>}
 */
export const accessToken = writable(null);

/**
 * @type {import('svelte/store').Writable<any | null>}
 */
export const currentUser = writable(null);
