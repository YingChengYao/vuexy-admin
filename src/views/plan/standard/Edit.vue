<template>
  <div>
    <vx-card>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 标准 -->
          <vs-input
            label="标准"
            v-model="data_local.Standard"
            class="w-full"
            name="标准"
            v-validate="'required|numeric'"
          />
          <span class="text-danger text-sm" v-show="errors.has('标准')">{{ errors.first('标准') }}</span>
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

export default {
  components: {
    vSelect
  },
  data() {
    return {
      positionOptions: [],
      data_local: {}
    };
  },
  created() {
    this.loadPosition();
  },
  methods: {
    save() {
      this.$emit("addStandard", this.data);
      this.cancel();
    },
    cancel() {
      this.$emit("closePop", false);
    },
    loadPosition() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        companyid: userInfo.companyID
      };
      getPositionDataSource(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.positionOptions = data;
        }
      });
    }
  }
};
</script>
<style scoped>
</style>
