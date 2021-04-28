<template>
  <v-container class="full-height d-flex justify-center align-center" fluid>
    <sign-up/>
    <ForgetPassword/>
  </v-container>
</template>

<script>

import Login from '@/components/Login';
import ForgetPassword from '@/components/Password';
import SignUp from '@/components/SignUp';


export default {
  name: 'home',
  components: { Login, SignUp ,ForgetPassword }
}
</script>
