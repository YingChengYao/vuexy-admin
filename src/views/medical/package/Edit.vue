<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full">
          <div class="mt-4">
            <label class="vs-input--label">套餐名称</label>
            <span class="required" style="color:red">*</span>
            <vs-input
              class="w-full"
              v-model="data_local.PackageName"
              v-validate="'required'"
              name="套餐名称"
            />
            <span class="text-danger text-sm" v-show="errors.has('套餐名称')">{{ errors.first('套餐名称') }}</span>
          </div>

          <vs-input class="w-full mt-4" label="备注" v-model="data_local.Remark" name="备注" />
          <span class="text-danger text-sm" v-show="errors.has('备注')">{{ errors.first('备注') }}</span>

          <div class="mt-4">
            <label class="vs-input--label">类型</label>
            <v-select
              multiple
              :closeOnSelect="false"
              v-model="data_local.PackageTypes"
              label="Name"
              :options="packageTypeOptions"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
          </div>

          <div class="mt-4"></div>

          <div class="mt-4" v-if="packageID">
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
        <div class="vx-col md:w-1/2 w-full">
          <div class="mt-4">
            <label class="vs-select--label">婚姻状况</label>
            <v-select
              v-model="data_local.Marriage"
              label="Name"
              value="Value"
              :options="marriageOptions"
              :reduce="m => m.Value"
            />
          </div>

          <div class="mt-4">
            <label class="vs-select--label">性别</label>
            <v-select
              v-model="data_local.Gender"
              label="Name"
              value="Value"
              :options="genderOptions"
              :reduce="m => m.Value"
            />
          </div>

          <div class="mt-4">
            <!-- 排序 -->
            <vs-input
              label="排序"
              v-model="data_local.Sort"
              class="w-full"
              name="排序"
              v-validate="'numeric'"
            />
            <span class="text-danger text-sm" v-show="errors.has('排序')">{{ errors.first('排序') }}</span>
          </div>
        </div>
      </div>

      <!-- Save & Reset Button -->
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" @click.stop="save_changes" v-preventClick>保存</vs-button>
            <vs-button class="ml-4 mt-2" type="border" color="warning" @click.stop="cancel">取消</vs-button>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import {
  getPackageTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource,
  getDataStatusDataSource,
} from "@/http/data_source.js";
import { addPackage, editPackage, getPackageDetails } from "@/http/package.js";

export default {
  name: "",
  components: {},
  props: {
    packageID: {
      type: String,
      default: "",
    },
    mark: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      // packageId: null,
      // mark: null,

      data_local: {},
      marriageOptions: [],
      genderOptions: [],
      packageTypeOptions: [],
      statusOptions: [],
    };
  },
  computed: {
    // marital_status: {
    //   get() {
    //     return {
    //       Name: this.data_local.MarriageName,
    //       Value: this.data_local.Marriage,
    //     };
    //   },
    //   set(obj) {
    //     this.data_local.Marriage = obj.Value;
    //     this.data_local.MarriageName = obj.Name;
    //   },
    // },
    gender_local: {
      get() {
        return {
          Name: this.data_local.GenderName,
          Value: this.data_local.Gender,
        };
      },
      set(obj) {
        this.data_local.Gender = obj.Value;
        this.data_local.GenderName = obj.Name;
      },
    },
  },
  created() {
    this.loadDataStatus();
    this.loadMaritalStatus();
    this.loadGender();
    this.loadPackageTypes();
    this.loadData();
  },
  mounted() {},
  methods: {
    // initData() {
    //   let params = this.$route.params;
    //   this.packageId = params.id;
    //   this.mark = params.mark;
    // },
    loadData() {
      if (!this.packageID) return;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        mecid: userInfo.mecID,
        packageID: this.packageID,
      };
      getPackageDetails(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
          console.log("套餐详情：", data);
        }
      });
    },
    save_changes() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          let packageTypes = null;
          if (this.data_local.PackageTypes) {
            packageTypes = this.data_local.PackageTypes.map(
              (r) => r.Value
            ).join(",");
          }

          let para = {
            packageName: this.data_local.PackageName,
            marriage: this.data_local.Marriage,
            gender: this.data_local.Gender,
            remark: this.data_local.Remark,
            sort: this.data_local.Sort,
            mecid: userInfo.mecID,
            packageType: packageTypes,
            status: this.data_local.Status,
          };
          if (this.mark == "add") {
            addPackage(para).then((res) => {
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
            para.ID = this.packageID;
            editPackage(para).then((res) => {
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
        }
      });
    },
    loadPackageTypes() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        mecid: userInfo.mecID,
      };
      getPackageTypeDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.packageTypeOptions = data;
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
  },
};
</script>
<style lang='sass' scoped>
</style>
