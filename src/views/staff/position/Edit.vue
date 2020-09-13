<template>
  <div>
    <vx-card title>
      <div class="vx-row">
        <!-- 职位名称 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="职位名称"
            v-model="data_local.PositionName"
            class="w-full xrequired"
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

        <div class="vx-col md:w-1/2 w-full mt-4" v-if="positionID">
          <label class="vs-input--label">状态</label>
          <v-select
            v-model="data_local.Status"
            label="Name"
            value="Value"
            :options="statusOptions"
            :reduce="m => m.Value"
          />
        </div>
      </div>

      <!-- Save & Reset Button -->
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" @click="save_changes" v-preventClick>保存</vs-button>
            <vs-button class="ml-4 mt-2" type="border" color="warning" @click="cancel">取消</vs-button>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import { addPosition, editPosition, getPositionDetail } from "@/http/staff.js";
import { getDataStatusDataSource } from "@/http/data_source.js";

export default {
  name: "",
  components: {},
  props: {
    mark: {
      type: String,
      default: null,
    },
    positionID: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      data_local: {},
      statusOptions: [],
    };
  },
  computed: {},
  created() {
    this.loadData();
    this.loadDataStatus();
  },
  mounted() {},
  methods: {
    loadData() {
      if (!this.positionID) return;

      let para = {
        positionID: this.positionID,
      };
      getPositionDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
        }
      });
    },
    loadDataStatus() {
      getDataStatusDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.statusOptions = data;
        }
      });
    },
    save_changes() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let para = {
            positionName: this.data_local.PositionName,
            sort: this.data_local.Sort,
            remark: this.data_local.Remark,
          };

          if (this.mark === "add") {
            let userInfo = JSON.parse(localStorage.getItem("userInfo"));
            para.companyID = userInfo.companyID;
            addPosition(para).then((res) => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "成功",
                  text: res.message,
                  color: "success",
                });
                this.$emit("loadData");
                this.cancel();
              }
            });
          } else if (this.mark === "edit") {
            para.id = this.data_local.ID;
            para.status = this.data_local.Status;

            editPosition(para).then((res) => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "成功",
                  text: res.message,
                  color: "success",
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
  },
};
</script>
<style lang='sass' scoped>
</style>
