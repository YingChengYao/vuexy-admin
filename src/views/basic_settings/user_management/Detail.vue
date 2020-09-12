<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-input
            class="w-full mt-4"
            label="用户名"
            v-model="data_local.UserName"
            v-validate="'required'"
            name="用户名"
          />
          <span class="text-danger text-sm" v-show="errors.has('用户名')">{{ errors.first('用户名') }}</span>
        </div>
        <div class="vx-col w-full">
          <vs-input
            class="w-full mt-4"
            label="登录名"
            v-model="data_local.LoginName"
            v-validate="'required'"
            name="登录名"
          />
          <span class="text-danger text-sm" v-show="errors.has('登录名')">{{ errors.first('登录名') }}</span>
        </div>
        <div class="vx-col w-full">
          <vs-input
            class="w-full mt-4"
            label="别名"
            v-model="data_local.UserNickName"
            v-validate="'required'"
            name="别名"
          />
          <span class="text-danger text-sm" v-show="errors.has('别名')">{{ errors.first('别名') }}</span>
        </div>

        <div class="vx-col w-full">
          <vs-input class="w-full mt-4" label="身份证" v-model="data_local.IdNumber" />
        </div>
        <div class="vx-col w-full">
          <vs-input class="w-full mt-4" label="手机号" v-model="data_local.Mobile" />
        </div>

        <div class="vx-col w-full mt-4">
          <label class="vs-select--label">平台类型</label>
          <v-select
            v-model="data_local.UserType"
            label="Name"
            value="Value"
            :options="platformTypeOptions"
            :reduce="m => m.Value"
            @input="loadPlatformData"
            name="平台类型"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('平台类型')">{{ errors.first('平台类型') }}</span>
        </div>
        <div class="vx-col w-full mt-4">
          <label class="vs-select--label">平台</label>
          <v-select
            ref="platform"
            v-model="data_local.UnitID"
            label="Name"
            value="Value"
            :options="platformOptions"
            :reduce="m => m.Value"
          />
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
  getDataStatusDataSource,
  getPlatformTypeDataSource,
  getSubordinateUnitDataSource,
  getMedicalCenterDataSource,
} from "@/http/data_source.js";
import { addUser, editUser, getUserDetail } from "@/http/basic_setting.js";

export default {
  components: {
    vSelect,
  },
  props: {
    userId: {
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
      platformOptions: [],
      platformTypeOptions: [],
    };
  },
  computed: {},
  created() {
    this.loadData();
    this.loadDataStatus();
    this.loadPlatformType();
  },
  mounted() {},
  methods: {
    loadData() {
      if (!this.userId) return;

      let para = {
        id: this.userId,
      };
      getUserDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
        }
      });
    },
    loadPlatformType() {
      getPlatformTypeDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.platformTypeOptions = data;
          console.log("平台类型：", data);
        }
      });
    },
    loadPlatformData() {
      this.$refs.platform.clearSelection();
      if (this.data_local.UserType == "2") {
        //"单位账户"
        getSubordinateUnitDataSource().then((res) => {
          if (res.resultType == 0) {
            const data = JSON.parse(res.message);
            this.platformOptions = data;
          }
        });
      } else if (this.data_local.UserType == "3") {
        //"体检中心账户"
        getMedicalCenterDataSource().then((res) => {
          if (res.resultType == 0) {
            const data = JSON.parse(res.message);
            this.platformOptions = data;
          }
        });
      } else if (this.data_local.UserType == "5") {
        this.platformOptions = [];
        //"后台管理员"
      }
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
            userName: this.data_local.UserName,
            userNickName: this.data_local.UserNickName,
            loginName: this.data_local.LoginName,
            idNumber: this.data_local.IdNumber,
            mobile: this.data_local.Mobile,
            remark: this.data_local.Remark,
            userType: this.data_local.UserType,
            unitID: this.data_local.UnitID,
          };

          if (this.mark === "add") {
            addUser(para).then((res) => {
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
            para.ID = this.userId;
            para.status = this.data_local.Status;

            editUser(para).then((res) => {
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
  },
};
</script>
<style lang='sass' scoped>
</style>
