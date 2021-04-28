<template>
  <v-container class="full-height d-flex justify-center align-center" fluid>
    <ForgetPassword />
  </v-container>
</template>

<script>

import ForgetPassword from '@/components/VerifyEmail';

export default {
  name: 'verify-email',
  components: { ForgetPassword }
}
</script>
