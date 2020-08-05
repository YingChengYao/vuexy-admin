<template>
  <div class="data-list-container">
    <vs-popup fullscreen :title="title" :active.sync="popupActive">
      <exclusive-package-list
        @closePop="closePop"
        @loadData="loadData"
        @openPackageEditPop="openPackageEditPop"
        :planId="planId"
        :key="timer"
        :mark="mark"
      />
      <vs-popup fullscreen :title="titlePackageEdit" :active.sync="popupActivePackageEdit">
        <exclusive-package-edit
          v-if="popupActivePackageEdit"
          @closePackageEditPop="closePackageEditPop"
          @loadData="loadData"
          :packageId="packageId"
          :planId="planId"
          :key="timer"
          :mark="markPackageEdit"
        />
      </vs-popup>
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">计划名称名称</label>
        <vs-input placeholder v-model="planNameInput" class="vx-col md:w-1/6 sm:w-1/2 w-full px-2" />
        <!-- <label class="vx-col label-name px-2">是否锁定</label>
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
        </vs-select>-->
        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
        <vs-button class="vx-col ml-4" color="primary" type="border" @click="refreshData">刷新</vs-button>
      </vs-row>
    </vx-card>

    <vx-card title="体检计划列表" class="p-6">
      <vx-table
        ref="table"
        :items="plans"
        :totalPage="totalPage"
        :totalItems="totalItems"
        :pageSize="10"
        @loadData="loadData"
      >
        <template slot="thead-header">
          <vs-th>单位</vs-th>
          <vs-th>计划名称</vs-th>
          <vs-th>状态</vs-th>
          <vs-th>参与人数</vs-th>
          <vs-th>体检周期</vs-th>

          <vs-th>操作</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.CompanyName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.PlanName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.StatusName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.PlanEmployeeCount }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.StartTime | formatDate("yyyy-MM-dd") }}到{{ item.tr.EndTime | formatDate("yyyy-MM-dd")}}</p>
          </vs-td>
          <vs-td class="whitespace-no-wrap">
            <span
              class="text-primary px-2"
              size="small"
              type="border"
              @click.stop="addPackage(item.tr)"
            >配置套餐</span>
            <span
              class="text-primary"
              size="small"
              type="border"
              @click.stop="lookPackage(item.tr.ID)"
            >查看套餐</span>
          </vs-td>
        </template>
      </vx-table>
    </vx-card>
  </div>
</template>

<script>
import ExclusivePackageEdit from "views/medical_examination_center/exclusive_package/Edit";
import ExclusivePackageList from "views/medical_examination_center/exclusive_package/List";

import { getPlansForPhysical } from "@/http/plan.js";
export default {
  components: {
    ExclusivePackageEdit,
    ExclusivePackageList,
  },
  data() {
    return {
      //Page
      plans: [],
      totalPage: 0,
      totalItems: 0,
      planNameInput: null,

      // Pop
      title: null,
      popupActive: false,
      planId: null,
      timer: "",
      mark: null,
      popupActivePackageEdit: false,
      titlePackageEdit: null,
      markPackageEdit: null,
      packageId: null,
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.$refs.table.currentPage,
        pageSize: this.$refs.table.itemsPerPage,
      };

      getPlansForPhysical(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("计划列表：", data);
          this.plans = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    refreshData() {
      this.$refs.table.changeCurrentPage(1);
      this.loadData();
    },
    //#region 弹窗
    addPackage(data) {
      this.planId = data.ID;
      this.popupActive = true;
      this.title = "配置专属套餐";
      this.mark = "addPackage";
      this.handleLoad();
    },
    lookPackage(id) {
      this.planId = id;
      this.popupActive = true;
      this.title = "查看专属套餐";
      this.mark = "lookPackage";
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },

    //套餐
    //控制套餐弹窗
    openPackageEditPop(data, mark) {
      if (mark == "add") {
        this.titlePackageEdit = "添加专属套餐信息";
        this.markPackageEdit = "add";
      } else if (mark == "edit") {
        console.log("packdata:", data);
        this.packageId = data;
        this.markPackageEdit = "edit";
        this.titlePackageEdit = "修改专属套餐信息";
      }
      this.popupActivePackageEdit = true;
    },
    closePackageEditPop() {
      this.popupActivePackageEdit = false;
    },
    //#endregion
  },
  created() {},
  mounted() {
    this.loadData();
  },
  watch: {},
};
</script>

<style lang="scss">
</style>
