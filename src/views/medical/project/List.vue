<template>
  <div id class="data-list-container">
    <vs-popup fullscreen :title="title" :active.sync="popupActive" v-if="popupActive">
      <project-edit
        v-if="popupActive"
        @closePop="closePop"
        @loadData="getTableData"
        :projectId="projectId"
        :key="timer"
        :mecId="mecId"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">项目名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="searchInfo.itemName"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />

        <label class="vx-col label-name px-2" v-if="!isComponent">状态</label>
        <v-select
          v-if="!isComponent"
          v-model="searchInfo.status"
          label="Name"
          value="Value"
          :options="statusOptions"
          class="vx-col md:w-1/6 sm:w-1/2 w-full mx-2"
          :reduce="m => m.Value"
        />

        <label class="vx-col label-name px-2" v-if="!isComponent">项目类型</label>
        <v-select
          v-if="!isComponent"
          v-model="searchInfo.itemTypeId"
          label="Name"
          value="Value"
          :options="projectTypeOptions"
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
          <vs-button
            v-if="!isPop"
            color="primary"
            type="border"
            class="mb-4 mr-4"
            @click="addNewData"
          >添加</vs-button>
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
import ProjectEdit from "./Edit";
import {
  getItems,
  getProjectsForPackage,
  deployProjectForPackage,
} from "@/http/package.js";
import { clone } from "@/common/utils/data/clone";
import {
  accAdd,
  accSubtr,
  accMul,
  accDivCoupon,
} from "@/common/utils/data/calc";
import {
  getDataStatusDataSource,
  getProjectTypeDataSource,
} from "@/http/data_source.js";
import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";

export default {
  mixins: [infoList],
  props: {
    packageID: {
      type: String,
      default: null,
    },
    isComponent: {
      type: Boolean,
      default: false,
    },
    multipleCheck: {
      type: Boolean,
      default: false,
    },
    isInitData: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ProjectEdit,
  },
  data() {
    return {
      //Pop
      popupActive: false,
      projectId: null,
      title: null,
      timer: "",

      statusOptions: [],
      searchInfo: {},
      projectTypeOptions: [],

      //Page
      selected: [],
      listApi: getItems,
      cloumns: [
        {
          headerName: "项目名称",
          field: "ItemName",
          expand: true,
          type: "expand",
          formatter: (value, row) => {
            return row.Children ? row.TypeName : value;
          },
        },
        { headerName: "项目价格", field: "ItemPrice" },
        { headerName: "婚姻状态", field: "MarriageName" },
        { headerName: "性别", field: "GenderName" },
        {
          headerName: "排序",
          field: "Sort",
          formatter: (value, row) => {
            return row.Children ? "" : value;
          },
        },
        { headerName: "状态", field: "StatusName" },
        { headerName: "修改人", field: "ModifyName" },
        {
          headerName: "修改时间",
          field: "ModifyTime",
          formatter: (value, row) => {
            if (value) return row.Children ? "" : formatTimeToStr(value);
          },
        },
        {
          headerName: "操作",
          field: "Action",
          isHide: this.isPop,
          render: (h, params) => {
            // v-if="!isPop"
            if (params.row.Children) return;
            return h(
              "span",
              {
                class: {
                  "text-primary": true,
                  "mr-2": true,
                  "cursor-pointer": true,
                },
                props: {
                  type: "border",
                  size: "small",
                },
                on: {
                  click: () => {
                    this.editData(params.row.ID);
                  },
                },
              },
              "编辑"
            );
          },
        },
      ],
      operates: {
        list: [],
      },

      //pop
      isPop: false,
      checkedGroup: [],
    };
  },
  computed: {},
  methods: {
    loadData(mecId) {
      this.mecId = mecId;
      this.searchInfo.mecId = mecId;
      this.listApi = getItems;
      this.getTableData();
    },
    async getTableData(
      pageIndex = this.currentPage,
      pageSize = this.itemsPerPage
    ) {
      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        ...this.searchInfo,
      };
      this.listApi(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("list:", data);
          this.totalItems = data.TotalItems;
          this.tableData = [];
          this.initData(data.Items, 0, null);
        }
      });
    },
    initData(items, level, parent) {
      if (!items) {
        return;
      }
      debugger;
      items.map((item, index) => {
        item = Object.assign({}, item, {
          parent: parent,
          level: level,
        });
        if (item.Children != undefined && item.Children.length > 0) {
          item = Object.assign({}, item, {
            isExpand: true,
            noUseTrCheckBox: true,
            hasChildren: true,
          });
        }
        if (typeof item.isChecked == "undefined") {
          item = Object.assign({}, item, {
            isChecked: false,
          });
        }
        if (typeof item.isHide == "undefined") {
          item = Object.assign({}, item, {
            isHide: false,
          });
        }
        this.tableData.push(item);

        if (item.Children) {
          this.initData(item.Children, level + 1, item.ID);
        }
      });
    },
    delProject(data) {
      let index = this.selected.findIndex((i) => i.ID === data.ID);
      if (index < 0) return;
      this.selected.splice(index, 1);
      this.$refs.table.initCheckedItems();
    },
    loadSelectedData(data) {
      if (!Array.isArray(data) || !data.length > 0) return;
      this.selected = data;
      this.$refs.table.initCheckedItems(this.selected);
    },
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
    async loadProjectTypeDataStatus() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        isSelect: true,
        mecId: userInfo.unitId,
      };
      await getProjectTypeDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.projectTypeOptions = data;
          // if (data.length > 0) {
          //   this.searchInfo.projectType = data[0].Value;
          // }
        }
      });
    },
    //#region 弹窗
    addNewData() {
      this.projectId = null;
      this.popupActive = true;
      this.title = "添加项目信息";
      this.handleLoad();
    },
    editData(id) {
      this.projectId = id;
      this.title = "修改项目信息";
      this.popupActive = true;
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },
    //#endregion
  },
  created() {
    this.isPop = this.packageID ? true : false;
    this.loadDataStatus().then((val) => {
      if (this.isInitData) this.getTableData();
    });
    // this.loadProjectTypeDataStatus();
  },
  mounted() {},
  watch: {
    selected() {
      this.$emit("checkHandle", this.selected);
    },
  },
};
</script>

<style lang="scss">
</style>
