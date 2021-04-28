<template>
  <v-list
    dense
    nav
  >
    <v-list-item
      link
      to="/posts"
    >
      <v-list-item-icon>
        <v-icon>mdi-pen</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>Posts</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      link
      to="/accounts"
    >
      <v-list-item-icon>
        <v-icon>mdi-account</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>Accounts</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'user-side-nav'
}
</script>
