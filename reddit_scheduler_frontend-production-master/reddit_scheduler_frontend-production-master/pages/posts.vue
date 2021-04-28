<template>
  <div>
    <message/>
    <post-add-update-dialog 
      :display="addUpdateDialog" 
      :accounts="accounts"
      :addUpdate="addUpdate"
      :post="getActivePost" 
      :close="closeAddUpdateDialog"
      :editNext="editNext"
      persistent
    />
    <PostBulkAddUpdateDialog
      :display="bulkAddUpdateDialog" 
      :accounts="accounts"
      :postGenerateFeather="postGenerateFeather"
      :close="closeBulkImport"
      :counterPost="counterPost"
      persistent
    />
    <v-simple-table class="acc-table">
      <template v-slot:top>
        <v-toolbar dense flat class="sticky-table-header">
          <template>
            
            <v-btn  @click="openbulkAddUpdateDialog">
              <v-icon>mdi-text-box-plus</v-icon>
            </v-btn>
            <v-btn  @click="openAddUpdateDialog">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-pagination
              v-model="page"
              :length="Math.ceil(pagination.total / pagination.limit)"
              :value="Math.floor(pagination.skip / pagination.limit)"
	      :total-visible="10"
              @input="paginationChanged"
              circle
              dark
            ></v-pagination>
            <v-spacer></v-spacer>
            <v-combobox
              v-model="labelQueryArray"
              :items="labels"
              label="Label"
              clearable
              absolute
              dense
              outlined
              filled
              multiple
              small-chips
              deletable-chips
              hide-no-data
              @input="labelQueryChanged"
              class="search-combobox"
            ></v-combobox>
          </template>
        </v-toolbar> 
      </template>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Created</th>
            <th class="text-left">Label</th>
            <th class="text-left">Account</th>
            <th class="text-left">Title</th>
            <th class="text-left">Image</th>
            <th class="text-left">Subreddit</th>
            <th class="text-left">Scheduled At</th>
            <th class="text-left">Posted</th>
            <th class="text-left">Submission Id</th>
            <th class="text-left">Error</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in posts" :key="item._id" @click="rowClick(item)" :class="rowSelected(item)">
            <td> {{ $moment(item.createdAt).format('MMM Do YYYY, h:mm a') }}</td>
            <td>{{ item.label }}</td>
            <td>{{ item.account ? item.account.username : "deleted" }}</td>
            <td>{{ item.title }}</td>
            <td><img :src="item.imageUrl" height="77"/></td>
            <td>{{ item.subreddit }}</td>
            <td>{{ $moment(item.postAt).format('MMM Do YYYY, h:mm a') }}</td>
            <td>{{ item.posted ? 'Yes' : 'No'}}</td>
            <td><a :href="postUrl(item)" target="_blank">{{ item.submissionName }}</a></td>
            <td>{{ item.error }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- <div class="container-1">
      <v-flex d-flex>
        <v-layout wrap>
          
          <v-flex md4 v-for="item in posts" :key="item._id" class="pa-3">
              <v-card
                class="card-container"
                outlined
              > 
              <v-row>
                <v-col cols="4">
                  <v-img
                    :src="item.imageUrl"
                    :lazy-src="item.imageUrl"
                    height="75"
                  >
                  </v-img>
                </v-col>
                <v-col cols="8">
                  <v-list-item three-line>
                    <v-list-item-content>
                      
                      <h2 class="nowrap-overflow ">{{ item.title }}</h2>
                      <small> {{ item.subreddit }} </small>

                      <v-list-item-subtitle><span class="font-weight-bold">Account Name:</span> {{ item.account ? item.account.username : "deleted" }}</v-list-item-subtitle>
                      <v-list-item-subtitle><span class="font-weight-bold">Subreddit: </span>{{ item.subreddit }}</v-list-item-subtitle>
                      <v-list-item-subtitle><span class="font-weight-bold">Scheduled At: </span>{{ $moment(item.postAt).format('MMM Do YYYY, h:mm a') }}</v-list-item-subtitle>
                      <v-list-item-subtitle><span class="font-weight-bold">Post Status: </span>{{ item.posted ? 'Yes' : 'No'}}</v-list-item-subtitle>
                      <v-list-item-subtitle><span class="font-weight-bold">Submission ID: </span><a :href="postUrl(item)" target="_blank">{{ item.submissionName }}</a></v-list-item-subtitle>
                      <v-list-item-subtitle><span class="font-weight-bold">Error: </span>{{ item.error ? item.error : 'No Error' }}</v-list-item-subtitle>
                    
                    </v-list-item-content >

                  </v-list-item>

                </v-col>
              </v-row>
              <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon @click="rowClick(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn icon @click="DuplicateAddUpdateDialog(item)">
                <v-icon>mdi-content-duplicate</v-icon>
              </v-btn>

              <v-btn icon @click="deletePost(item)" :disabled="deleteDisabled">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
            </v-card>
            </v-flex>
        </v-layout>
      </v-flex>
    </div>
    -->
</div>
  
</template>

<script>
import { makeFindMixin } from 'feathers-vuex';
import Pagination from '@/mixins/Pagination';
import Message from '@/components/Message';
import PostBulkAddUpdateDialog from '@/components/BulkPostAddUpdate';
import PostAddUpdateDialog from '@/components/PostAddUpdateDialog';


const defaultPost = { postAt: new Date() };
export default {

  layout: 'dashboard_topbar',
  components: { PostAddUpdateDialog, Message,PostBulkAddUpdateDialog },

  //middleware: [ 'nonadmin' ],

  mixins: [ 
    makeFindMixin({ service: 'accounts' }),
    makeFindMixin({ service: 'posts', watch: 'skip' }),
    makeFindMixin({ service: 'labels' }),
    Pagination('posts')
  ],

  computed: {
     columns () {
      let columns = []
      let mid = Math.ceil(this.posts.length / 3)
      console.log(mid)
      for (let col = 0; col < 3; col++) {
        columns.push(this.posts.slice(col * mid, col * mid + mid))
      }
      return columns
    },
    getActivePost(){
      const { Post } = this.$FeathersVuex.api;
      if(this.activePost)
        return this.activePost.clone();
      return new Post({}).clone();
    },

    labelsParams(){
      return { query: {}, paginate: false };
    },
    
    accountsParams(){
      return { query: {} };
    },

    postsParams(){
      return { query: this.postQuery, paginate: true, qid: 'postsPagination' };
    },

    postQuery(){
      const sort = {
        $sort: {
          createdAt: -1
        },
        $limit: 10,
        $skip: this.skip 
      };
      if(this.labelQueryArray.length > 0){
        console.log('label filter...')
        return { 
          label: {
            $in: [...this.labelQueryArray.map(label => label.text)]
          },
          ...sort
        }
      }
      return sort;
    },

    actionsDisabled(){
      if(this.activePost && this.activePost._id)
        return false;
      return true;
    },

    addButtonIcon(){
      if(this.activePost)
        return 'mdi-checkbox-multiple-blank-circle';
      return 'mdi-plus-circle';
    },

    bulkAddButtonIcon(){
      if(this.activePost)
        return 'mdi-checkbox-multiple-blank-circle';
      return 'mdi-plus-circle';
    },

  },

  data(){
    return {
      counterPost: 0,
      deleteDisabled: true,
      activePost: false,
      addUpdateDialog: false,
      bulkAddUpdateDialog: false,
      labelQuery: '',
      editNext: false,
      labelQueryArray: [] ,
      cols:4
    }
  },

  methods: {
    
    closeBulkImport(countData){
      this.bulkAddUpdateDialog = false;
      this.$router.go()
    },

    searchLabel(){
      console.log('searching: ' + this.labelQuery);
    },

    findPostById(id){
      return this.posts.filter(post => post._id === id)[0];
    },

    rowClick(post){
      if(!this.activePost || (this.activePost._id !== post._id)){
        this.activePost = post;
        this.addUpdateDialog = true;
      }else{
        this.activePost = false;
      }
    },

    rowSelected(item){
      if(!this.activePost || (this.activePost._id !== item._id))
        return "";
      return "grey darken-2";
    },

    postDuplicate(post){
      const { Post } = this.$FeathersVuex.api;
      const copy = { ...post };
      delete copy._id;
      delete copy.__id;
      delete copy.submissionName;
      delete copy.posted;
      delete copy.createdAt;
      delete copy.updatedAt;
      delete copy.error;
      return new Post(copy);
    },
    
    openAddUpdateDialog(){
      if(this.activePost)
        this.activePost = this.postDuplicate(this.activePost);
      this.addUpdateDialog = true;
    },
    
    DuplicateAddUpdateDialog(item){
      this.activePost = item;
      if(this.activePost)
        this.activePost = this.postDuplicate(this.activePost);
      this.addUpdateDialog = true;
    },

    openbulkAddUpdateDialog()
    {
      if(!this.bulkAddUpdateDialog) this.bulkAddUpdateDialog = true;
      else this.bulkAddUpdateDialog = false;
      
    },
    postGenerateFeather(dataObjectImport){

      const { Post } = this.$FeathersVuex.api;
      const data = { ...dataObjectImport }
      const post = new Post(data);
      
      return post.save().then(post => {
        return true;
      }).catch(err => {
        this.$store.commit('showMessage', { type: 'error', text: err.message });
        return false;
      });
    },
    postUrl(post){
      const postId = post.submissionName.split('_')[1];
      return `https://reddit.com${post.subreddit}/comments/${postId}`;
    },

    closeAddUpdateDialog(){
      this.addUpdateDialog = false;
      this.activePost = false;
      this.editNext = false;
    },

    deletePost(item){
      this.activePost = item;
      console.log(this.activePost)
      if(!this.activePost)
        return;
      this.activePost.remove({});
      this.activePost = false;
    },

    addUpdate(post, editNext){
      if(!editNext)
        this.closeAddUpdateDialog();
      post.commit();
      return post.save()
        .then(e => {
          if(editNext){
            this.activePost = this.postDuplicate(post);
            this.editNext = editNext;
          }
          else {
            this.activePost = false;
            this.editNext = false;
          }
        })
        .catch(err => {
          this.$store.commit('showMessage', { type: 'error', text: err.message });
        });
    },

    labelQueryChanged(newValue){
      const { Post } = this.$FeathersVuex.api;
      Post.find(this.postsParams);
    },

  },

}

</script>

<style scoped>
.cc{
  width: 100%;
  height: 100%;
}
.cc img{
  width: 100%;
  height: auto;
}
@supports(object-fit: cover){
    .cc img{
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
}
tr {
  height: 77px;
}

td img {
  text-align: center;
}

.search-label-input {
  margin-top: 25px;
  max-width: 300px;
}

.search-combobox {
  margin-top: 25px;
  max-width: 400px;
}
.sticky-table-header {
  position: sticky;
  top: 60px;
}
.container-1 {
  display: flex;
  width:100%;
  height:100%;
}
.col {
  width: 100%;
  height: 280px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.nowrap-overflow {
  white-space: nowrap ;
  word-break: normal;
  overflow: hidden ;
  text-overflow: ellipsis;
}

</style>
