<template>
  <div>
    <vx-card title="基础信息">
      <div class="vx-row">
        <div class="vx-col md:w-1/4 w-full">
          <vs-input label="计划名称" disabled="disabled" class="w-full" v-model="data_local.PlanName" />
        </div>
        <div class="vx-col md:w-1/4 w-full">
          <vs-input
            label="本次计划体检开始日期"
            disabled="disabled"
            class="w-full"
            v-model="data_local.StartTime"
          />
        </div>
        <div class="vx-col md:w-1/4 w-full">
          <vs-input
            label="本次计划体检结束日期"
            disabled="disabled"
            class="w-full"
            v-model="data_local.EndTime"
          />
        </div>
        <div class="vx-col md:w-1/4 w-full">
          <vs-input
            label="体检模式"
            disabled="disabled"
            class="w-full"
            v-model="data_local.PlanTypeName"
          />
        </div>
        <div class="vx-col w-full mt-4">
          <label class="vs-input--label">备注</label>
          <vs-textarea v-model="data_local.Remark" height="100px" counter="200" />
        </div>
      </div>
    </vx-card>

    <vx-card title="体检中心信息" class="mt-12">
      <vx-table ref="table" :items="medicalCenters" @loadData="loadData" :pagination="false">
        <template slot="thead-header">
          <vs-th>体检中心名称</vs-th>
          <vs-th>体检中心编号</vs-th>
          <vs-th>联系人</vs-th>
          <vs-th>手机号</vs-th>
          <vs-th>电话</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.MecName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.MecCode }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Contact }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Mobile }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Tel }}</p>
          </vs-td>
        </template>
      </vx-table>
    </vx-card>

    <vx-card title="职工信息" class="mt-12">
      <vx-table ref="table" :items="employees" :pagination="false">
        <template slot="thead-header">
          <vs-th>职工名称</vs-th>
          <vs-th>身份证</vs-th>
          <vs-th>婚姻状态</vs-th>
          <vs-th>性别</vs-th>
          <vs-th>手机号</vs-th>
          <vs-th>在职状态</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.EmployeeName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.IdNo }}</p>
          </vs-td>
          <vs-td>
            <vs-chip
              transparent
              :color="item.tr.Marital | getMarriageForUserColor"
            >{{ item.tr.MaritalName}}</vs-chip>
          </vs-td>
          <vs-td>
            <vs-chip
              transparent
              :color="item.tr.Gender | getGenderForUserColor"
            >{{ item.tr.GenderName}}</vs-chip>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Mobile }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.WorkingStatusName }}</p>
          </vs-td>
        </template>
      </vx-table>
    </vx-card>

    <vx-card title="体检标准信息" class="mt-12">
      <vx-table ref="table" :items="standards" :pagination="false">
        <template slot="thead-header">
          <vs-th>标准</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.Standard }}</p>
          </vs-td>
        </template>
      </vx-table>
    </vx-card>
  </div>
</template>

<script>
import { getPlanDetail } from "@/http/plan.js";
import { formatTimeToStr } from "@/common/utils/data/date";
export default {
  name: "",
  props: {
    planID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      data_local: {},
      medicalCenters: [],
      employees: [],
      standards: [],
    };
  },
  components: {},
  created() {},
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      let para = {
        planID: this.planID,
      };
      getPlanDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data.Model;
          console.log("计划详情：", data);
          this.data_local.StartTime = formatTimeToStr(
            this.data_local.StartTime,
            "yyyy-MM-dd"
          );
          this.data_local.EndTime = formatTimeToStr(
            this.data_local.EndTime,
            "yyyy-MM-dd"
          );
          data.PlanPhysical.map((item) => {
            item.ID = item.MecID;
          });
          data.PlanEmployee.map((item) => {
            item.ID = item.EmployeeID;
          });
          this.medicalCenters = data.PlanPhysical;
          this.employees = data.PlanEmployee;
          this.standards = data.PlanStandard;
        }
      });
    },
  },
};
</script>
<style lang='sass' scoped>
</style>
