<template>
  <div>
    <div class="vx-row">
      <div class="vx-col md:w-1/4 w-full">
        <vs-input label="计划名称" class="w-full" v-model="data_local.PlanName" />
      </div>
      <div class="vx-col md:w-1/4 w-full">
        <vs-input label="本次计划体检开始日期" class="w-full" v-model="data_local.StartTime" />
      </div>
      <div class="vx-col md:w-1/4 w-full">
        <vs-input label="本次计划体检结束日期" class="w-full" v-model="data_local.EndTime" />
      </div>
      <!-- <div class="vx-col md:w-1/4 w-full">
        <vs-select label="体检模式" v-model="data_local.PlanType" class="w-full select-large">
          <vs-select-item
            v-for="(item,index) in planTypeOptions"
            :key="index"
            :value="item.Value"
            :text="item.Name"
            class="w-full"
          />
        </vs-select>
      </div>-->
      <div class="vx-col w-full">
        <div class="mt-4">
          <label class="vs-input--label">备注</label>
          <vs-textarea v-model="data_local.Remark" height="100px" counter="200" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      data_local: {},
    };
  },
  components: {},
  created() {},
  mounted() {
    this.loadData();
  },
  methods: {
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
          data.PlanPhysical.map((item) => {
            item.ID = item.MecID;
          });
          data.PlanEmployee.map((item) => {
            item.ID = item.EmployeeID;
          });
          this.$refs.medicalCenter.loadSelectedData(data.PlanPhysical);
          this.$refs.employee.loadSelectedData(data.PlanEmployee);
        }
      });
    },
  },
};
</script>
<style lang='sass' scoped>
</style>
