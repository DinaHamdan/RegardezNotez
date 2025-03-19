<script>
  import { goto } from '$app/navigation';
  import authApi from '$lib/api/auth.api';
  import { accessToken } from '$lib/store';

  let isLoading = false;
  let email = '';
  let password = '';

  const onSubmit = async () => {
    isLoading = true;
    try {
      const response = await authApi.signIn({
        email,
        password,
      });

      $accessToken = response.data.accessToken;
      goto('/');
    } catch (err) {
      password = '';
      console.log(err.data);
    }

    isLoading = false;
  };
</script>

<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content flex-col lg:flex-row-reverse">
    <div class="text-center lg:text-left">
      <h1 class="text-5xl font-bold">Connexion</h1>
    </div>
    <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div class="card-body">
        <form on:submit={onSubmit}>
          <fieldset class="fieldset" disabled={isLoading}>
            <label class="fieldset-label" for="sign-in-input-email">E-mail</label>
            <input
              id="sign-in-input-email"
              type="email"
              class="input"
              placeholder="E-mail"
              bind:value={email}
            />
            <label class="fieldset-label" for="sign-in-input-password">Mot de passe</label>
            <input
              id="sign-in-input-password"
              type="password"
              class="input"
              placeholder="Mot de passe"
              bind:value={password}
            />
            <div><a href="./sign-up" class="link link-hover">Inscription</a></div>
            <button class="btn btn-neutral mt-4" disabled={isLoading}>
              {#if isLoading}
                <span class="loading loading-spinner"></span>
              {/if}
              Connexion
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</div>
