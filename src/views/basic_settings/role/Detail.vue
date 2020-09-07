<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-input
            class="w-full mt-4"
            label="角色名称"
            v-model="data_local.RoleName"
            v-validate="'required'"
            name="角色名称"
          />
          <span class="text-danger text-sm" v-show="errors.has('角色名称')">{{ errors.first('角色名称') }}</span>
        </div>
        <div class="vx-col w-full">
          <!-- 排序 -->
          <vs-input
            label="排序"
            v-model="data_local.Sort"
            class="mt-4 w-full"
            name="排序"
            v-validate="'numeric'"
          />
          <span class="text-danger text-sm" v-show="errors.has('排序')">{{ errors.first('排序') }}</span>
        </div>

        <div class="vx-col w-full">
          <vs-input class="w-full mt-4" label="描述" v-model="data_local.Remark" name="remark" />
        </div>

        <div class="vx-col w-full">
          <div class="mt-4" v-if="mark==='edit'">
            <label class="vs-select--label">状态</label>
            <v-select
              v-model="data_local.Status"
              label="Name"
              value="Value"
              :options="statusOptions"
              :reduce="m => m.Value"
            />
          </div>
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
import vSelect from "vue-select";

import {
  getProjectTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource,
  getDataStatusDataSource,
} from "@/http/data_source.js";
import { addRole, editRole } from "@/http/basic_setting.js";

export default {
  components: {
    vSelect,
  },
  props: {
    roleId: {
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
      marriageOptions: [],
      genderOptions: [],
      projectTypeStatus: [],
      statusOptions: [],
    };
  },
  computed: {},
  created() {
    console.log(0);
    //this.initData();
    this.loadMaritalStatus();
    this.loadGender();
    this.loadItemTypeData();
    this.loadData();
    this.loadDataStatus();
  },
  mounted() {},
  methods: {
    loadData() {
      if (!this.roleId) return;
      // let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      // let para = {
      //   mecid: userInfo.mecID,
      //   id: this.roleId,
      // };
      // getProjectItemDetails(para).then((res) => {
      //   if (res.resultType == 0) {
      //     const data = JSON.parse(res.message);
      //     this.data_local = data;
      //     console.log("单项详情：", data);
      //   }
      // });
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
            roleName: this.data_local.RoleName,
            sort: this.data_local.Sort,
            remark: this.data_local.Remark,
          };

          if (this.mark === "add") {
            addRole(para).then((res) => {
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
            para.ID = this.roleId;
            para.status = this.data_local.Status;

            editRole(para).then((res) => {
              debugger;
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
      //this.$router.push("/project_item").catch(() => {});
      this.$emit("closePop", false);
    },
    loadMaritalStatus() {
      getMaritalDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.marriageOptions = data;
        }
      });
    },
    loadGender() {
      getGenderDataSource().then((res) => {
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
        mecid: userInfo.mecID,
      };
      getProjectTypeDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.projectTypeStatus = data;
        }
      });
    },
  },
};
</script>
<style lang='sass' scoped>
</style>
