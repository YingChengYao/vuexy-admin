<template>
  <div>
    <vx-card title>
      <div class="vx-row">
        <!-- 职位名称 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="职位名称"
            v-model="data_local.PositionName"
            class="w-full"
            name="职位名称"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('职位名称')">{{ errors.first('职位名称') }}</span>
        </div>
        <!-- 排序 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="排序"
            v-model="data_local.Sort"
            class="w-full"
            name="排序"
            v-validate="'numeric'"
          />
          <span class="text-danger text-sm" v-show="errors.has('排序')">{{ errors.first('排序') }}</span>
        </div>

        <!-- 备注 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input label="备注" v-model="data_local.Remark" class="w-full" />
        </div>
      </div>

      <!-- Save & Reset Button -->
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" @click="save_changes">保存</vs-button>
            <vs-button class="ml-4 mt-2" type="border" color="warning" @click="cancel">取消</vs-button>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import { addPosition } from "@/http/staff.js";

export default {
  name: "",
  components: {},
  props: {
    mark: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      data_local: {}
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    save_changes() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));

          let para = {
            companyID: userInfo.companyID,
            positionName: this.data_local.PositionName,
            sort: this.data_local.Sort,
            remark: this.data_local.Remark
          };

          if (this.mark === "add") {
            addPosition(para).then(res => {
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
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
