import { mapState, mapGetters, mapActions } from "vuex";
import feathersClient from "@/plugins/feathers";

export default {

  computed: {
    ...mapState("accounts", {
      accountsLoading: "isFindPending",
      accountsPagination: "pagination"
    }),
    ...mapGetters("accounts", {
      findAccountsInStore: "find",
      accountsList: "list"
    })
  },
  
  methods: {
    ...mapActions("accounts", {
      findAccounts: "find",
      createAccount: "create"
    })
  },
  
  async created() {
    console.log("AccountsMixin was loaded");
    feathersClient.service("accounts").on("created", data => {
      console.log(`Account created - ${data.title}`);
    });
  }

};
