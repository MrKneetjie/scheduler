export default function(Model, searchParam, timeParam){
  return {
  
    data(){
      return {
        addUpdateDialog: false,
        activeItem: false,
        searchQuery: '',
      }
    },

    computed: {

      actionsDisabled(){
        if(this.activeItem && this.activeItem._id)
          return false;
        return true;
      },

      addButtonIcon(){
        if(this.activeUser)
          return 'mdi-checkbox-multiple-blank-circle';
        return 'mdi-plus-circle';
      },

      getActiveItem(){
        if(this.activeItem)
          return this.activeItem.clone();
        return new this.$FeathersVuex.api[Model]({}).clone();
      },

      queryParams(){
        if(this.searchQuery && this.searchQuery.length > 0)
          return { 
            [searchParam]: {
              $regex: new RegExp(this.searchQuery, 'i')
            }
          }
        return {};
      },
    },

    methods: {

      addUpdate(item){
        this.closeAddUpdateDialog();
        item.commit();
        item.save();
      },

      closeAddUpdateDialog(){
        this.addUpdateDialog = false;
        this.activeItem = false;
      },

      //dateTimeChanged(dateTime, setter){
      //  console.log(setter);
      //  if(dateTime)
      //    this.activeItem[timeParam] = dateTime;
      //},

      rowClick(item){
        if(!this.activeItem || (this.activeItem._id !== item._id))
          this.activeItem = item;
        else
          this.activeItem = false;
      },

      rowSelected(item){
        if(!this.activeItem || (this.activeItem._id !== item._id))
          return "";
        return "grey darken-2";
      },

      search(param){

      },

      openAddUpdateDialog(){
        this.addUpdateDialog = true;
      },

      deleteItem(){
        if(!this.activeItem)
          return;
        this.activeItem.remove({});
        this.activeItem = false;
      },
    }
  }
};
