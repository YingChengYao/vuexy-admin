<template>
  <div class="data-list-container">
    <vs-popup fullscreen :title="title" :active.sync="popupActive">
      <plan-edit
        v-if="popupActive"
        @closePop="closePop"
        @loadData="loadData"
        @changeEmployeePop="changeEmployeePop"
        @changeStandardPop="changeStandardPop"
        @delStandard="delStandard"
        @delEmployee="delEmployee"
        @bindEmployee="bindEmployee"
        @bindStandard="bindStandard"
        @bindPhysical="bindPhysical"
        :planId="planId"
        :key="timer"
        :mark="mark"
        :workers="workers"
        :standards="standards"
      />
<!-- 
      <vs-popup title="添加标准" :active.sync="popupActiveStandard">
        <standard-add :data="standardData" @closePop="closeStandardPop" @addStandard="addStandard" />
      </vs-popup>
      <vs-popup fullscreen title="添加职工" :active.sync="popupActiveEmployee">
        <staff-employee-list
          ref="employee"
          :isPop="true"
          @closePop="closeEmployeePop"
          @saveEmployeeSelected="saveEmployeeSelected"
        />
      </vs-popup> -->
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
      <vs-table ref="table" stripe :data="plans">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <vs-th>编号</vs-th>
          <vs-th>计划名称</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>状态</vs-th>
          <vs-th>类型</vs-th>
          <vs-th>是否锁定</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>创建时间</vs-th>
          <vs-th>操作</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p>{{ indextr+1 }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PlanName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Sort }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.StatusName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PlanTypeName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.IsLocked?'是':'否' }}</p>
              </vs-td>
              <vs-td>
                <p class="product-category">{{ tr.ModifyName}}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.ModifyTime | formatDate }}</p>
              </vs-td>
              <vs-td class="whitespace-no-wrap">
                <span
                  class="text-primary px-2"
                  size="small"
                  type="border"
                  style="display:display"
                  @click.stop="editData(tr.ID)"
                  v-if="tr.Status==1"
                >编辑</span>
                <span
                  class="text-primary px-2"
                  size="small"
                  type="border"
                  @click.stop="submitMePlan(tr.ID)"
                >提交</span>
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
    </div>
    <div class="con-pagination-table vs-table--pagination">
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
</template>

<script>
import PlanEdit from "./Edit";
import StandardAdd from "./standard/Edit";
import StaffEmployeeList from "../staff/employee/List";
import { getPlans, submitPlan } from "@/http/plan.js";
export default {
  components: {
    PlanEdit,
    StandardAdd,
    StaffEmployeeList
  },
  data() {
    return {
      //Page
      plans: [],
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,

      //filter
      planNameInput: null,
      isLockedSelect: false,
      isLockedSelectOptions: [
        {
          name: "请选择",
          value: null
        },
        {
          name: "是",
          value: true
        },
        {
          name: "否",
          value: false
        }
      ],

      // Pop
      title: null,
      popupActive: false,
      planId: null,
      timer: "",
      mark: null,
      popupActiveStandard: false,
      standardData: {},
      popupActiveEmployee: false,
      workers: [],
      standards: []
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        mecid: userInfo.mecID,
        isLocked: this.isLockedSelect
      };

      if (this.planNameInput) {
        para.planName = this.planNameInput;
      }

      getPlans(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.plans = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          console.log("计划列表：", this.plans);
        }
      });
    },
    submitMePlan(id) {
      let para = {
        id: id
      };
      submitPlan(para).then(res => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "Success",
            text: res.message,
            color: "success"
          });
          this.loadData();
        }
      });
    },

    //#region 弹窗
    addNewData() {
      this.planId = null;
      this.popupActive = true;
      this.title = "添加体检计划";
      this.mark = "add";
      this.handleLoad();
      this.workers = [];
      this.standards = [];
      this.$refs.employee.initCheckedGroup();
    },
    editData(id) {
      this.planId = id;
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
    //职工
    changeEmployeePop(data) {
      this.popupActiveEmployee = data;
      this.$refs.employee.loadData();
    },
    saveEmployeeSelected(data) {
      this.workers = data;
    },
    closeEmployeePop() {
      this.popupActiveEmployee = false;
    },
    bindEmployee(data) {
      this.workers = data;
    },
    bindStandard(data) {
      this.standards = data;
    },
    bindPhysical(data) {},
    //标准
    changeStandardPop(data) {
      this.popupActiveStandard = data;
    },
    closeStandardPop() {
      this.popupActiveStandard = false;
    },
    addStandard(data) {
      this.standardData = {
        Positions: null
      };
      this.standards.push(data);
    },
    delStandard(data) {
      if (this.standards.length > 0) {
        this.standards.map((item, index) => {
          if (item.Standard === data.Standard) {
            this.standards.splice(index, 1);
          }
        });
      }
    },
    delEmployee(data) {
      if (this.workers.length > 0) {
        this.workers.map((item, index) => {
          if (item.ID === data) {
            this.workers.splice(index, 1);
          }
        });
      }
    },
    //#endregion

    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.currentPage = 1;
      this.loadData();
    }
  },
  mounted() {
    this.loadData();
  },
  watch: {
    currentPage() {
      this.loadData();
    }
  }
};
</script>

<style lang="scss">
</style>
