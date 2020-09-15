<template>
  <div class="data-list-container">
    <package-type-data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      @loadData="getTableData"
      :data="sidebarData"
    />

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">套餐类型名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="searchInfo.typeName"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <label class="vx-col label-name px-2">状态</label>
        <v-select
          v-model="searchInfo.status"
          label="Name"
          value="Value"
          :options="statusOptions"
          class="vx-col md:w-1/6 sm:w-1/2 w-full mx-2"
          :reduce="m => m.Value"
        />
        <vs-button class="vx-col" color="primary" type="border" @click="getTableData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <qr-table ref="table" :items="tableData" :cloumns="cloumns" :operates="operates">
        <template slot="header">
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
        </template>
      </qr-table>
      <div class="con-pagination-table vs-table--pagination">
        <vs-pagination
          :total="totalPage"
          v-model="currentPage"
          :pagedown="true"
          :totalItems="totalItems"
          @changePageMaxItems="changePageMaxItems"
          :pagedownItems="descriptionItems"
          :size="itemsPerPage"
        ></vs-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import PackageTypeDataViewSidebar from "./PackageTypeDataViewSidebar";
import { getPackageTypes } from "@/http/package.js";
import { getDataStatusDataSource } from "@/http/data_source.js";
import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";
export default {
  mixins: [infoList],
  components: {
    PackageTypeDataViewSidebar,
  },
  data() {
    return {
      types: [],
      listApi: getPackageTypes,
      cloumns: [
        { headerName: "套餐类型名称", field: "TypeName" },
        { headerName: "排序", field: "Sort" },
        { headerName: "状态", field: "StatusName" },
        { headerName: "修改人", field: "ModifyName" },
        {
          headerName: "修改时间",
          field: "ModifyTime",
          formatter: (value) => {
            if (value) return formatTimeToStr(value);
          },
        },
      ],
      operates: {
        list: [
          {
            title: "编辑",
            show: true,
            method: (index, row) => {
              this.editData(row);
            },
          },
        ],
      },
      statusOptions: [],

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
    };
  },
  computed: {},
  methods: {
    async loadDataStatus() {
      await getDataStatusDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.statusOptions = data;
          if (data.length > 0) {
            this.searchInfo.status = data[0].Value;
          }
        }
      });
    },
    addNewData() {
      this.sidebarData = {
        title: "添加套餐分类",
        mark: "add",
      };
      this.toggleDataSidebar(true);
    },
    editData(data) {
      this.sidebarData = data;
      this.sidebarData.title = "修改套餐分类";
      this.sidebarData.mark = "edit";
      this.toggleDataSidebar(true);
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
  },
  mounted() {
    this.loadDataStatus().then((val) => {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.searchInfo.mecId = userInfo.unitId;
      this.getTableData();
    });
  },
  watch: {},
};
</script>

<style lang="scss">
</style>
