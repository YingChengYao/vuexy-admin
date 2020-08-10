export default {
  data() {
    return {
      currentPage: 1,
      totalItems: 10,
      itemsPerPage: 3,
      descriptionItems: [10, 20, 50, 200],
      tableData: [],
      searchInfo: {}
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    }
  },
  watch: {
    currentPage() {
      alert(this.currentPage);
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
    async getTableData(page = this.currentPage, pageSize = this.itemsPerPage) {
      debugger;
      const table = await this.listApi({ page, pageSize, ...this.searchInfo });
      const data = JSON.parse(table.message);
      console.log("data:", data);
      this.tableData = data.Items;
      this.totalItems = data.TotalItems;
    }
  }
};
