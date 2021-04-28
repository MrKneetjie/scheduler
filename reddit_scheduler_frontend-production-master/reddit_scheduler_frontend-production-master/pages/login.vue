<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <message/>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
        <login/>
    </v-row>
  </v-container>
</template>

<script>
console.log(process.env.API_URL);
import Login from '@/components/Login';
import Message from '@/components/Message';

export default {
  name: 'home',
  components: { Login, Message },
}
</script>
