<template>
  <v-card class="elevation" width="450">
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
            label="Email"
            prepend-icon="mdi-email"
            type="text"
            v-model="email"
            :rules="emailRules"
          ></v-text-field>
        </v-card-text>
        <v-alert
          dense
          text
          type="success"
          v-if="submit"
        >
          An email has been sent to the address. If you didn't receive any please contact Technical Support.
        </v-alert>
        <NuxtLink to="/login" class='float-left pt-4 pl-4 signup-link'>Back to Login</NuxtLink>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit">Send</v-btn>
        </v-card-actions>
      </v-form>
  </v-card>
</template>

<script>
import Login from '@/mixins/Login';
import UsersMixin from '@/mixins/UsersMixin';
import Validators from '@/mixins/Validators';


export default {

  name: 'forget-password',

  mixins: [ Login, UsersMixin, Validators ],

  data(){
    return {
      formValid: true,
      email: '',
      submit: false,
      fail:false,
      error: null,
      notEmptyRule: [ this.notEmpty ],
      emailRules: [ this.notEmpty, this.validEmail ]
    }
  },

  methods: {
    async onSubmit(){
      if(!this.$refs.form.validate())
        return;
      this.submit = true;
      let user = {
        value: { email: this.email},
        action: 'sendResetPwd',
      }
     
      let data = this.emailExist(user)
      
    
    },

  }

}
</script>
