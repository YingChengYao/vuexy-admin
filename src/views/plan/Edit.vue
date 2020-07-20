<template>
  <div id="user-edit-tab-info">
    <form-wizard
      ref="checkoutWizard"
      color="rgba(var(--vs-primary), 1)"
      :title="null"
      :subtitle="null"
      :hide-buttons="true"
      :startIndex="startIndex"
    >
      <!-- tab 1 content -->
      <tab-content title="Cart" icon="feather icon-shopping-cart" class="mb-5">
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
                  :counter-danger.sync="counterDanger"
                  v-model="data_local.CompanyName"
                  height="100px"
                  counter="20"
                />
                <!-- <vs-input label="备注" v-model="data_local.CompanyName" class="w-full" name="备注" /> -->
              </div>
            </div>
          </div>
        </form>
        <medical-center-list ref="medicalCenter" :multipleCheck="true">
          <template>
            <span class="mt-5">
              <span>
                <vs-button class="vx-col ml-auto mt-2" color="primary" @click="save_base_info">保存</vs-button>
              </span>
              <span class="px-2">
                <vs-button class="vx-col ml-4 mt-2" type="border" color="warning" @click="cancel">取消</vs-button>
              </span>
            </span>
          </template>
        </medical-center-list>
      </tab-content>

      <!-- tab 2 content -->
      <tab-content title="Address" icon="feather icon-home" class="mb-5">
        <staff-employee-list ref="employee" :isPop="false" :multipleCheck="true">
          <template>
            <span class="mt-5">
              <span>
                <vs-button class="vx-col" color="primary" type="border" @click="save_employee">保存</vs-button>
              </span>
              <span class="px-2">
                <vs-button class="vx-col" color="primary" type="border">取消</vs-button>
              </span>
            </span>
          </template>
        </staff-employee-list>
      </tab-content>

      <!-- tab 3 content -->
      <tab-content title="Payment" icon="feather icon-credit-card" class="mb-5">
        <plan-standard-list ref="standard"></plan-standard-list>
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
  getPlanTypeDataSource
} from "@/http/data_source.js";
import { formatTimeToStr } from "@/common/utils/data/date";
import {
  addPlan,
  addEmployeeForPlan,
  editPlan,
  editEmployeeForPlan,
  getPlanDetail
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
    PlanStandardList
  },
  props: {
    planId: {
      type: String,
      default: null
    },
    mark: {
      type: String,
      default: null
    },
    workers: {
      type: Array,
      default: null
    },
    standards: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      colors: ["primary", "success", "danger", "warning", "dark", "#24c1a0"],
      counterDanger: false,
      languages: lang,

      startIndex: 2,

      data_local: {},
      planId_local: {},
      marriageOptions: [],
      genderOptions: [],
      planTypeOptions: []
    };
  },
  computed: {},
  created() {
    this.loadMaritalStatus();
    this.loadGender();
    this.loadPlanTypeData();
    this.loadData();
    this.planId_local = this.planId;
  },
  mounted() {
    console.log("checkoutWizard：", this.$refs.checkoutWizard);
  },
  watch: {},
  methods: {
    //#region 初始化数据
    loadData() {
      if (!this.planId) return;

      let para = {
        planId: this.planId
      };
      getPlanDetail(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("计划详情：", data);
          this.data_local = data.Model;
          this.medicalExaminationCenterIDs = data.PlanPhysical;
          console.log("计划详情mec：", data.PlanPhysical);
          console.log("计划详情mec：", this.medicalExaminationCenterIDs);
          this.$emit("bindEmployee", data.PlanEmployee);
          this.$emit("bindStandard", data.PlanStandard);
        }
      });
    },
    loadMaritalStatus() {
      getMaritalDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.marriageOptions = data;
        }
      });
    },
    loadGender() {
      getGenderDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.genderOptions = data;
          console.log("性别：", data);
        }
      });
    },
    loadPlanTypeData() {
      getPlanTypeDataSource().then(res => {
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
    save_changes() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));

          let mecIDs = [];
          if (this.medicalExaminationCenterIDs.length > 0) {
            this.medicalExaminationCenterIDs.map((item, index) => {
              mecIDs.push(item.Value);
            });
          }
          console.log("MecIDs", mecIDs);
          let standards = this.standards;

          var employees = [];
          if (this.workers.length > 0) {
            this.workers.forEach(function(item) {
              employees.push(item.ID);
            });
          }

          console.log("11:", this.standards);

          if (this.standards.length > 0) {
            this.standards.map((item, index) => {
              console.log("type:", typeof item.Positions);
              console.log("Position:", item.Positions);
              if (
                item.Positions !== null &&
                item.Positions !== undefined &&
                typeof item.Positions !== "string"
              ) {
                item.Positions = item.Positions.map(r => r.Value).join(",");
                // item = Object.assign({}, item, {
                //   PositionID: item.PositionID.map(r => r.Value).join(",")
                // });
              }
            });
          }

          let para = {
            planName: this.data_local.PlanName,
            startTime: this.data_local.StartTime,
            endTime: this.data_local.EndTime,
            remark: this.data_local.Remark,
            mecIDs: JSON.stringify(mecIDs),
            employees: JSON.stringify(employees),
            standars: JSON.stringify(this.standards)
          };

          if (this.mark === "add") {
            addPlan(para).then(res => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success"
                });
                this.$emit("loadData");
                this.cancel();
              }
            });
          } else if (this.mark == "edit") {
            para.ID = this.planId;
            editPlan(para).then(res => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success"
                });
                this.$emit("loadData");
                this.cancel();
              }
            });
          }
        }
      });
    },
    cancel() {
      this.$emit("closePop", false);
    },
    //#region 基础信息
    save_base_info() {
      // this.$refs.checkoutWizard.nextTab();
      // return;
      return new Promise(() => {
        this.$validator.validateAll("step-base").then(result => {
          if (result) {
            let checkedGroup = this.$refs.medicalCenter.checkedGroup;
            let isValid = this.validBaseinfo(checkedGroup);
            if (!isValid) return;

            let mecIDs = checkedGroup
              .map(obj => {
                return obj.ID;
              })
              .join(",");

            let para = {
              planName: this.data_local.PlanName,
              startTime: this.data_local.StartTime,
              endTime: this.data_local.EndTime,
              planType: this.data_local.PlanType,
              remark: this.data_local.Remark,
              mecIDs: mecIDs
            };

            if (this.planId_local) {
              para.planId = this.planId_local;
              editPlan(para).then(res => {
                if (res.resultType == 0) {
                  this.$vs.notify({
                    title: "Success",
                    text: res.message,
                    color: "success"
                  });
                }
              });
            } else {
              addPlan(para).then(res => {
                if (res.resultType == 0) {
                  this.$vs.notify({
                    title: "Success",
                    text: "添加体检计划成功",
                    color: "success"
                  });
                  console.log("res:", res);
                  const data = JSON.parse(res.message); //"{"PlanID":"575642100966367232","PlanStep":0}"
                  this.planId_local = data.PlanID;
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
              icon: "icon-alert-circle"
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
        icon: "icon-alert-circle"
      });
      return false;
    },
    //#endregion

    //#region 职工
    showEmployee() {
      this.isEmployeeTab = true;
    },
    save_employee() {
      // this.$refs.checkoutWizard.nextTab();
      // return;
      let checkedGroup = this.$refs.employee.checkedGroup;

      let employees = checkedGroup
        .map(obj => {
          return obj.ID;
        })
        .join(",");

      let para = {
        planId: this.planId_local,
        employees: employees
      };

      // if (this.planId_local) {
      //   para.planId = this.planId_local;
      //   editEmployeeForPlan(para).then(res => {
      //     if (res.resultType == 0) {
      //       this.$vs.notify({
      //         title: "Success",
      //         text: res.message,
      //         color: "success"
      //       });
      //       this.$refs.checkoutWizard.nextTab();
      //     }
      //   });
      // } else {
      addEmployeeForPlan(para).then(res => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "Success",
            text: res.message,
            color: "success"
          });
          this.$refs.checkoutWizard.nextTab();
        }
      });
      // }
    },
    //#endregion

    changeEmployeePop(data) {
      this.$emit("changeEmployeePop", data);
    },
    changeStandardPop(data) {
      this.$emit("changeStandardPop", data);
    },
    delStandard(data) {
      this.$emit("delStandard", data);
    },
    delEmployee(data) {
      this.$emit("delEmployee", data);
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
