<template>
  <div id="user-edit-tab-info">
    <vx-card title="基本信息">
      <div class="vx-row">
        <div class="vx-col md:w-1/3 w-full">
          <label class="label-name px-2">计划名称</label>
          <vs-input
            class="w-full"
            v-model="data_local.PlanName"
            v-validate="'required'"
            name="计划名称"
          />
          <span class="text-danger text-sm" v-show="errors.has('计划名称')">{{ errors.first('计划名称') }}</span>
        </div>
        <div class="vx-col md:w-1/3 w-full">
          <label class="label-name px-2">开始日期</label>
          <datepicker label="开始日期" format="yyyy-MM-dd" placeholder v-model="data_local.StartTime"></datepicker>
          <!-- <span class="text-danger text-sm" v-show="errors.has('开始日期')">{{ errors.first('开始日期') }}</span> -->
        </div>
        <div class="vx-col md:w-1/3 w-full">
          <label class="label-name px-2">结束日期</label>
          <datepicker label="结束日期" format="yyyy-MM-dd" placeholder v-model="data_local.EndTime"></datepicker>

          <!-- <span class="text-danger text-sm" v-show="errors.has('结束日期')">{{ errors.first('结束日期') }}</span> -->
        </div>
        <div class="vx-col w-full">
          <div class="mt-4">
            <label class="vs-input--label">选择体检中心</label>
            <v-select
              multiple
              :closeOnSelect="false"
              v-model="data_local.MecIDs"
              label="Name"
              :options="physicalExaminationCenterOptions"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
          </div>
        </div>

        <div class="vx-col w-full">
          <div class="mt-4">
            <vs-input label="备注" v-model="data_local.CompanyName" class="w-full" name="备注" />
            <span class="text-danger text-sm" v-show="errors.has('备注')">{{ errors.first('备注') }}</span>
          </div>
        </div>
      </div>


      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8">
            <vs-button class="ml-auto mt-2" @click="changeStandardPop(true)">添加标准</vs-button>
            <vs-button
              class="ml-4 mt-2"
              type="border"
              color="warning"
              @click="changeEmployeePop(true)"
            >添加职工</vs-button>
          </div>
        </div>
      </div>
      <vs-row vs-align="center" class="mt-4">
        <label class="vx-col label-name px-2">标准：</label>
        <div class v-for="(item,index) in standards">
          <vs-chip transparent closable @click="delStandard(item)">{{item.Standard}}</vs-chip>
        </div>
      </vs-row>

      <vs-row class="mt-4">
        <label class="label-name px-2">参与职工人员：</label>
        <div class v-for="(item,index) in workers">
          <vs-chip
            transparent
            closable
            :color="colors[Math.round(Math.random()*colors.length)]"
            @click="delEmployee(item.ID)"
          >{{item.EmployeeName}}</vs-chip>
        </div>
      </vs-row>
    </vx-card>
    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="save_changes">保存</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="cancel">取消</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import Datepicker from "vuejs-datepicker";
import draggable from "vuedraggable";
import PositionList from "../staff/position/List";

import {
  getProjectTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource
} from "@/http/data_source.js";
import { addPlan, editPlan, getPlanDetail } from "@/http/plan.js";

export default {
  name: "",
  components: {
    vSelect,
    Datepicker,
    draggable,
    PositionList
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
      data_local: {},
      marriageOptions: [],
      genderOptions: [],
      physicalExaminationCenterOptions: [
        {
          Name: "鄞州医院",
          Value: 1
        },
        {
          Name: "彰基体检中心",
          Value: 2
        }
      ]
    };
  },
  computed: {},
  created() {
    this.loadMaritalStatus();
    this.loadGender();
    this.loadItemTypeData();
    this.loadData();
  },
  mounted() {},
  methods: {
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
          if (data.PlanPhysical.length > 0) {
            this.data_local.MecIDs = data.PlanPhysical.map(r => r.ID).join(",");
          }
          this.$emit("bindEmployee", data.PlanEmployee);
          // PlanEmployee,PlanPhysical,PlanPhysicalPackage
        }
      });
    },
    save_changes() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));

          let mecIDs = "";
          if (this.data_local.MecIDs.length > 0) {
            mecIDs = this.data_local.MecIDs.map(r => r.Value).join(",");
          }
          let standards = this.standards;
          var employees = [];
          console.log("1:", this.workers);
          if (this.workers.length > 0) {
            this.workers.forEach(function(item) {
              employees.push(item.ID);
            });
          }
          console.log("employees:", employees);

          let para = {
            planName: this.data_local.PlanName,
            startTime: this.data_local.StartTime,
            endTime: this.data_local.EndTime,
            remark: this.data_local.Remark,
            mecIDs: mecIDs,
            Employees: employees,
            standars: this.data_local.Standars
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
            para.isLocked = this.data_local.IsLocked;
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
    loadItemTypeData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        mecid: userInfo.mecID
      };
      getProjectTypeDataSource(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.projectTypeStatus = data;
        }
      });
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
