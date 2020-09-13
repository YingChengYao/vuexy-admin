<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 名称 -->
          <vs-input
            label="名称"
            v-model="data_local.Name"
            class="w-full xrequired"
            name="名称"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('名称')">{{ errors.first('名称') }}</span>
        </div>
        <!-- 编码 -->
        <!-- <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="编码"
            v-model="data_local.Code"
            class="w-full"
            name="编码"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('编码')">{{ errors.first('编码') }}</span>
        </div>-->

        <!-- 描述 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input class="w-full" label="描述" v-model="data_local.Remark" name="描述" />
          <span class="text-danger text-sm" v-show="errors.has('描述')">{{ errors.first('描述') }}</span>
        </div>
        <!-- 状态 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
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
import {
  getSysDictionary,
  addSysDictionary,
  editSysDictionary,
} from "@/http/dictionary.js";
import { getDataStatusDataSource } from "@/http/data_source.js";

export default {
  name: "",
  components: {},
  props: {
    dictionaryId: {
      type: String,
      default: null,
    },
    mark: {
      type: String,
      default: null,
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
    this.loadDataStatus();
    this.loadData();
  },
  mounted() {},
  methods: {
    loadData() {
      if (!this.dictionaryId) return;

      let para = {
        id: this.dictionaryId,
      };
      getSysDictionary(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
          console.log(this.data_local);
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
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));

          let para = {
            name: this.data_local.Name,
            remark: this.data_local.Remark,
          };

          if (this.mark === "add") {
            addSysDictionary(para).then((res) => {
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
          } else if (this.mark == "edit") {
            para.ID = this.dictionaryId;
            editSysDictionary(para).then((res) => {
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
