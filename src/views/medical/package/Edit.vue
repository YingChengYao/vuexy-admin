<template>
  <div id="user-edit-tab-info">
    <vx-card title="套餐信息">
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4"
            label="套餐名称"
            v-model="data_local.PackageName"
            v-validate="'required'"
            name="套餐名称"
          />
          <span class="text-danger text-sm" v-show="errors.has('套餐名称')">{{ errors.first('套餐名称') }}</span>

          <vs-input class="w-full mt-4" label="备注" v-model="data_local.remark" name="备注" />
          <span class="text-danger text-sm" v-show="errors.has('备注')">{{ errors.first('备注') }}</span>

          <div class="mt-4">
            <label class="vs-input--label">标识</label>
            <v-select
              multiple
              :closeOnSelect="false"
              :value="data_local.PackageType"
              label="Name"
              :options="packageTypeOptions"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
          </div>
        </div>
        <div class="vx-col md:w-1/2 w-full">
          <div class="mt-4">
            <label class="vs-input--label">婚姻状况</label>
            <v-select
              v-model="marital_status"
              label="Name"
              :options="marriageOptions"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
          </div>

          <div class="mt-4">
            <label class="vs-input--label">性别</label>
            <v-select
              v-model="data_local.Gender"
              label="Name"
              :options="genderOptions"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
          </div>

          <div class="mt-4">
            <label class="vs-input--label">是否锁定</label>
            <vs-switch v-model="data_local.IsLocked" />
          </div>
        </div>
      </div>

      <!-- <vx-card class="mt-base" no-shadow card-border>
        <div class="vx-row">
          <div class="vx-col w-full">
            <div class="flex items-end px-3">
              <span class="font-medium text-lg leading-none">标识</span>
            </div>
            <vs-divider />
          </div>
        </div>

        <div class="block overflow-x-auto"></div>
      </vx-card>-->

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
  getPackageTypes,
  getMaritalDataSource,
  getGenderDataSource
} from "@/http/data_source.js";
import { addPackage, editPackage } from "@/http/package.js";

export default {
  name: "",
  components: {
    vSelect
  },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      data_local: {},
      marriageOptions: [],
      genderOptions: [],
      packageTypeSelected: [],
      packageTypeOptions: [],
      gender_local1:null,

      marital_status: {
        get() {
          return {
            label: this.data_local.MaritalStatusName,
            value: this.data_local.MaritalStatus
          };
        },
        set(obj) {
          this.data_local.MaritalStatus = obj.Value;
          this.data_local.MaritalStatusName = obj.Name;
        }
      },
      gender_local: {
        get() {
          return {
            Name: this.data_local.GenderName,
            Value: this.data_local.Gender
          };
        },
        set(obj) {
            debugger
            console.log(obj)
          this.data_local.Gender = obj.Value;
          this.data_local.GenderName = obj.Name;
        }
      }
    };
  },
  created() {
    this.loadMaritalStatus();
    this.loadGender();
    this.loadPackageTypes();
    console.log("id:",this.id)
  },
  mounted() {},
  methods: {
    save_changes() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          let para = {
            packageName: this.data_local.PackageName,
            marriage: this.data_local.MaritalStatus.Value,
            gender: this.data_local.Gender.Value,
            remark: this.data_local.Remark,
            sort: this.data_local.Sort,
            mecid: userInfo.mecID
          };
          addPackage(para).then(res => {
            if (res.resultType == 0) {
              this.$vs.notify({
                title: "Success",
                text: res.message,
                color: "success"
              });
              this.cancel();
            }
          });
          //   if (this.data.mark == "add") {
          //     addPackage(para).then(res => {
          //       if (res.resultType == 0) {
          //         this.$vs.notify({
          //           title: "Success",
          //           text: res.message,
          //           color: "success"
          //         });
          //         this.$emit("closeSidebar");
          //         this.$emit("loadData");
          //         this.initValues();
          //       }
          //     });
          //   } else if (this.data.mark == "edit") {
          //     para.ID = this.data.ID;
          //     editItem(para).then(res => {
          //       if (res.resultType == 0) {
          //         this.$vs.notify({
          //           title: "Success",
          //           text: res.message,
          //           color: "success"
          //         });
          //         this.$emit("loadData");
          //         this.$emit("closeSidebar");
          //         this.initValues();
          //       }
          //     });
          //   }
        }
      });
    },
    cancel() {
      this.$router.push("/package").catch(() => {});
    },
    loadMaritalStatus() {
      getMaritalDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.marriageOptions = data;
        }
      });
    },
    loadGender() {
      getGenderDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.genderOptions = data;
          console.log('性别：',data)
        }
      });
    },
    loadPackageTypes() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        mecid: userInfo.mecID
      };
      getPackageTypes(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.packageTypeOptions = data;
        }
      });
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
