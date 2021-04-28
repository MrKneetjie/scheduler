<template>
  <v-toolbar-items>
    <v-btn
      text
      :to="item.link"
      :key="i"
      v-for="(item, i) in navItems"
    >
      <v-icon left dark>{{ item.icon }}</v-icon>
      {{ item.name }}
    </v-btn>
  </v-toolbar-items>
</template>

<script>
export default {
  name: 'top-nav',

  computed: {
    navItems(){
      const { auth } = this.$store.state;
      if(auth.user && auth.user.isAdmin)
        return [ ...this.adminNavItems, ...this.userNavItems];
      return this.userNavItems;
    }
  },

  data(){
    return {
      adminNavItems: [
        { name: 'Users',
          link: '/users',
          icon: 'mdi-account'
        }
      ],
      userNavItems: [
        { name: 'Posts',
          link: '/posts',
          icon: 'mdi-pen'
        },
        { name: 'Accounts',
          link: '/accounts',
          icon: 'mdi-account'
        }
      ]
    }
  }
}
</script>
