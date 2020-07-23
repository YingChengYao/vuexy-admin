<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4"
            label="职工名称"
            v-model="data_local.EmployeeName"
            v-validate="'required'"
            name="职工名称"
          />
          <span class="text-danger text-sm" v-show="errors.has('职工名称')">{{ errors.first('职工名称') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4"
            label="身份证号"
            v-model="data_local.IdNo"
            v-validate="'required|id_card_no'"
            name="身份证号"
          />
          <span class="text-danger text-sm" v-show="errors.has('身份证号')">{{ errors.first('身份证号') }}</span>
        </div>

        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-select
            label="婚姻状况"
            v-model="data_local.Marital"
            class="w-full select-large"
            name="婚姻状况"
            v-validate="'required'"
          >
            <vs-select-item
              v-for="(item,index) in marriageOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>
          <span class="text-danger text-sm" v-show="errors.has('婚姻状况')">{{ errors.first('婚姻状况') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-select
            label="性别"
            v-model="data_local.Gender"
            class="w-full select-large"
            name="性别"
            v-validate="'required'"
          >
            <vs-select-item
              v-for="(item,index) in genderOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>
          <span class="text-danger text-sm" v-show="errors.has('性别')">{{ errors.first('性别') }}</span>
        </div>

        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4"
            label="手机号"
            v-model="data_local.Mobile"
            name="手机号"
            v-validate="'required|mobile'"
          />
          <span class="text-danger text-sm" v-show="errors.has('手机号')">{{ errors.first('手机号') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4" v-if="mark=='edit'">
          <vs-select label="在职状态" v-model="data_local.WorkingStatus" class="w-full select-large">
            <vs-select-item
              v-for="(item,index) in workingStatusOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>
        </div>

        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input class="w-full" label="备注" v-model="data_local.Remark" name="备注" />
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
import vSelect from "vue-select";

import {
  getMaritalForUserDataSource,
  getGenderForUserDataSource,
  getWorkingStatusDataSource
} from "@/http/data_source.js";
import { addEmployee, editEmployee } from "@/http/staff.js";

export default {
  name: "",
  components: {
    vSelect
  },
  props: {
    employeeID: {
      type: String,
      default: null
    },
    mark: {
      type: String,
      default: null
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      //id: null,
      //mark: null,

      data_local: {},
      marriageOptions: [],
      genderOptions: [],
      workingStatusOptions: []
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
      //let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      // let para = {
      //   mecid: userInfo.mecID,
      //   id: this.employeeID
      // };
      // getProjectItemDetails(para).then(res => {
      //   if (res.resultType == 0) {
      //     const data = JSON.parse(res.message);
      //     this.data_local = data;
      //   }
      // });
      console.log("data:", this.data);
      this.data_local = this.data;
    },
    save_changes() {
      this.$validator.validateAll().then(result => {
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
            Remark: this.data_local.Remark
          };

          if (this.mark === "add") {
            addEmployee(para).then(res => {
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
          } else if (this.mark == "edit") {
            para.ID = this.data_local.ID;

            editEmployee(para).then(res => {
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
    },
    loadMaritalStatus() {
      getMaritalForUserDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.marriageOptions = data;
        }
      });
    },
    loadGender() {
      getGenderForUserDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.genderOptions = data;
        }
      });
    },
    loadWorkingStatus() {
      getWorkingStatusDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.workingStatusOptions = data;
        }
      });
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
