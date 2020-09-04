<template>
  <div>
    <form-wizard
      ref="checkoutWizard"
      color="rgba(var(--vs-primary), 1)"
      :title="null"
      :subtitle="null"
      :hide-buttons="true"
      :startIndex="step"
    >
      <!-- tab 1 content -->
      <tab-content title="制定计划" icon="iconfont icon-tianxiexinxi">
        <form data-vv-scope="step-base">
          <div class="vx-row">
            <div class="vx-col md:w-1/4 w-full">
              <vs-input
                label="计划名称"
                class="w-full"
                v-model="data_local.PlanName"
                v-validate="'required'"
                name="计划名称"
              />
              <span
                class="text-danger text-sm"
                v-show="errors.has('step-base.计划名称')"
              >{{ errors.first('step-base.计划名称') }}</span>
            </div>
            <div class="vx-col md:w-1/4 w-full">
              <label class="vs-input--label">本次计划体检开始日期</label>
              <datepicker
                label="开始日期"
                format="yyyy-MM-dd"
                v-model="data_local.StartTime"
                name="开始日期"
                :language="languages.zh"
                @selected="selectedStartTime"
              ></datepicker>
              <span
                class="text-danger text-sm"
                v-show="errors.has('开始日期')"
              >{{ errors.first('开始日期') }}</span>
            </div>
            <div class="vx-col md:w-1/4 w-full">
              <label class="vs-input--label">本次计划体检结束日期</label>
              <datepicker
                label="结束日期"
                format="yyyy-MM-dd"
                v-model="data_local.EndTime"
                :language="languages.zh"
                @selected="selectedEndTime"
              ></datepicker>
            </div>
            <div class="vx-col md:w-1/4 w-full">
              <label class="vs-select--label">体检模式</label>
              <v-select
                v-model="data_local.PlanType"
                label="Name"
                value="Value"
                :options="planTypeOptions"
                :reduce="m => m.Value"
              />
            </div>
            <div class="vx-col w-full">
              <div class="mt-4">
                <label class="vs-input--label">备注</label>
                <vs-textarea
                  v-model="data_local.Remark"
                  height="100px"
                  counter="200"
                  v-validate="'max:200'"
                  name="备注"
                />
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('step-base.备注')"
                >{{ errors.first('step-base.备注') }}</span>
              </div>
            </div>
          </div>
        </form>
        <medical-center-list ref="medicalCenter" :multipleCheck="true" :isPlanPop="true"></medical-center-list>
        <div class="text-right mt-5">
          <span>
            <vs-button
              class="vx-col ml-auto"
              color="primary"
              @click="save_base_info"
              v-preventClick
            >保存</vs-button>
          </span>
          <span class="px-2">
            <vs-button class="vx-col ml-4" type="border" color="warning" @click="cancel">取消</vs-button>
          </span>
        </div>
      </tab-content>

      <!-- tab 2 content -->
      <tab-content title="职工" icon="iconfont icon-xinzengyuangong1" backButtonText>
        <staff-employee-list
          ref="employee"
          :isPop="true"
          :isShowWorkingStatus="false"
          :multipleCheck="true"
        ></staff-employee-list>
        <div class="text-right mt-5">
          <span>
            <vs-button
              class="vx-col ml-auto mt-2"
              type="border"
              color="warning"
              @click="prevTab"
            >上一步</vs-button>
          </span>
          <span class="px-4">
            <vs-button class="vx-col ml-auto mt-2" color="primary" @click="save_employee">下一步</vs-button>
          </span>
        </div>
      </tab-content>

      <!-- tab 3 content -->
      <tab-content title="体检级别" icon="iconfont icon-tianjiabiaozhun1">
        <plan-standard-list ref="standard" :planID="planID_local"></plan-standard-list>
        <div class="text-right mt-5">
          <span>
            <vs-button
              class="vx-col ml-auto mt-2"
              type="border"
              color="warning"
              @click="prevTab"
            >上一步</vs-button>
          </span>
          <span class="px-4">
            <vs-button
              class="vx-col ml-auto mt-2"
              color="primary"
              @click="savePlan"
              v-preventClick
            >保存</vs-button>
          </span>
          <span class="px-4">
            <vs-button class="vx-col ml-auto mt-2" color="primary" @click="confirmSubmitPlan">提交</vs-button>
          </span>
        </div>
      </tab-content>
    </form-wizard>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";
