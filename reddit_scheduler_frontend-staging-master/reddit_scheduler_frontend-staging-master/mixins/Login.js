export default {
  methods: {
    login(){
    
      this.$store.dispatch('auth/authenticate', { 
        strategy: 'local', 
        email: this.email, 
        password: this.password
      })
      .then((payload) => {
        if(this.remember_me){
          localStorage.setItem("remember", this.remember_me);
        }
        const { user } = payload;
        console.log(user)
        if(user.isVerified) {
          if(user.isAdmin)
            this.$router.push({ name: 'users' });
          else
            this.$router.push({ name: 'posts' });
        }
        else {
            this.$store.dispatch('auth/logout');
            this.$store.commit('showMessage', { type: 'error', text: 'User not verified' });
        }
      })
      .catch(err => {
        let type = err.className
        err = Object.assign({}, err);
        err.message =
          type === 'not-authenticated'
            ? 'Incorrect email or password.'
           : 'An error prevented login.'
        this.$store.commit('showMessage', { type: 'error', text: err.message });
      });
    }
  }
};
