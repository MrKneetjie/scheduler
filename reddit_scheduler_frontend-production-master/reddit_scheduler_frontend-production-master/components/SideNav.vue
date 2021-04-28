<template>
  <v-list
    dense
    nav
  >
    <v-list-item
      link
      :to="item.link"
      v-for="(item, i) in navItems"
      :key="i"
    >
      <v-list-item-icon>
        <v-icon>{{item.icon}}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{item.name}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'side-nav',

  computed: {
    navItems(){
      const { auth } = this.$store.state;
      if(auth.user && auth.user.isAdmin)
        return this.adminNavItems;
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
