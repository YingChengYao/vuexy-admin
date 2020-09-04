<template>
  <div id class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive" v-if="popupActive">
      <package-edit
        @closePop="closePop"
        @loadData="getTableData"
        :packageID="packageID"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>
    <vs-popup
      fullscreen
      :title="titlePackageDeployProject"
      :active.sync="popupActivePackageDeployProject"
    >
      <package-deploy-project
        v-if="popupActivePackageDeployProject"
        @closePop="closePackageDeployProjectPop"
        @loadData="getTableData"
        :packageID="packageID"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">套餐名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="searchInfo.packageName"
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
      <qr-table
        ref="table"
        v-model="selected"
        :items="tableData"
        :multipleCheck="multipleCheck"
        :cloumns="cloumns"
        :operates="operates"
      >
        <template slot="header">
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
        </template>
      </qr-table>

      <div class="flex mt-4">
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
import PackageEdit from "./Edit";
import PackageDeployProject from "./DeployProject";

import { getPackages } from "@/http/package.js";
import { getDataStatusDataSource } from "@/http/data_source.js";
import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";

export default {
  mixins: [infoList],
  components: {
    PackageEdit,
    PackageDeployProject,
  },
  props: {
    multipleCheck: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: [],
      listApi: getPackages,
      cloumns: [
        { headerName: "套餐名称", field: "PackageName" },
        { headerName: "套餐价格", field: "PackagePrice" },
        { headerName: "折扣", field: "Discount" },
        { headerName: "折扣价", field: "DiscountPrice" },
        {
          headerName: "婚姻状态",
          field: "MarriageName",
          template: () => {
            return (
              <vs-chip transparent color="sucess">
                0
              </vs-chip>
            );
          },
          render(row, column, index) {
            return `<vs-chip transparent color="sucess">${row.Marriage}</vs-chip>`;
          },
        },
        { headerName: "性别", field: "GenderName" },
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
              this.editData(row.ID);
            },
          },
          {
            title: "项目配置",
            show: true,
            method: (index, row) => {
              this.deployProject(row.ID);
            },
          },
        ],
      },

      //filter
      statusOptions: [],
      dataStatus: null,

      // Pop
      title: null,
      popupActive: false,
      packageID: null,
      timer: "",
      mark: null,

      //配置项目窗口
      popupActivePackageDeployProject: false,
      titlePackageDeployProject: null,
      timer: "",
      markPackageDeployProject: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.loadDataStatus().then((val) => {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.searchInfo.mecId = userInfo.mecID;
      this.getTableData();
    });
  },
  watch: {
    dataStatus(val) {
      this.searchInfo.status = val != null ? val.Value : val;
    },
  },
  methods: {
    async loadDataStatus() {
      await getDataStatusDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.statusOptions = data;
          console.log("this.statusOptions:", this.statusOptions);
          // if (data.length > 0) {
          //   this.searchInfo.status = data[0].Value;
          // }
        }
      });
    },
    addNewData() {
      this.packageID = "";
      this.popupActive = true;
      this.title = "添加套餐信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.packageID = id;
      this.popupActive = true;
      this.title = "修改套餐信息";
      this.mark = "edit";
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },
    deployProject(id) {
      this.popupActivePackageDeployProject = true;
      this.packageID = id;
      this.titlePackageDeployProject = "配置套餐项目";
      this.handleLoad();
    },
    closePackageDeployProjectPop() {
      this.popupActivePackageDeployProject = false;
    },
  },
};
</script>

<style lang="scss">
</style>
