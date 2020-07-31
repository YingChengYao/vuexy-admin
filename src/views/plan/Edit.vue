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
      <tab-content title="Cart" icon="feather icon-shopping-cart">
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
              <!-- <span class="text-danger text-sm" v-show="errors.has('结束日期')">{{ errors.first('结束日期') }}</span> -->
            </div>
            <div class="vx-col md:w-1/4 w-full">
              <vs-select label="体检模式" v-model="data_local.PlanType" class="w-full select-large">
                <vs-select-item
                  v-for="(item,index) in planTypeOptions"
                  :key="index"
                  :value="item.Value"
                  :text="item.Name"
                  class="w-full"
                />
              </vs-select>
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
        <!-- <vs-card> -->
        <div class="text-right mt-5">
          <span>
            <vs-button class="vx-col ml-auto" color="primary" @click="save_base_info">保存</vs-button>
          </span>
          <!-- <span class="px-2">
            <vs-button class="vx-col ml-4" color="primary" @click="next_base_info">下一步</vs-button>
          </span>-->
          <span class="px-2">
            <vs-button class="vx-col ml-4" type="border" color="warning" @click="cancel">取消</vs-button>
          </span>
        </div>
        <!-- </vs-card> -->
      </tab-content>

      <!-- tab 2 content -->
      <tab-content title="Address" icon="feather icon-home" backButtonText>
        <staff-employee-list
          ref="employee"
          :isPop="true"
          :isShowWorkingStatus="false"
          :multipleCheck="true"
        >
          <!-- <template>
          </template>-->
        </staff-employee-list>
        <div class="text-right mt-5">
          <span>
            <vs-button
              class="vx-col ml-auto mt-2"
              type="border"
              color="warning"
              @click="back_base_info"
            >上一步</vs-button>
          </span>
          <span class="px-4">
            <vs-button class="vx-col ml-auto mt-2" color="primary" @click="save_employee">下一步</vs-button>
          </span>
        </div>
      </tab-content>

      <!-- tab 3 content -->
      <tab-content title="Payment" icon="feather icon-credit-card">
        <plan-standard-list ref="standard" :planID="planID_local"></plan-standard-list>
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
      default: null,
    },
    mark: {
      type: String,
      default: null,
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
    debugger;
    this.loadData();
  },
  watch: {},
  methods: {
    //#region 初始化数据
    loadData() {
      debugger;
      if (!this.planID_local) return;

      let para = {
        planID: this.planID_local,
      };
      getPlanDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("计划详情：", data);
          this.data_local = data.Model;

          this.$refs.medicalCenter.loadSelectedData(data.PlanPhysical);
          this.$refs.employee.loadSelectedData(data.PlanEmployee);
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
            let isValid = this.validBaseinfo(checkedGroup);
            if (!isValid) return;

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
                    title: "Success",
                    text: "修改体检计划成功",
                    color: "success",
                  });
                  this.$refs.checkoutWizard.nextTab();
                }
              });
            } else {
              addPlan(para).then((res) => {
                if (res.resultType == 0) {
                  this.$vs.notify({
                    title: "Success",
                    text: "添加体检计划成功",
                    color: "success",
                  });
                  console.log("res:", res);
                  const data = JSON.parse(res.message); //"{"planID":"575642100966367232","PlanStep":0}"
                  this.planID_local = data.planID;
                  this.$refs.checkoutWizard.nextTab();
                }
              });
            }
          } else {
            this.$vs.notify({
              title: "Error",
              text: "请输入有效的信息",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
          }
        });
      });
    },
    validBaseinfo(checkedGroup) {
      let message = null;
      if (!this.data_local.StartTime || !this.data_local.EndTime) {
        message = "请选择本次计划体检时间";
      } else if (this.data_local.StartTime > this.data_local.EndTime) {
        message = "计划体检开始时间不能大于计划体检结束时间";
      } else if (checkedGroup.length <= 0) {
        message = "请至少选择一家体检中心机构";
      }
      if (!message) return true;
      this.$vs.notify({
        title: "Error",
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
              title: "Error",
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
      debugger;
      let checkedGroup = this.$refs.employee.selected;

      if (!checkedGroup.length > 0) {
        this.$vs.notify({
          title: "Error",
          text: "请选择职工名单",
          color: "Error",
        });
        return;
      }
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
            title: "Success",
            text: res.message,
            color: "success",
          });
          this.$refs.checkoutWizard.nextTab();
        }
      });
    },
    back_base_info() {
      this.$refs.checkoutWizard.prevTab();
    },
    nextTab() {
      this.$refs.checkoutWizard.nextTab();
    },
    prevTab() {
      this.$refs.checkoutWizard.prevTab();
    },
    //#endregion

    //#region 标准

    //#endregion

    changeEmployeePop(data) {
      this.$emit("changeEmployeePop", data);
    },
    changeStandardPop(data) {
      this.$emit("changeStandardPop", data);
    },
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
