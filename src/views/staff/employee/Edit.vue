<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4 xrequired"
            label="姓名"
            v-model="data_local.EmployeeName"
            v-validate="'required'"
            name="姓名"
          />
          <span class="text-danger text-sm" v-show="errors.has('姓名')">{{ errors.first('姓名') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4 xrequired"
            label="身份证号"
            v-model="data_local.IdNo"
            v-validate="'required|id_card_no'"
            name="身份证号"
          />
          <span class="text-danger text-sm" v-show="errors.has('身份证号')">{{ errors.first('身份证号') }}</span>
        </div>

        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-input--label xrequired">婚姻状况</label>
          <v-select
            v-model="data_local.Marital"
            label="Name"
            value="Value"
            :options="marriageOptions"
            :reduce="m => m.Value"
            name="婚姻状况"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('婚姻状况')">{{ errors.first('婚姻状况') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-input--label xrequired">性别</label>
          <v-select
            v-model="data_local.Gender"
            label="Name"
            value="Value"
            :options="genderOptions"
            :reduce="m => m.Value"
            name="性别"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('性别')">{{ errors.first('性别') }}</span>
        </div>

        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4 xrequired"
            label="手机号"
            v-model="data_local.Mobile"
            name="手机号"
            v-validate="'required|mobile'"
          />
          <span class="text-danger text-sm" v-show="errors.has('手机号')">{{ errors.first('手机号') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4" v-if="mark=='edit'">
          <label class="vs-input--label">状态</label>
          <v-select
            v-model="data_local.WorkingStatus"
            label="Name"
            value="Value"
            :options="workingStatusOptions"
            :reduce="m => m.Value"
          />
        </div>

        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input class="w-full" label="备注" v-model="data_local.Remark" name="备注" />
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
  getMaritalForUserDataSource,
  getGenderForUserDataSource,
  getWorkingStatusDataSource,
} from "@/http/data_source.js";
import {
  addEmployee,
  editEmployee,
  getEmployeesDetails,
} from "@/http/staff.js";

export default {
  name: "",
  components: {
    vSelect,
  },
  props: {
    employeeID: {
      type: String,
      default: null,
    },
    mark: {
      type: String,
      default: null,
    },
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      //id: null,
      //mark: null,

      data_local: {},
      marriageOptions: [],
      genderOptions: [],
      workingStatusOptions: [],
    };
  },
  computed: {},
  created() {
    this.loadData();
  },
  mounted() {
    this.loadMaritalStatus();
    this.loadGender();
    this.loadWorkingStatus();
  },
  methods: {
    loadData() {
      if (!this.employeeID) return;
      let para = {
        employeeID: this.employeeID,
      };
      getEmployeesDetails(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log(data);
          this.data_local = data;
        }
      });
    },
    save_changes() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          let para = {
            CompanyId: userInfo.companyID,
            EmployeeName: this.data_local.EmployeeName,
            Gender: this.data_local.Gender,
            Marital: this.data_local.Marital,
            IdNo: this.data_local.IdNo,
            Mobile: this.data_local.Mobile,
            WorkingStatus: this.data_local.WorkingStatus,
            Remark: this.data_local.Remark,
          };
          if (this.mark === "add") {
            addEmployee(para).then((res) => {
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
            para.ID = this.data_local.ID;

            editEmployee(para).then((res) => {
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
    loadMaritalStatus() {
      getMaritalForUserDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.marriageOptions = data;
        }
      });
    },
    loadGender() {
      getGenderForUserDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.genderOptions = data;
        }
      });
    },
    loadWorkingStatus() {
      getWorkingStatusDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.workingStatusOptions = data;
        }
      });
    },
  },
};
</script>
<style lang='sass' scoped>
</style>
