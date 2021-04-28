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
        User 
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="user.email"
          label="email"
        ></v-text-field>
        <v-text-field
          v-model="user.firstName"
          label="First Name"
        ></v-text-field>
        <v-text-field
          v-model="user.lastName"
          label="Last Name"
        ></v-text-field>
        <v-text-field
          type="number"
          v-model="user.accountsQuota"
          label="Accounts Quota"
        ></v-text-field>
        <v-text-field
          type="number"
          v-model="user.postsQuota"
          label="Posts Quota"
        ></v-text-field>
        <v-datetime-picker 
          label="Quota Expires At" 
          v-model="pickerDateTime"
          @input="dateTimeChanged"> 
        </v-datetime-picker>
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
          @click="save(user)"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> 
</template>

<script>
export default {
  name: 'user-add-update-dialog',
  props: ['display', 'user', 'addUpdate', 'close'],

  data(){
    return {
      pickerDateTime: this.user.quotaExpiresAt ? new Date(this.user.quotaExpiresAt) : new Date(),
    }
  },

  methods: {
    dateTimeChanged(dateTime){
      if(dateTime)
        this.user.quotaExpiresAt = dateTime;
    },
    save(user){
      delete user.password;
      this.addUpdate(user);
    }
  }
}
</script>
