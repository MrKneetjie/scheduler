<template>
  <div>
    <user-add-update-dialog 
      :display="addUpdateDialog" 
      :addUpdate="addUpdate"
      :user="getActiveItem" 
      :close="closeAddUpdateDialog"
      :key="activeItem._id"
      persistent
    />
    <v-simple-table class="acc-table">
      <template v-slot:top>
        <v-toolbar dense flat class="sticky-table-header">
          <template>
            <v-btn icon @click="openAddUpdateDialog">
              <v-icon>{{addButtonIcon}}</v-icon>
            </v-btn>
            <v-btn icon @click="openAddUpdateDialog" :disabled="actionsDisabled">
              <v-icon>mdi-dots-horizontal-circle</v-icon>
            </v-btn>
            <v-btn icon @click="deleteItem" :disabled="actionsDisabled">
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
            <v-text-field
              absolute
              dense
              outlined
              filled
              label="Search email"
              v-model="searchQuery"
              append-outer-icon="mdi-magnify"
              @click:append-outer="search"
              class="search-label-input"
            ></v-text-field>
          </template>
        </v-toolbar> 
      </template>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Created</th>
            <th class="text-left">Email</th>
            <th class="text-left">First Name</th>
            <th class="text-left">Last Name</th>
            <th class="text-left">Accounts Quota/Added</th>
            <th class="text-left">Posts Quota/Added</th>
            <th class="text-left">Quota Expires</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users" :key="item._id" @click="rowClick(item)" :class="rowSelected(item)">
            <td> {{ $moment(item.createdAt).format('MMM Do YYYY, h:mm a') }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.firstName }}</td>
            <td>{{ item.lastName }}</td>
            <td>{{ item.accountsQuota + '/' + item.accountsAdded }}</td>
            <td>{{ item.postsQuota  + '/' + item.postsAdded }}</td>
            <td>{{ $moment(item.quotaExpiresAt).format('MMM Do YYYY, h:mm a') }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>

import { makeFindMixin } from 'feathers-vuex';
import Pagination from '@/mixins/Pagination';
import CrudTableMixin from '@/mixins/CrudTable';
import UserAddUpdateDialog from '@/components/UserAddUpdateDialog';

export default {

  name: 'users',

  layout: 'dashboard_topbar',

  middleware: [ 'admin' ],

  components: { UserAddUpdateDialog },

  mixins: [
    makeFindMixin({ service: 'users' }),
    CrudTableMixin('User', 'email', 'quotaExpiresAt'),
    Pagination('users')
  ],

  data() {
    return {

    }
  },

  computed: {

    usersParams(){
      return { query: {
        ...this.queryParams,
        roles: { $nin: 'admin' }
      }};
    }

  },

  methods: {

  },

  mounted(){
    console.log(this.$store.state.auth.user);
  }

}
</script>

<style scoped>

.search-label-input {
  margin-top: 25px;
  max-width: 300px;
}

.sticky-table-header {
  position: sticky;
  top: 60px;
}

</style>
