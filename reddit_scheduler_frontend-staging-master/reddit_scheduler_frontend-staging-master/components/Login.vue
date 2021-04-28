<template>
  <v-card class="elevation" width="350">
    <v-toolbar flat>
      <v-toolbar-title>Login</v-toolbar-title>
      <div class="flex-grow-1"></div>
    </v-toolbar>
      <v-form 
        @submit.prevent="onSubmit" 
        v-model="formValid" 
        ref="form"
        lazy-validation
      >
        <v-card-text>
          <v-text-field
            placeholder="johndoe@gmail.com"
            prepend-icon="mdi-email"
            type="text"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-text-field
            placeholder="*********"
            prepend-icon="mdi-key"
            type="password"
            v-model="password"
            required
          >
          </v-text-field>
          <!-- <v-checkbox v-model="remember_me">
            <template v-slot:label>
              <div>
                Remember Me
              </div>
            </template>
          </v-checkbox> -->
        </v-card-text>
         <v-alert
          dense
          text
          type="success"
          v-if="loginSucccess"
        >
          User is not verified. 
        </v-alert>
        <v-card-actions>
           <NuxtLink to="/signup" class='signup-link'>Sign Up </NuxtLink> /
          <NuxtLink to="/password" class=' float-right signup-link'> Reset Password</NuxtLink>
          <v-spacer></v-spacer>
          <v-btn type="submit">Login</v-btn>
        </v-card-actions>
      </v-form>
  </v-card>
</template>
  
<script>
import Login from '@/mixins/Login';
import Message from '@/components/Message';
import Validators from '@/mixins/Validators';

export default {

  name: 'login',
  components: { Message },
  mixins: [ Login, Validators ],

  data(){
    return {
      email: '',
      password: '',
      formValid: true,
      error: null,
      remember_me: false,
      emailRules: [ this.notEmpty, this.validEmail ],
      passwordRules: [ this.notEmpty ],
      loginSucccess: false
    }
  },

  methods: {

    onSubmit() {
    
      if(!this.$refs.form.validate())
        return;
        this.login()
    }

  }


}
</script>

<style scoped>
.signup-link {
  font-size: 10pt;
}
</style>
