<template>
  <div class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive" v-if="popupActive">
      <unit-edit
        @closePop="closePop"
        @loadData="getTableData"
        :positionID="positionID"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">职位名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="searchInfo.positionName"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <label class="vx-col label-name px-2">状态</label>
        <v-select
          v-model="dataStatus"
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
        :items="positions"
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
import UnitEdit from "./Edit";
import {
  getPositions,
  editPosition,
  getPositionForEmployee,
} from "@/http/staff.js";
import { getDataStatusDataSource } from "@/http/data_source.js";
import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";
export default {
  mixins: [infoList],
  components: {
    UnitEdit,
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
    operateName: {
      type: Array,
      default: () => ["edit"],
    },
  },
  data() {
    return {
      //Page
      positions: [],
      selected: [],
      searchInfo: {},
      listApi: getPositions,
      cloumns: [
        { headerName: "职位名称", field: "PositionName" },
        { headerName: "排序", field: "Sort" },
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
            name: "edit",
            title: "编辑",
            show: this.operateName.indexOf("edit") !== -1,
            method: (index, row) => {
              this.editData(row.ID);
            },
          },
        ],
      },

      //filter
      statusOptions: [],

      // Pop
      title: null,
      popupActive: false,
      positionID: null,
      timer: "",
      mark: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.loadDataStatus().then((val) => {
      this.getTableData();
    });
  },
  methods: {
    async getTableData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        companyId: userInfo.companyID,
        ...this.searchInfo,
      };
      await getPositions(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.positions = data.Items;
          this.totalItems = data.TotalItems;
        }
      });
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
    loadSelectedData(data) {
      if (!Array.isArray(data) || !data.length > 0) return;
      this.selected = data;
      this.$refs.table.initCheckedItems(this.selected);
    },
    //#region 弹窗
    addNewData() {
      this.positionID = null;
      this.popupActive = true;
      this.title = "添加职位信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.positionID = id;
      this.popupActive = true;
      this.title = "修改职位信息";
      this.mark = "edit";
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },
  },

  watch: {},
};
</script>

<style lang="scss">
</style>
