<template>
  <div id="user-edit-tab-info">
    <vx-card title="基本信息">
      <div class="vx-row">
        <div class="vx-col md:w-1/4 w-full mt-2">
          <label class="label-name px-2">计划名称</label>
          <vs-input
            class="w-full"
            v-model="data_local.PlanName"
            v-validate="'required'"
            name="计划名称"
          />
          <span class="text-danger text-sm" v-show="errors.has('计划名称')">{{ errors.first('计划名称') }}</span>
        </div>
        <div class="vx-col md:w-1/4 w-full mt-2">
          <label class="label-name px-2">开始日期</label>
          <datepicker label="开始日期" format="yyyy-MM-dd" placeholder v-model="data_local.StartTime"></datepicker>
          <!-- <span class="text-danger text-sm" v-show="errors.has('开始日期')">{{ errors.first('开始日期') }}</span> -->
        </div>
        <div class="vx-col md:w-1/4 w-full mt-2">
          <label class="label-name px-2">结束日期</label>
          <datepicker label="结束日期" format="yyyy-MM-dd" placeholder v-model="data_local.EndTime"></datepicker>

          <!-- <span class="text-danger text-sm" v-show="errors.has('结束日期')">{{ errors.first('结束日期') }}</span> -->
        </div>
        <div class="vx-col md:w-1/4 w-full">
          <vs-select label="计划类型" v-model="data_local.PlanType" class="w-full select-large">
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
            <label class="vs-input--label">选择体检中心</label>
            <v-select
              multiple
              :closeOnSelect="false"
              v-model="medicalExaminationCenterIDs"
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
        <div class v-for="(item,index) in standards" :key="index">
          <vs-chip transparent closable @click="delStandard(item)">{{item.Standard}}</vs-chip>
        </div>
      </vs-row>

      <vs-row class="mt-4">
        <label class="label-name px-2">参与职工人员：</label>
        <div class v-for="(item,index) in workers" :key="index">
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
      medicalExaminationCenterIDs: [],
      marriageOptions: [],
      genderOptions: [],
      planTypeOptions: [
        {
          Name: "充值套餐",
          Value: "1"
        },
        {
          Name: "充值钱包",
          Value: "2"
        }
      ],
      physicalExaminationCenterOptions: [
        // {
        //   Value: "6112159455408021504",
        //   Name: "彰基体检中心",
        // },
        // {
        //   Value: "6467685114320248832",
        //   Name: "彰基健康广场"
        // }
      ]
    };
  },
  computed: {},
  created() {
    this.loadMaritalStatus();
    this.loadGender();
    this.loadItemTypeData();
    this.loadData();
    this.physicalExaminationCenterOptions = [
      {
        Value: "6112159455408021504",
        Name: "彰基体检中心"
      },
      {
        Value: "6467685114320248832",
        Name: "彰基健康广场"
      }
    ];
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
          this.medicalExaminationCenterIDs = data.PlanPhysical;
          console.log("计划详情mec：", data.PlanPhysical);
          console.log("计划详情mec：", this.medicalExaminationCenterIDs);

          // if (data.PlanPhysical.length > 0) {
          //   this.data_local.MecIDs = data.PlanPhysical.map(r => r.ID).join(",");
          // }
          this.$emit("bindEmployee", data.PlanEmployee);
          this.$emit("bindStandard", data.PlanStandard);
        }
      });
    },
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
    },
    loadPlanTypeData() {
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
