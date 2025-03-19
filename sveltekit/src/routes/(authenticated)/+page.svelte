<script>
  import { currentUser } from '$lib/store';
  import { onMount } from 'svelte';

  onMount(() => {
    console.log({ currentUser: $currentUser });
  });
</script>

<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Bonjour {$currentUser.firstName} {$currentUser.lastName}</h1>
      <p class="py-6">
        Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
      </p>
      <button class="btn btn-primary">Yeah !</button>
    </div>
  </div>
</div>
