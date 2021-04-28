const defaultPagination = {
  skip: 0,
  limit: 10,
  total: 10
};

export default function(modelName){
  return {
    data(){
      return {
        page: 1,
        skip: 0,
      }
    },

    computed: {
      pagination(){
        const paginationData = this[modelName + 'PaginationData'][modelName + 'Pagination'];
        if(!paginationData)
          return defaultPagination; 
        const mostRecent = paginationData.mostRecent;
        return {
          total: mostRecent.total,
          limit: mostRecent.pageParams.$limit,
          skip: mostRecent.pageParams.$skip
        };
      }
    },
  
    methods: {
      paginationChanged(newVal){
        this.skip = (newVal - 1) * this.pagination.limit;
      }
    }

  }
} 
