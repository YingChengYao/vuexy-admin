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

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">计划名称名称</label>
        <vs-input placeholder v-model="planNameInput" class="vx-col md:w-1/6 sm:w-1/2 w-full px-2" />
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
        :items="plans"
        :totalPage="totalPage"
        :totalItems="totalItems"
        :pageSize="10"
        @loadData="loadData"
      >
        <template slot="header">
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
        </template>
        <template slot="thead-header">
          <vs-th>计划名称</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>状态</vs-th>
          <vs-th>类型</vs-th>
          <vs-th>参与人数</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>创建时间</vs-th>
          <vs-th>操作</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.PlanName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Sort }}</p>
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
              v-if="[0,1].indexOf(item.tr.Status)!=-1"
            >编辑</span>
            <span
              class="text-primary px-2"
              size="small"
              type="border"
              @click.stop="confirmSubmitPlan(item.tr.ID)"
              v-if="[1].indexOf(item.tr.Status)!=-1"
            >提交</span>
            <span
              class="text-primary px-2"
              size="small"
              type="border"
              @click.stop="confirmAuditPlan(item.tr.ID)"
              v-if="[2].indexOf(item.tr.Status)!=-1"
            >审核</span>
            <span
              class="text-primary px-2"
              size="small"
              type="border"
              @click.stop="confirmAuditPlan(item.tr.ID)"
            >查看计划</span>
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
import { getPlans, submitPlan } from "@/http/plan.js";
export default {
  components: {
    PlanEdit,
  },
  data() {
    return {
      //Page
      plans: [],
      totalPage: 0,
      totalItems: 0,

      //filter
      planNameInput: null,
      isLockedSelect: false,
      isLockedSelectOptions: [
        {
          name: "请选择",
          value: null,
        },
        {
          name: "是",
          value: true,
        },
        {
          name: "否",
          value: false,
        },
      ],

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

      activeConfirm: false,
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.$refs.table.currentPage,
        pageSize: this.$refs.table.itemsPerPage,
        mecid: userInfo.mecID,
        isLocked: this.isLockedSelect,
      };

      if (this.planNameInput) {
        para.planName = this.planNameInput;
      }

      getPlans(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.plans = data.Items;
          console.log("计划列表：", data);
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    confirmSubmitPlan(id) {
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: `提交体检计划`,
        text: "该计划提交后将不可更改",
        accept: () => {
          let para = {
            id: id,
          };
          submitPlan(para).then((res) => {
            if (res.resultType == 0) {
              this.$vs.notify({
                title: "Success",
                text: res.message,
                color: "success",
              });
              this.loadData();
            }
          });
        },
      });
    },
    confirmAuditPlan(id) {},
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
      debugger;
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
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.currentPage = 1;
      this.loadData();
    },
  },
  mounted() {
    this.loadData();
  },
  watch: {
    currentPage() {
      this.loadData();
    },
  },
};
</script>

<style lang="scss">
</style>
