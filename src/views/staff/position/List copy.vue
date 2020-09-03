<template>
  <div class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive" v-if="popupActive">
      <unit-edit
        @closePop="closePop"
        @loadData="loadData"
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
        <vs-select
          v-model="searchInfo.status"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2 select-large"
        >
          <vs-select-item
            v-for="(item,index) in statusOptions"
            :key="index"
            :value="item.Value"
            :text="item.Name"
            class="w-full"
          />
        </vs-select>

        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
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

      <vx-table
        ref="table"
        v-model="selected"
        :items="positions"
        @loadData="loadData"
        :totalItems="totalItems"
        :pageSize="10"
        :multipleCheck="multipleCheck"
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
        <template slot="thead-header">
          <vs-th>职位名称</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>创建时间</vs-th>
          <vs-th v-if="!isPop">操作</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.PositionName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Sort }}</p>
          </vs-td>
          <vs-td>
            <p class="product-category">{{ item.tr.ModifyName}}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.ModifyTime | formatDate }}</p>
          </vs-td>
          <vs-td v-if="!isPop">
            <span class="text-primary" size="small" type="border" @click.stop="editData(item.tr)">编辑</span>
          </vs-td>
        </template>
        <template slot="pagination">
          <slot></slot>
        </template>
      </vx-table>
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
  },
  data() {
    return {
      //Page
      positions: [],
      //totalItems: 2,
      selected: [],
      searchInfo: {},
      listApi: getPackages,
      cloumns: [
        { headerName: "职位名称", field: "PackageName" },
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
      this.loadData();
    });
  },
  methods: {
    async loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.$refs.table.currentPage,
        pageSize: this.$refs.table.itemsPerPage,
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
    editData(tr) {
      this.positionID = tr.ID;
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
