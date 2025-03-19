import { redirect } from '@sveltejs/kit';
import { accessToken } from '$lib/store';
import authApi from '$lib/api/auth.api';
import { get } from 'svelte/store';

export async function load({ fetch }) {
  try {
    const getCurrentUserResponse = await authApi.getCurrentUser(fetch);

    return {
      currentUser: getCurrentUserResponse.data,
    };
  } catch {
    // Failed to get authenticated user

    if (get(accessToken)) {
      // Has access_token in cookie
      redirect(307, '/auth/sign-out');
    }

    redirect(307, '/auth/sign-in');
  }
}
