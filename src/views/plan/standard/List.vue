<template>
  <div id class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive">
      <plan-standard-edit
        @closePop="closePop"
        @loadData="loadData"
        :standardID="standardID"
        :planID="planID"
        :key="timer"
        :mark="mark"
        v-if="popupActive"
      />
    </vs-popup>

    <div class="vx-card p-6">
      <vx-table
        ref="table"
        :items="standards"
        :totalItems="totalItems"
        :pageSize="10"
        :multipleCheck="multipleCheck"
        @loadData="loadData"
      >
        <template slot="header">
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">制定标准</vs-button>
        </template>
        <template slot="thead-header">
          <vs-th>套餐级别</vs-th>
          <vs-th>限定职位</vs-th>
          <vs-th>修改时间</vs-th>
          <vs-th>操作</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.Standard }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.ModifyName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.ModifyTime | formatDate }}</p>
          </vs-td>
          <vs-td class="whitespace-no-wrap">
            <span class="text-primary" size="small" type="border" @click.stop="editData(item.tr)">编辑</span>
          </vs-td>
        </template>
      </vx-table>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import PlanStandardEdit from "views/plan/standard/Edit";

import { getStandards } from "@/http/plan.js";
export default {
  components: {
    AgGridVue,
    PlanStandardEdit,
  },
  props: {
    multipleCheck: {
      type: Boolean,
      default: false,
    },
    planID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      //Page
      standards: [],
      totalItems: 0,

      // Pop
      title: null,
      popupActive: false,
      standardID: null,
      timer: "",
      mark: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.loadData();
  },
  watch: {},
  methods: {
    loadData() {
      if (!this.planID) return;
      let para = {
        pageIndex: this.$refs.table.currentPage,
        pageSize: this.$refs.table.itemsPerPage,
        planID: this.planID,
      };

      getStandards(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.standards = data.Items;
          this.totalItems = data.TotalItems;
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
      this.standardID = null;
      this.popupActive = true;
      this.title = "添加员工信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(tr) {
      console.log(tr);
      this.standardID = tr.ID;
      this.popupActive = true;
      this.title = "修改员工信息";
      this.mark = "edit";
      this.handleLoad();
    },
    closePop() {
      this.popupActive = false;
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    //#endregion
  },
};
</script>

<style lang="scss">
</style>
