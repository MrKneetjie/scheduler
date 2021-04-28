<template>
  <div>
    <message/>
    <account-add-update-dialog 
      :display="addUpdateDialog" 
      :addUpdate="addUpdate"
      :account="activeAccount" 
      :close="closeAddUpdateDialog"
    />
    <v-simple-table class="acc-table">
      <template v-slot:top>
        <v-toolbar dense flat>
          <template>
            <v-btn icon @click="addAccount">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
            <v-btn icon @click="deleteAccount" :disabled="actionsDisabled">
              <v-icon>mdi-delete-circle</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-pagination
              v-model="page"
              :length="Math.ceil(pagination.total / pagination.limit)"
              :value="Math.floor(pagination.skip / pagination.limit)"
              @input="paginationChanged"
              circle
              dark
            ></v-pagination>
          <v-spacer></v-spacer>
          </template>
        </v-toolbar> 
      </template>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Icon</th>
            <th class="text-left">Username</th>
            <th class="text-left">Access Token</th>
            <th class="text-left">Refresh Token</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in accounts" :key="item.id" @click="rowClick(item)" :class="rowSelected(item)">
            <td><img :src="item.iconImg" width="50"/></td>
            <td>{{ item.username }}</td>
            <td>{{ item.accessToken }}</td>
            <td>{{ item.refreshToken }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
</div>
  
</template>

<script>
import { makeFindMixin } from 'feathers-vuex';
import Pagination from '@/mixins/Pagination';
import AccountsMixin from '@/mixins/AccountsMixin';
import AccountAddUpdateDialog from '@/components/AccountAddUpdateDialog';
import Message from '@/components/Message';

export default {

  layout: 'dashboard_topbar',
  components: { AccountAddUpdateDialog, Message },
  //middleware: [ 'nonadmin' ],
  mixins: [ 
    makeFindMixin({ service: 'accounts' }),
    Pagination('accounts')
  ],

  computed: {
    accountsParams(){
      return { query: {} };
    },

    actionsDisabled(){
      if(this.activeAccount._id)
        return false;
      return true;
    },
  },

  mounted(){
    this.findAccounts({})
      .then(accs => console.log(accs));
  },

  data(){
    return {
      activeAccount: {},
      addUpdateDialog: false,
    }
  },

  methods: {

    findAccountById(id){
      return this.accounts.filter(acc => acc._id === id)[0];
    },

    rowClick(account){
      if(this.activeAccount._id !== account._id)
        this.activeAccount = this.findAccountById(account._id).clone();
      else
        this.activeAccount = {};
    },

    rowSelected(item){
      if(this.activeAccount._id !== item._id)
        return "";
      return "grey darken-2";
    },

    closeAddUpdateDialog(){
      this.addUpdateDialog = false;
    },

    deleteAccount(){
      if(!this.activeAccount._id)
        return;
      this.activeAccount.remove({});
      this.activeAccount = {};
    },

    addUpdate(){
      this.closeAddUpdateDialog();
      if(this.activeAccount._id){
        this.activeAccount.commit();
        return this.findAccountById(this.activeAccount._id).save();
      }
      const { Account } = this.$FeathersVuex.api;
      const account = new Account(this.activeAccount);
      account.save()
        .then(() => this.activeAccount = {})
        .catch(err => console.log(err));
    },

    addAccount(){
      const { Account } = this.$FeathersVuex.api;
      const account = new Account({});
      account.save()
        .then(() => this.activeAccount = {})
        .catch(err => {
          this.$store.commit('showMessage', { type: 'error', text: err.message });
        });
    }

  }
}

</script>
