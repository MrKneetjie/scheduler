<template>
  <v-card class="elevation" width="350">
    <v-toolbar flat>
      <v-toolbar-title>Reset Password</v-toolbar-title>
      <div class="flex-grow-1"></div>
    </v-toolbar>
    <v-form 
      v-model="formValid"
      @submit.prevent="onSubmit"
      ref="form"
      lazy-validation
    >
        <v-card-text>
          <v-text-field
            label="Password"
            prepend-icon="mdi-key"
            type="password"
            v-model="password"
            :rules="notEmptyRule"
          ></v-text-field>
          <v-text-field
            label="Confirm Password"
            prepend-icon="mdi-key"
            type="password"
            v-model="confirmPassword"
            :rules="passwordRules"
          ></v-text-field>
        </v-card-text>
        <v-alert
          dense
          text
          type="success"
          v-if="changePasswordStatus"
        >
          Password has been changed. Redirecting to login.
        </v-alert>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit">Change Password</v-btn>
        </v-card-actions>
      </v-form>
  </v-card>
</template>

<script>
import Login from '@/mixins/Login';
import UsersMixin from '@/mixins/UsersMixin';
import Validators from '@/mixins/Validators';

export default {

  name: 'change-password',

  mixins: [ Login, UsersMixin, Validators ],

  data(){
    return {
      formValid: true,
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      error: null,
      notEmptyRule: [ this.notEmpty ],
      emailRules: [ this.notEmpty, this.validEmail ],
      passwordRules: [ this.notEmpty, this.passwordsMatch ],
      submit: false,
      changePasswordStatus:false,
    }
  },

  methods: {
    onSubmit(){
      if(!this.$refs.form.validate())
        return;
      let user_object = {
        action: 'resetPwdLong',
        value: { token: this.tokenLink, password: this.password }
      }
      let result = this.changePassword(user_object)
      this.changePasswordStatus = true;
      setTimeout( () => this.$router.push({ path: '/login'}), 3000);
     
    }
  },
  computed: {
      tokenLink(){
          return this.$route.query.token
      }
  }

}
</script>
