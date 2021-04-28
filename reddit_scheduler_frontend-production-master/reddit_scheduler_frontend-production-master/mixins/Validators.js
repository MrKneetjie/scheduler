export default {

  methods: {

    notEmpty(v){
      return !!v || 'Field is required';
    },

    validEmail(v){
      return /.+@.+\..+/.test(v) || 'Invalid email';
    },

    passwordsMatch(v){
      return (v === this.password) || 'Passwords not match';
    }

  }

};
