<script>
  import { goto } from '$app/navigation';
  import authApi from '$lib/api/auth.api';
  import { accessToken } from '$lib/store';

  let isLoading = false;
  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';

  const onSubmit = async () => {
    isLoading = true;
    try {
      const response = await authApi.signUp({
        firstName,
        lastName,
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
      <h1 class="text-5xl font-bold">Inscription</h1>
    </div>
    <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div class="card-body">
        <form on:submit={onSubmit}>
          <fieldset class="fieldset" disabled={isLoading}>
            <label class="fieldset-label" for="sign-up-input-firstname">Prénom</label>
            <input
              id="sign-up-input-firstname"
              type="text"
              class="input"
              placeholder="Prénom"
              bind:value={firstName}
            />
            <label class="fieldset-label" for="sign-up-input-lastname">Nom</label>
            <input
              id="sign-up-input-lastname"
              type="text"
              class="input"
              placeholder="Nom"
              bind:value={lastName}
            />
            <label class="fieldset-label" for="sign-up-input-email">E-mail</label>
            <input
              id="sign-up-input-email"
              type="email"
              class="input"
              placeholder="E-mail"
              bind:value={email}
            />
            <label class="fieldset-label" for="sign-up-input-password">Mot de passe</label>
            <input
              id="sign-up-input-password"
              type="password"
              class="input"
              placeholder="Mot de passe"
              bind:value={password}
            />
            <div><a href="./sign-in" class="link link-hover">Déjà un compte ?</a></div>
            <button class="btn btn-neutral mt-4" disabled={isLoading}>
              {#if isLoading}
                <span class="loading loading-spinner"></span>
              {/if}
              Inscription
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</div>
