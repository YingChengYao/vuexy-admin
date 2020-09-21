<template>
  <div class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive" v-if="popupActive">
      <project-item-edit
        v-if="popupActive"
        @closePop="closePop"
        @loadData="getTableData"
        :projectItemId="projectItemId"
        :mecId="mecId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">单项名称</label>
        <vs-input
          placeholder
          v-model="searchInfo.SingleName"
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
      <vs-row v-if="tableTitle">
        <span class="mb-4">{{tableTitle}}</span>
      </vs-row>
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
import ProjectItemEdit from "./Edit";
import { getProjectItems } from "@/http/package.js";
import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";
import { getDataStatusDataSource } from "@/http/data_source.js";
export default {
  mixins: [infoList],
  components: {
    ProjectItemEdit,
  },
  props: {
    isPop: {
      type: Boolean,
      default: false,
    },
    multipleCheck: {
      type: Boolean,
      default: false,
    },
    tableTitle: {
      type: String,
      default: null,
    },
    isInitData: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      //Page
      selected: [],
      listApi: getProjectItems,
      cloumns: [
        { headerName: "单项名称", field: "SingleName" },
        {
          headerName: "是否作为项目使用",
          field: "IsOptional",
          formatter: (value) => {
            return value ? "是" : "否";
          },
        },
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
        ],
      },
      statusOptions: [],
      mecId: "",
      // Pop
      title: null,
      popupActive: false,
      projectItemId: null,
      timer: "",
      mark: null,
    };
  },
  computed: {},
  created() {
    this.loadDataStatus().then((val) => {
      if (this.isInitData) this.getTableData();
    });
  },
  methods: {
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
    loadData(mecId) {
      this.mecId = mecId;
      this.searchInfo.mecId = mecId;
      this.listApi = getProjectItems;
      this.getTableData();
    },
    //#region 弹窗
    addNewData() {
      this.projectItemId = null;
      this.popupActive = true;
      this.title = "添加项目单项信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.projectItemId = id;
      this.popupActive = true;
      this.title = "修改项目单项信息";
      this.mark = "edit";
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
  mounted() {},
  watch: {},
};
</script>

<style lang="scss">
</style>
