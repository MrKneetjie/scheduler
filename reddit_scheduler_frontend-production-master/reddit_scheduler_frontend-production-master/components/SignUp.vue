<template>
  <v-card class="elevation" width="350">
    <v-toolbar flat>
      <v-toolbar-title>Sign Up</v-toolbar-title>
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
          <v-text-field
            label="Name"
            prepend-icon="mdi-face"
            type="text"
            v-model="firstName"
            :rules="notEmptyRule"
          ></v-text-field>
          <v-text-field
            label="Last name"
            prepend-icon="mdi-card-account-details"
            type="text"
            v-model="lastName"
            :rules="notEmptyRule"
          ></v-text-field>
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
          v-if="submit"
        >
          A verification email has been set to the email address above. 
        </v-alert>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit">Sign Up</v-btn>
        </v-card-actions>
      </v-form>
  </v-card>
</template>

<script>
import Login from '@/mixins/Login';
import UsersMixin from '@/mixins/UsersMixin';
import Validators from '@/mixins/Validators';

export default {

  name: 'sign-up',

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
      submit: false
    }
  },

  methods: {
    onSubmit(){
      if(!this.$refs.form.validate())
        return;
      const { User } = this.$FeathersVuex.api;
      const user = new User({
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password
      });
      let data = user.save()
      .then((res) => {
        this.submit = true
        setTimeout( () => this.$router.push({ path: '/login'}), 2000);
        
      })
      .catch(err => console.log(err));
     
    },

  }

}
</script>
