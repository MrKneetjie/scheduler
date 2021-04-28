<template>
  <div>
    <message/>
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
    </v-simple-table>
    <div class="container-1">
      <v-flex d-flex>
        <v-layout wrap>
          
          
        </v-layout>
      </v-flex>
    </div>
   
</div>
  
</template>

<script>
import { makeFindMixin } from 'feathers-vuex';
import Pagination from '@/mixins/Pagination';
import Message from '@/components/Message';
import PostBulkAddUpdateDialog from '@/components/BulkPostAddUpdate';



const defaultPost = { postAt: new Date() };
export default {

  layout: 'dashboard_topbar',
  components: { },

  //middleware: [ 'nonadmin' ],

  mixins: [ 
    makeFindMixin({ service: 'accounts' }),
    makeFindMixin({ service: 'posts', watch: 'skip' }),
    makeFindMixin({ service: 'labels' }),
    Pagination('posts')
  ],

  computed: {
     
  },

  data(){
    return {
     
    }
  },

  methods: {
    
   
  },

}

</script>

