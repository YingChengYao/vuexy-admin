<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 展示值 -->
          <vs-input
            label="展示值"
            v-model="data_local.Name"
            class="w-full"
            name="展示值"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('展示值')">{{ errors.first('展示值') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 字典值 -->
          <vs-input
            label="字典值"
            v-model="data_local.Code"
            class="w-full"
            name="字典值"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('字典值')">{{ errors.first('字典值') }}</span>
        </div>

        <!-- 排序 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input class="w-full" label="排序" v-model="data_local.Sort" name="排序" />
          <span class="text-danger text-sm" v-show="errors.has('排序')">{{ errors.first('排序') }}</span>
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

      <!-- 描述 -->
      <div class="vx-col md:w-1/2 w-full mt-4">
        <vs-input class="w-full" label="描述" v-model="data_local.Remark" name="描述" />
        <span class="text-danger text-sm" v-show="errors.has('描述')">{{ errors.first('描述') }}</span>
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
  getSysDictionaryDetail,
  addSysDictionaryDetail,
  editSysDictionaryDetail,
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
    detailId: {
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
      if (!this.detailId) return;

      let para = {
        id: this.detailId,
      };
      getSysDictionaryDetail(para).then((res) => {
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
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));

          let para = {
            name: this.data_local.Name,
            code: this.data_local.Code,
            remark: this.data_local.Remark,
            sort: this.data_local.Sort,
          };

          if (this.mark === "add") {
            para.rootId = this.dictionaryId;

            addSysDictionaryDetail(para).then((res) => {
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
            para.Id = this.data_local.ID;
            editSysDictionaryDetail(para).then((res) => {
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
