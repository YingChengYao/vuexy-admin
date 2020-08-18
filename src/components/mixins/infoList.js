export default {
  data() {
    return {
      currentPage: 1,
      totalItems: 0,
      itemsPerPage: 10,
      descriptionItems: [10, 20, 50, 200],
      tableData: [],
      searchInfo: {},

      isUseExpand: false
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    }
  },
  watch: {
    currentPage() {
      this.getTableData();
    }
  },
  methods: {
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.getTableData();
    },
    changeCurrentPage(val) {
      this.currentPage = val;
      this.getTableData();
    },
    async getTableData(
      pageIndex = this.currentPage,
      pageSize = this.itemsPerPage
    ) {
      const table = await this.listApi({
        pageIndex,
        pageSize,
        ...this.searchInfo
      });
      const data = JSON.parse(table.message);
      console.log("list:", data);
      this.tableData = data.Items;
      this.totalItems = data.TotalItems;
      if(isUseExpand){

      }
    },
  }
};
