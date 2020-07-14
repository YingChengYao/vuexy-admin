<template>
  <div id="user-edit-tab-info">
    <form-wizard
      ref="checkoutWizard"
      color="rgba(var(--vs-primary), 1)"
      :title="null"
      :subtitle="null"
      :hide-buttons="true"
    >
      <!-- tab 1 content -->
      <tab-content title="Cart" icon="feather icon-shopping-cart" class="mb-5">
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

        <vs-table ref="table" multiple v-model="selected" stripe :data="medicalCenters">
          <div
            slot="header"
            class="flex flex-wrap-reverse items-center flex-grow justify-between mb-4"
          >
            <vs-row vs-align="center">
              <label class="vx-col label-name px-2">体检中心名称</label>
              <vs-input
                placeholder="Placeholder"
                v-model="medicalCenterNameInput"
                class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
              />
              <vs-button
                class="vx-col flex"
                color="primary"
                type="border"
                @click="loadMedicalCenterData"
              >查询</vs-button>
            </vs-row>
          </div>

          <template slot="thead">
            <vs-th>编号</vs-th>
            <vs-th>体检中心名称</vs-th>
            <vs-th>体检中心编号</vs-th>
            <vs-th>联系人</vs-th>
            <vs-th>手机号</vs-th>
            <vs-th>电话</vs-th>
            <vs-th>排序</vs-th>
            <vs-th>修改人</vs-th>
            <vs-th>创建时间</vs-th>
          </template>

          <template slot-scope="{data}">
            <tbody>
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  <p>{{ indextr+1 }}</p>
                </vs-td>
                <vs-td>
                  <p>{{ tr.MecName }}</p>
                </vs-td>
                <vs-td>
                  <p>{{ tr.MecCode }}</p>
                </vs-td>
                <vs-td>
                  <p>{{ tr.Contact }}</p>
                </vs-td>
                <vs-td>
                  <p>{{ tr.Mobile }}</p>
                </vs-td>
                <vs-td>
                  <p>{{ tr.Tel }}</p>
                </vs-td>
                <vs-td>
                  <p>{{ tr.Sort }}</p>
                </vs-td>
                <vs-td>
                  <p class="product-category">{{ tr.ModifyName}}</p>
                </vs-td>
                <vs-td>
                  <p>{{ tr.ModifyTime | formatDate }}</p>
                </vs-td>
              </vs-tr>
            </tbody>
          </template>
        </vs-table>

        <div class="flex">
          <span class="mt-5">
            <span>
              <vs-button class="vx-col ml-auto mt-2" color="primary">保存</vs-button>
            </span>
            <span class="px-2">
              <vs-button class="vx-col ml-4 mt-2" type="border" color="warning">取消</vs-button>
            </span>
          </span>
          <vs-pagination
            style="flex:1"
            :total="totalPage"
            v-model="currentPage"
            :pagedown="true"
            :totalItems="totalItems"
            @changePageMaxItems="changePageMaxItems"
            :pagedownItems="descriptionItems"
            :size="itemsPerPage"
            class="the-footer flex-wrap justify-between"
          ></vs-pagination>
        </div>
      </tab-content>

      <!-- tab 2 content -->
      <tab-content title="Address" icon="feather icon-home" class="mb-5"></tab-content>

      <!-- tab 3 content -->
      <tab-content title="Payment" icon="feather icon-credit-card" class="mb-5"></tab-content>
    </form-wizard>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import draggable from "vuedraggable";
import PositionList from "../staff/position/List";

import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";

import {
  getProjectTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource
} from "@/http/data_source.js";
import { addPlan, editPlan, getPlanDetail } from "@/http/plan.js";
import { getMedicalCenters } from "@/http/medical_center.js";

export default {
  name: "",
  components: {
    Datepicker,
    draggable,
    PositionList,
    FormWizard,
    TabContent
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
      data_local: {},

      //Page
      medicalCenters: [],
      medicalCenterNameInput: null,
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,
      selected: [],

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
      ]
    };
  },
  computed: {},
  created() {
    this.loadMaritalStatus();
    this.loadGender();
    this.loadData();
    this.loadMedicalCenterData();
  },
  mounted() {},
  watch: {
    currentPage() {
      this.loadMedicalCenterData();
    }
  },
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
    },
    loadMedicalCenterData() {
      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        mecName: this.medicalCenterNameInput
      };
      getMedicalCenters(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.medicalCenters = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.currentPage = 1;
      this.loadMedicalCenterData();
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
