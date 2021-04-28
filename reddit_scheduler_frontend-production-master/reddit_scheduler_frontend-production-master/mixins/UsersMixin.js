import { mapState, mapGetters, mapActions } from "vuex";
import feathersClient from "@/plugins/feathers";

export default {

  computed: {
    ...mapState("users", {
      usersLoading: "isFindPending",
      usersPagination: "pagination"
    }),
    ...mapGetters("users", {
      findUsersInStore: "find",
      usersList: "list"
    })
  },
  
  methods: {
    ...mapActions("users", {
      findUsers: "find",
      register: "create"
    }),
    async emailExist(user){
      var result = await feathersClient.service('authManagement').create(user).then((success)=>{ return success}).catch((error)=> { console.log(error.message)  })
      return result
    },
    async changePassword(user_object){
      var result = await feathersClient.service('authManagement').create(user_object)
      console.log(`Result is:`,result)
    }
  },
  
  async created() {
    console.log("UsersMixin was loaded");
    feathersClient.service("users").on("created", data => {
      console.log(`User created - ${data.title}`);
    });
  },
 

};
