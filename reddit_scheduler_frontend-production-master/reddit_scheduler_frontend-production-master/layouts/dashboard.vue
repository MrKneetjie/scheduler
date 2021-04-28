<template>
  <v-app id="inspire">
      <v-app-bar
        app
        dense
        class="d-flex justify-end align-bottom"
      >
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="logout"
        >
          <v-icon>mdi-power</v-icon>
        </v-btn>
      </v-app-bar>
    <v-navigation-drawer app floating>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Reddit 
          </v-list-item-title>
          <v-list-item-subtitle>
            Scheduler 
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <side-nav></side-nav>

    </v-navigation-drawer>
      <v-main>
        <v-container fluid>
          <Nuxt/>
        </v-container>
      </v-main>  
  </v-app>
</template>

<script>
import SideNav from '@/components/SideNav';
export default {
  name: "dashboard-layout",
  components: { SideNav },
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
