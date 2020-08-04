<template>
  <div class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive">
      <unit-edit
        v-if="popupActive"
        @closePop="closePop"
        @loadData="loadData"
        :positionId="positionId"
        :positionData="positionData"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">职位名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="positionNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <label class="vx-col label-name px-2">是否锁定</label>
        <vs-select
          v-model="isLockedSelect"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2 select-large"
        >
          <vs-select-item
            v-for="(item,index) in isLockedSelectOptions"
            :key="index"
            :value="item.value"
            :text="item.name"
            class="w-full"
          />
        </vs-select>

        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vx-table
        ref="table"
        v-model="selected"
        :items="positions"
        @loadData="loadData"
        :totalPage="totalPage"
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
export default {
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
      totalPage: 0,
      totalItems: 2,
      selected: [],

      //filter
      positionNameInput: null,
      isLockedSelectOptions: [
        {
          name: "请选择",
          value: null,
        },
        {
          name: "否",
          value: false,
        },
        {
          name: "是",
          value: true,
        },
      ],
      isLockedSelect: false,

      // Pop
      title: null,
      popupActive: false,
      positionId: null,
      timer: "",
      mark: null,
      positionData: null,
    };
  },
  computed: {},
  created() {
    // if (this.multipleCheck) {
    //   this.$refs.table.checkedGroup = this.checkedGroup;
    // }
  },
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.$refs.table.currentPage,
        pageSize: this.$refs.table.itemsPerPage,
        companyId: userInfo.companyID,
        positionName: this.positionNameInput,
        islocked: this.isLockedSelect,
      };
      getPositions(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.positions = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    loadSelectedData(data) {
      this.selected = data;
      // this.initCheckedItems();
      this.$refs.table.initCheckedItems(this.selected);
    },
    // initCheckedItems() {
    //   if (!this.multipleCheck) return;
    //   if (this.positions.length > 0) {
    //     this.positions.map((item, index) => {
    //       if (this.selected.length > 0) {
    //         let val = this.selected.find((t) => t.ID === item.ID);
    //         item.isChecked = !val ? false : true;
    //       }
    //     });
    //     this.$refs.table.handleCheckboxAll();
    //   }
    // },
    //#region 弹窗
    addNewData() {
      this.positionId = null;
      this.popupActive = true;
      this.title = "添加职位信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(tr) {
      this.positionId = tr.ID;
      this.positionData = tr;
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
  mounted() {
    this.loadData();
  },
  watch: {},
};
</script>

<style lang="scss">
</style>
