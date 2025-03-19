<script>
  import { accessToken } from '$lib/store';
  import '../app.css';

  /** @type {import('./$types').LayoutData} */
  export let data;

  $accessToken = data.accessToken;
</script>

<slot />
