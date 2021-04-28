<template>
  <v-card class="elevation" width="100%">
        <v-alert
          dense
          text
          type="success"
          v-if="verified"
        >
          Email has been verified.
        </v-alert>
         <v-alert
          dense
          text
          type="error"
          v-else
        >
          {{message}}
        </v-alert>
  </v-card>
</template>

<script>

import axios from 'axios'

export default {

  name: 'verify-email',

  data(){
    return {
      verified:null,
      message:''
    }
  },
  created:  function(){

     if(this.$route.query.verified) {
       this.verified = true 
      setTimeout( () => this.$router.push({ path: '/login'}), 5000);; 
     }
      else this.verified = false;
  }

}
</script>
