<template>
  <v-container class="full-height d-flex justify-center align-center" fluid>
    <sign-up />
  </v-container>
</template>

<script>

import SignUp from '@/components/SignUp';

export default {
  name: 'home',
  components: { SignUp }
}
</script>
