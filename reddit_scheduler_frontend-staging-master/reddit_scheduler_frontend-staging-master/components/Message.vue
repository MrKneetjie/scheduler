<template>
  <v-alert
    dismissible
    transition="scale-transition"
    :type="message.type"
    v-if="display"
    @input="closeMessage"
  >{{ message.text }}</v-alert>
</template>

<script>
export default {
  name: 'message',

  //watch: {
  //  //messages(oldMessages, newMessages){
  //  //  console.log(newMessages);
  //  //}
  //},
  computed: {
    message(){
      return this.$store.state.message;
    },

    display(){
      return this.message.text && this.message.text.length > 0;
    }
  },

  //mounted(){
  //  console.log('mounting');
  //  this.$store.watch((state) => state.message, (oldValue, newValue) => {
  //    console.log(newValue);
  //  });
  //}
  watch: {
    message(){
      console.log(this.message);
    }
  },

  methods: {
    closeMessage(){
      this.$store.commit('showMessage', {})
    }
  }
}
</script>
