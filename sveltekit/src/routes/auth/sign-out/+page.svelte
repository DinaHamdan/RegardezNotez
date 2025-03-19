<script>
  import { onMount } from 'svelte';
  import authApi from '$lib/api/auth.api';
  import { accessToken } from '$lib/store';

  let isLoading = true;

  onMount(async () => {
    await authApi.signOut($accessToken);
    isLoading = false;
  });
</script>

<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content text-center">
    <div class="max-w-md">
      {#if isLoading}
        <h1 class="text-5xl font-bold">Déconnexion</h1>
        <div class="py-6">
          <span class="loading loading-spinner loading-xl"></span>
        </div>
      {:else}
        <h1 class="text-5xl font-bold">Vous êtes bien déconnecté</h1>
        <p class="py-6">Vous pouvez fermer cette page.</p>
        <a href="./sign-in" class="btn btn-primary">Se connecter</a>
      {/if}
    </div>
  </div>
</div>
