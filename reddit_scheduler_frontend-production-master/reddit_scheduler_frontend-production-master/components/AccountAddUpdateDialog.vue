<template>
  <v-dialog
    v-model="display"
    width="500"
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        Account
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="account.username"
          label="Username"
        ></v-text-field>
        <v-text-field
          v-model="account.password"
          label="Password"
        ></v-text-field>
        <v-text-field
          v-model="account.clientId"
          label="Client Id"
        ></v-text-field>
        <v-text-field
          v-model="account.clientSecret"
          label="Client Secret"
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          text
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="addUpdate"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> 
</template>

<script>
export default {
  name: 'account-add-update-dialog',
  props: ['display', 'account', 'addUpdate', 'close'],
}
</script>
