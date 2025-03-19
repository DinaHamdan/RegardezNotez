<script>
  import { currentUser } from '$lib/store';

  export let data;

  $currentUser = data.currentUser;
</script>

<slot />
