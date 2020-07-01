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

          <vs-input class="w-full mt-4" label="备注" v-model="data_local.Remark" name="备注" />
          <span class="text-danger text-sm" v-show="errors.has('备注')">{{ errors.first('备注') }}</span>

          <div class="mt-4">
            <label class="vs-input--label">标识</label>
            <v-select
              multiple
              :closeOnSelect="false"
              v-model="data_local.PackageTypes"
              label="Name"
              :options="packageTypeOptions"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
          </div>
        </div>
        <div class="vx-col md:w-1/2 w-full">
          <div class="mt-4">
            <vs-select label="婚姻状况" v-model="data_local.Marriage" class="w-full select-large">
              <vs-select-item
                v-for="(item,index) in marriageOptions"
                :key="index"
                :value="item.Value"
                :text="item.Name"
                class="w-full"
              />
            </vs-select>
          </div>

          <div class="mt-4">
            <vs-select label="性别" v-model="data_local.Gender" class="w-full select-large">
              <vs-select-item
                v-for="(item,index) in genderOptions"
                :key="index"
                :value="item.Value"
                :text="item.Name"
                class="w-full"
              />
            </vs-select>
          </div>

          <div class="mt-4">
            <label class="vs-input--label">是否锁定</label>
            <vs-switch v-model="data_local.IsLocked" />
          </div>
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
  getPackageTypes,
  getMaritalDataSource,
  getGenderDataSource
} from "@/http/data_source.js";
import { addPackage, editPackage, getPackageDetails } from "@/http/package.js";

export default {
  name: "",
  components: {
    vSelect
  },
  data() {
    return {
      packageId: null,
      mark: null,

      data_local: {},
      marriageOptions: [],
      genderOptions: [],
      packageTypeOptions: []
    };
  },
  computed: {
    marital_status: {
      get() {
        return {
          Name: this.data_local.MarriageName,
          Value: this.data_local.Marriage
        };
      },
      set(obj) {
        this.data_local.Marriage = obj.Value;
        this.data_local.MarriageName = obj.Name;
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
        this.data_local.Gender = obj.Value;
        this.data_local.GenderName = obj.Name;
      }
    }
  },
  created() {
    this.initData();
    this.loadMaritalStatus();
    this.loadGender();
    this.loadPackageTypes();
    this.loadData();
  },
  mounted() {},
  methods: {
    initData() {
      let params = this.$route.params;
      this.packageId = params.id;
      this.mark = params.mark;
    },
    loadData() {
      if (!this.packageId) return;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        mecid: userInfo.mecID,
        packageId: this.packageId
      };
      getPackageDetails(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
          console.log("套餐详情：", data);
        }
      });
    },
    save_changes() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          let packageTypes = null;
          if (this.data_local.PackageTypes) {
            packageTypes = this.data_local.PackageTypes.map(r => r.Value).join(
              ","
            );
          }

          let para = {
            packageName: this.data_local.PackageName,
            marriage: this.data_local.Marriage,
            gender: this.data_local.Gender,
            remark: this.data_local.Remark,
            sort: this.data_local.Sort,
            mecid: userInfo.mecID,
            packageType: packageTypes,
            isLocked: this.data_local.IsLocked
          };
          if (this.mark == "add") {
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
          } else if (this.mark == "edit") {
            para.ID = this.packageId;
            editPackage(para).then(res => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success"
                });
                this.cancel();
              }
            });
          }
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
          console.log("性别：", data);
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
