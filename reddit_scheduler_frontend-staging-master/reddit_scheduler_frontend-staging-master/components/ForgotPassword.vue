<template>
  <v-card class="elevation" width="350">
    <v-toolbar flat>
      <v-toolbar-title>Forgot Password?</v-toolbar-title>
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
            label="Email"
            prepend-icon="mdi-account"
            type="text"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit">Submit</v-btn>
        </v-card-actions>
      </v-form>
  </v-card>
</template>
  
<script>
import Login from '@/mixins/Login';


export default {

  name: 'forget-password',
  


}
</script>

<style scoped>
.signup-link {
  font-size: 10pt;
}
</style>
