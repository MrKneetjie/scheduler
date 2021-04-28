<template>
  <v-app id="inspire">
      <v-app-bar
        app
        dense
        class="floating"
      >
        <top-nav/>
        <v-spacer/>
        <v-btn
          text
          @click="logout"
        >
          <v-icon>mdi-power</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <v-container fluid>
          <Nuxt/>
        </v-container>
      </v-main>  
  </v-app>
</template>

<script>
import TopNav from '@/components/TopNav';
export default {
  name: "dashboard-layout",
  components: { TopNav },
  methods: {
    logout(){
      this.$store.dispatch('auth/logout')
        .then(() => {
          this.$router.push('/login');
        });
    }
  }
}

</script>

<style>

.v-img {
  border-radius: 5;
}

td img {
  vertical-align: top;
}

.dashboard-content {
  width: 80%;
}

</style>
