<template>
  <div>
    <vx-card>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 套餐级别 -->
          <vs-input
            label="套餐级别"
            v-model="data_local.Standard"
            class="w-full"
            name="套餐级别"
            v-validate="'required|numeric'"
          />
          <span class="text-danger text-sm" v-show="errors.has('套餐级别')">{{ errors.first('套餐级别') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-input--label">限定职位</label>
          <v-select
            multiple
            :closeOnSelect="false"
            v-model="data_local.Positions"
            label="Name"
            :options="positionOptions"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
          <!-- <vs-select label="限定职位" v-model="data.PositionID" class="w-full select-large">
            <vs-select-item
              v-for="(item,index) in positionOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>-->
        </div>
      </div>

      <!-- Save & Reset Button -->
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" @click="save">保存</vs-button>
            <vs-button class="ml-4 mt-2" type="border" color="warning" @click="cancel">取消</vs-button>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>
<script>
import { getPositionDataSource } from "@/http/data_source.js";
import vSelect from "vue-select";
import { addStandard, editStandard, getStandardDetail } from "@/http/plan.js";

export default {
  components: {
    vSelect,
  },
  props: {
    mark: { type: String, default: "" },
    standardID: { type: String, default: "" },
    planID: { type: String, default: "" },
  },
  data() {
    return {
      positionOptions: [],
      data_local: {},
    };
  },
  created() {
    this.loadPosition();
    this.loadData();
  },
  methods: {
    loadData() {
      if (!this.standardID) return;
      let para = {
        ID: this.standardID,
      };
      getStandardDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log(data);
          this.data_local = data;
          this.data_local.Positions = data.Aggregate;
        }
      });
    },
    save() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let positions = "";
      if (this.data_local.Positions && this.data_local.Positions.length > 0) {
        positions = this.data_local.Positions.map((obj) => {
          return obj.Value;
        }).join(",");
      }
      let para = {
        planID: this.planID,
        standard: this.data_local.Standard,
        positions: positions,
      };

      if (!this.planID) {
        this.$vs.notify({
          title: "Error",
          text: "未找到该体检计划",
          color: "Error",
        });
        return;
      }
      if (this.mark == "add") {
        addStandard(para).then((res) => {
          if (res.resultType == 0) {
            this.$vs.notify({
              title: "Success",
              text: res.message,
              color: "success",
            });
            this.$emit("loadData");
            this.cancel();
          }
        });
      } else if (this.mark == "edit") {
        para.ID = this.data_local.ID;
        editStandard(para).then((res) => {
          if (res.resultType == 0) {
            this.$vs.notify({
              title: "Success",
              text: res.message,
              color: "success",
            });
            this.$emit("loadData");
            this.cancel();
          }
        });
      }
      //this.$emit("addStandard", this.data);
    },
    cancel() {
      this.$emit("closePop", false);
    },
    loadPosition() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        companyid: userInfo.companyID,
      };
      getPositionDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.positionOptions = data;
        }
      });
    },
  },
};
</script>
<style scoped>
</style>