import draggable from "vuedraggable";
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";

import MedicalCenterList from "views/medical_center/List";
import StaffEmployeeList from "views/staff/employee/List";
import PlanStandardList from "views/plan/standard/List";

import {
  getMaritalDataSource,
  getGenderDataSource,
  getPlanTypeDataSource,
} from "@/http/data_source.js";
import { formatTimeToStr } from "@/common/utils/data/date";
import {
  addPlan,
  addOrEditEmployeeForPlan,
  editPlan,
  getPlanDetail,
  submitPlan,
  savePlan,
} from "@/http/plan.js";
import { getMedicalCenters } from "@/http/medical_center.js";

export default {
  name: "",
  components: {
    Datepicker,
    draggable,
    FormWizard,
    TabContent,
    MedicalCenterList,
    StaffEmployeeList,
    PlanStandardList,
  },
  props: {
    planID: {
      type: String,
      default: "",
    },
    mark: {
      type: String,
      default: "",
    },
    step: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      colors: ["primary", "success", "danger", "warning", "dark", "#24c1a0"],
      languages: lang,

      isShowStandard: false,

      data_local: {},
      planID_local: null,
      marriageOptions: [],
      genderOptions: [],
      planTypeOptions: [],
    };
  },
  computed: {},
  created() {
    this.planID_local = this.planID;
    this.loadMaritalStatus();
    this.loadGender();
    this.loadPlanTypeData();
  },
  mounted() {
    this.loadData();
  },
  watch: {},
  methods: {
    //#region 初始化数据
    loadData() {
      if (!this.planID_local) return;

      let para = {
        planID: this.planID_local,
      };
      getPlanDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data.Model;
          console.log("计划详情：", data);
          // data.PlanPhysical.map((item) => {
          //   item.ID = item.MecID;
          // });
          // data.PlanEmployee.map((item) => {
          //   item.ID = item.EmployeeID;
          // });
          this.$refs.medicalCenter.loadSelectedData(data.Physical);
          this.$refs.employee.loadSelectedData(data.Employee);
        }
      });
    },
    loadMaritalStatus() {
      getMaritalDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.marriageOptions = data;
        }
      });
    },
    loadGender() {
      getGenderDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.genderOptions = data;
          console.log("性别：", data);
        }
      });
    },
    loadPlanTypeData() {
      getPlanTypeDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.planTypeOptions = data;
          if (this.planTypeOptions.length > 0) {
            this.data_local.PlanType = this.planTypeOptions[0].Value;
          }
        }
      });
    },
    selectedStartTime(val) {
      // let start = formatTimeToStr(val, "yyyy-MM-dd");
      // if (!this.data_local.EndTime) return;
      // if (start > formatTimeToStr(this.data_local.EndTime, "yyyy-MM-dd")) {
      //   this.data_local.StartTime = null;
      // }
    },
    selectedEndTime(val) {
      // let end = formatTimeToStr(val, "yyyy-MM-dd");
      // if (!this.data_local.StartTime) return;
      // if (this.data_local.StartTime > end) {
      //   alert(1);
      // }
    },
    //#endregion
    //#region 基础信息
    save_base_info() {
      return new Promise(() => {
        this.$validator.validateAll("step-base").then((result) => {
          if (result) {
            let checkedGroup = this.$refs.medicalCenter.selected;
            debugger;
            if (!this.validBaseinfo()) return;

            let mecIDs = checkedGroup
              .map((obj) => {
                return obj.ID;
              })
              .join(",");

            let para = {
              planName: this.data_local.PlanName,
              startTime: this.data_local.StartTime,
              endTime: this.data_local.EndTime,
              planType: this.data_local.PlanType,
              remark: this.data_local.Remark,
              mecIDs: mecIDs,
            };

            if (this.planID_local) {
              para.ID = this.planID_local;
              editPlan(para).then((res) => {
                if (res.resultType == 0) {
                  this.$vs.notify({
                    title: "成功",
                    text: "修改体检计划成功",
                    color: "success",
                  });
                  this.$emit("loadData");
                  this.$refs.checkoutWizard.nextTab();
                }
              });
            } else {
              addPlan(para).then((res) => {
                if (res.resultType == 0) {
                  this.$vs.notify({
                    title: "成功",
                    text: "添加体检计划成功",
                    color: "success",
                  });
                  const data = JSON.parse(res.message);
                  this.planID_local = data.PlanID;
                  this.$emit("loadData");
                  this.$refs.checkoutWizard.nextTab();
                }
              });
            }
          } else {
            this.$vs.notify({
              title: "错误提示",
              text: "请输入有效的信息",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
          }
        });
      });
    },
    validBaseinfo() {
      let message = null;
      if (!this.data_local.StartTime || !this.data_local.EndTime) {
        message = "请选择本次计划体检时间";
      } else if (this.data_local.StartTime > this.data_local.EndTime) {
        message = "计划体检开始时间不能大于计划体检结束时间";
      } else {
        let checkedGroup = this.$refs.medicalCenter.selected;
        console.log("checkedGroup:", checkedGroup);
        if (checkedGroup.length <= 0) {
          message = "请至少选择一家体检中心机构";
        }
      }
      if (!message) return true;
      this.$vs.notify({
        title: "错误提示",
        text: message,
        color: "warning",
        iconPack: "feather",
        icon: "icon-alert-circle",
      });
      return false;
    },
    next_base_info() {
      return new Promise(() => {
        this.$validator.validateAll("step-base").then((result) => {
          if (!result) {
            this.$vs.notify({
              title: "错误提示",
              text: "请输入有效的信息",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            return;
          }
          this.$refs.checkoutWizard.nextTab();
        });
      });
    },
    cancel() {
      this.$emit("closePop", false);
    },
    //#endregion

    //#region 职工
    save_employee() {
      if (!this.validEmployee()) return;
      let checkedGroup = this.$refs.employee.selected;
      let employees = checkedGroup
        .map((obj) => {
          return obj.ID;
        })
        .join(",");

      let para = {
        planID: this.planID_local,
        employees: employees,
      };

      addOrEditEmployeeForPlan(para).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "成功",
            text: res.message,
            color: "success",
          });
          this.$emit("loadData");
          this.$refs.checkoutWizard.nextTab();
        }
      });
    },
    validEmployee() {
      let checkedGroup = this.$refs.employee.selected;

      if (checkedGroup.length > 0) return true;
      console.log(1);
      this.$vs.notify({
        title: "错误提示",
        text: "请选择职工名单",
        color: "danger",
      });
      console.log(2);
      return false;
    },
    nextTab() {
      this.$refs.checkoutWizard.nextTab();
    },
    prevTab() {
      this.$refs.checkoutWizard.prevTab();
    },
    //#endregion

    //#region 标准
    validStandard() {
      debugger;
      let standards = this.$refs.standard.standards;
      if (standards.length > 0) return true;
      this.$vs.notify({
        title: "错误提示",
        text: "请添加标准",
        color: "danger",
      });
      return false;
    },
    savePlan() {
      if (!this.validPlan()) return;
      let para = {
        planID: this.planID_local,
      };
      savePlan(para).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "成功",
            text: res.message,
            color: "success",
          });
          this.$emit("loadData");
          this.cancel();
        }
      });
    },
    confirmSubmitPlan() {
      if (!this.validPlan()) return;
      debugger;

      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: `提交体检计划`,
        text: "该计划提交后将不可更改",
        acceptText: "确认",
        cancelText: "取消",
        accept: this.submitPlan,
      });
    },
    submitPlan() {
      let para = {
        planID: this.planID_local,
      };
      submitPlan(para).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "成功",
            text: res.message,
            color: "success",
          });
          this.$emit("loadData");
          this.cancel();
        }
      });
    },
    validPlan() {
      if (
        !this.validBaseinfo() ||
        !this.validEmployee() ||
        !this.validStandard()
      ) {
        return false;
      }

      if (!this.planID_local) {
        this.$vs.notify({
          title: "错误提示",
          text: "未找到相对应的体检计划，请刷新后重新添加或修改",
          color: "danger",
        });
        return false;
      }
      return true;
    },
    //#endregion
  },
};
</script>
<style lang='scss' scoped>
.vue-form-wizard {
  padding-bottom: 0;
}
.con-vs-popup.fullscreen .vs-popup {
  height: auto;
}
</style>
