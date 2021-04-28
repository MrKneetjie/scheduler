<template>
  <v-container class="full-height d-flex justify-center align-center" fluid>
    <ForgetPassword />
  </v-container>
</template>

<script>

import ForgetPassword from '@/components/Password';

export default {
  name: 'home',
  components: { ForgetPassword }
}
</script>
