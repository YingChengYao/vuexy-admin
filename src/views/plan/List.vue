<template>
  <div class="data-list-container">
    <vs-popup fullscreen :title="title" :active.sync="popupActive">
      <plan-edit
        v-if="popupActive"
        @closePop="closePop"
        @loadData="loadData"
        :planID="planID"
        :key="timer"
        :mark="mark"
        :step="step"
      />
    </vs-popup>

    <vs-popup fullscreen :title="title" :active.sync="popupViewPlan">
      <plan-show v-if="popupViewPlan" @closePop="closeViewPlanPop" :planID="planID" />
    </vs-popup>
    <vs-popup fullscreen :title="title" :active.sync="popupViewPackage">
      <plan-show-package v-if="popupViewPackage" @closePop="closeViewPackagePop" :planID="planID" />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">计划名称名称</label>
        <vs-input
          placeholder
          v-model="searchInfo.planName"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />

        <label class="vx-col label-name px-2">状态</label>
        <v-select
          v-model="searchInfo.status"
          label="Name"
          value="Value"
          :options="planStatusOptions"
          class="vx-col md:w-1/6 sm:w-1/2 w-full mx-2"
          :reduce="m => m.Value"
        />
        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vx-table
        ref="table"
        :items="plans"
        :totalItems="totalItems"
        :pageSize="10"
        @loadData="loadData"
      >
        <template slot="header">
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
        </template>
        <template slot="thead-header">
          <vs-th>计划名称</vs-th>
          <vs-th>状态</vs-th>
          <vs-th>体检模式</vs-th>
          <vs-th>参与人数</vs-th>
          <vs-th>体检周期</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>修改时间</vs-th>
          <vs-th>操作</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.PlanName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.StatusName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.PlanTypeName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.PlanEmployeeCount }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.StartTime | formatDate("yyyy-MM-dd") }}到{{ item.tr.EndTime | formatDate("yyyy-MM-dd")}}</p>
          </vs-td>
          <vs-td>
            <p class="product-category">{{ item.tr.ModifyName}}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.ModifyTime | formatDate }}</p>
          </vs-td>
          <vs-td class="whitespace-no-wrap">
            <span
              class="text-primary px-2"
              size="small"
              type="border"
              style="display:display"
              @click.stop="editData(item.tr)"
              v-if="[0,1].indexOf(item.tr.PlanStatus)!=-1"
            >编辑</span>
            <span
              class="text-primary px-2"
              size="small"
              type="border"
              @click.stop="confirmSubmitPlan(item.tr.ID)"
              v-if="[1].indexOf(item.tr.PlanStatus)!=-1"
            >提交</span>
            <span
              class="text-primary px-2"
              size="small"
              type="border"
              @click.stop="confirmAuditPlan(item.tr)"
              v-if="[2].indexOf(item.tr.PlanStatus)!=-1"
            >审核</span>
            <span
              class="text-primary px-2"
              size="small"
              type="border"
              @click.stop="abortPlan(item.tr)"
              v-if="[2].indexOf(item.tr.PlanStatus)!=-1"
            >中止</span>
            <span
              class="text-primary px-2"
              size="small"
              type="border"
              @click.stop="viewPlan(item.tr.ID)"
            >查看计划</span>
            <span
              class="text-primary px-2"
              size="small"
              type="border"
              v-if="item.tr.PlanType==1 && [2,3].indexOf(item.tr.PlanStatus)!=-1"
              @click.stop="viewPackage(item.tr.ID)"
            >查看套餐</span>
          </vs-td>
        </template>
        <template slot="paginationright">
          <slot name="paginationright"></slot>
        </template>
      </vx-table>
    </div>
  </div>
</template>

<script>
import PlanEdit from "./Edit";
import PlanShow from "./Show";
import PlanShowPackage from "./ShowPackage";
import { getPlans, submitPlan, abortPlan, auditPlan } from "@/http/plan.js";
import { getPlanStatusDataSource } from "@/http/data_source.js";
export default {
  components: {
    PlanEdit,
    PlanShow,
    PlanShowPackage,
  },
  data() {
    return {
      //Page
      plans: [],
      totalItems: 0,

      //filter
      searchInfo: {},
      planStatusOptions: [],

      // Pop
      title: null,
      popupActive: false,
      planID: "",
      timer: "",
      mark: null,
      popupActiveStandard: false,
      standardData: {},
      popupActiveEmployee: false,
      step: 0,
      //查看计划弹窗
      popupViewPlan: false,
      //查看套餐
      popupViewPackage: false,
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.$refs.table.currentPage,
        pageSize: this.$refs.table.itemsPerPage,
        mecId: userInfo.mecID,
        ...this.searchInfo,
      };

      getPlans(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.plans = data.Items;
          this.totalItems = data.TotalItems;
        }
      });
    },
    async loadPlanStatus() {
      await getPlanStatusDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.planStatusOptions = data;
          // if (data.length > 0) {
          //   this.searchInfo.status = data[0].Value;
          // }
        }
      });
    },
    confirmSubmitPlan(id) {
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: `提交体检计划`,
        text: "该计划提交后将不可更改",
        acceptText: "确认",
        cancelText: "取消",
        accept: () => {
          let para = {
            planID: id,
          };
          submitPlan(para).then((res) => {
            if (res.resultType == 0) {
              this.$vs.notify({
                title: "成功",
                text: res.message,
                color: "success",
              });
              this.loadData();
            }
          });
        },
      });
    },
    confirmAuditPlan(tr) {
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: `审核体检计划`,
        text: "是否确认同意该体检计划",
        acceptText: "确认",
        cancelText: "取消",
        accept: () => {
          let para = {
            planID: tr.ID,
          };
          auditPlan(para).then((res) => {
            if (res.resultType == 0) {
              this.$vs.notify({
                title: "成功",
                text: `${tr.PlanName}审核成功`,
                color: "success",
              });
              this.loadData();
            }
          });
        },
      });
    },
    abortPlan(tr) {
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: `中止体检计划`,
        text: "是否确认中止该体检计划！",
        acceptText: "确认",
        cancelText: "取消",
        accept: () => {
          let para = {
            planID: tr.ID,
          };
          abortPlan(para).then((res) => {
            if (res.resultType == 0) {
              this.$vs.notify({
                title: "成功",
                text: `${tr.PlanName}中止成功`,
                color: "success",
              });
              this.loadData();
            }
          });
        },
      });
    },
    //#region 弹窗
    addNewData() {
      this.planID = "";
      this.popupActive = true;
      this.title = "添加体检计划";
      this.mark = "add";
      this.step = 0;
      this.handleLoad();
    },
    editData(tr) {
      this.planID = tr.ID;
      this.step = tr.PlanStep;
      this.popupActive = true;
      this.title = "修改体检计划信息";
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
    //#region 查看计划弹窗
    viewPlan(id) {
      this.planID = id;
      this.popupViewPlan = true;
      this.title = "查看体检计划";
      this.mark = "view_plan";
      this.handleLoad();
    },
    closeViewPlanPop() {
      this.popupViewPlan = false;
    },
    //#endregion
    //#region 查看套餐
    viewPackage(id) {
      this.planID = id;
      this.popupViewPackage = true;
      this.title = "查看套餐";
      this.mark = "view_package";
      this.handleLoad();
    },
    closeViewPackagePop() {
      this.popupViewPackage = false;
    },
    //#endregion
  },
  mounted() {
    this.loadPlanStatus();
    this.loadData();
  },
  watch: {},
};
</script>

<style lang="scss">
</style>
