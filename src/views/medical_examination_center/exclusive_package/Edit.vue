<template>
  <div>
    <vx-card title="基本信息">
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4 xrequired"
            label="套餐名称"
            v-model="data_local.PackageName"
            v-validate="'required'"
            name="套餐名称"
          />
          <span class="text-danger text-sm" v-show="errors.has('套餐名称')">{{ errors.first('套餐名称') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full">
          <div class="mt-4">
            <label class="vs-select--label xrequired">婚姻状况</label>
            <v-select
              v-model="data_local.Marriage"
              label="Name"
              value="Value"
              :options="marriageOptions"
              :reduce="m => m.Value"
            />
          </div>
        </div>

        <div class="vx-col md:w-1/2 w-full">
          <vs-input class="w-full mt-4" label="备注" v-model="data_local.Remark" name="备注" />
        </div>
        <div class="vx-col md:w-1/2 w-full">
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
        </div>

        <div class="vx-col md:w-1/2 w-full">
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
            <label class="vs-select--label xrequired">套餐级别</label>
            <v-select
              v-model="data_local.StandardID"
              label="Name"
              value="Value"
              :options="standardOptions"
              :reduce="m => m.Value"
              v-validate="'required'"
              name="套餐级别"
            />
            <span class="text-danger text-sm" v-show="errors.has('套餐级别')">{{ errors.first('套餐级别') }}</span>
          </div>
        </div>
      </div>
    </vx-card>

    <vx-card title="配置项目" class="mt-6">
      <package-deploy-project
        ref="deployProject"
        @loadData="loadData"
        :packageID="packageID"
        :isUseButton="false"
      />
      <div class="text-right mt-5">
        <span>
          <vs-button @click="save" class="mr-2" v-preventClick>保存</vs-button>
        </span>
        <span class="px-2">
          <vs-button type="border" color="warning" @click="cancel">取消</vs-button>
        </span>
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from "vue-select";
import PackageDeployProject from "views/medical/package/DeployProject";

import {
  getPackageTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource,
  getStandardForPlanDataSource,
} from "@/http/data_source.js";
import { getItems } from "@/http/package.js";
import {
  addExclusivePackage,
  editExclusivePackage,
  getExclusivePackageDetail,
} from "@/http/plan.js";
import {
  accAdd,
  accSubtr,
  accMul,
  accDivCoupon,
} from "@/common/utils/data/calc";

export default {
  name: "",
  components: {
    vSelect,
    PackageDeployProject,
  },
  props: {
    packageID: {
      type: String,
      default: "",
    },
    planId: {
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
      packageTypeOptions: [],
      standardOptions: [],

      //filter
      itemNameInput: "",

      //ProjectPage
      totalPage: 0,
      totalItems: 0,
    };
  },
  computed: {
    packagePrice() {
      return this.$refs.deployProject.packagePrice;
    },
    discount() {
      return this.$refs.deployProject.discount;
    },
    discountPrice() {
      return this.$refs.deployProject.discountPrice;
    },
  },
  created() {
    if (this.mark == "edit") this.loadData();
  },
  mounted() {
    this.loadMaritalStatus();
    this.loadGender();
    this.loadPackageTypes();
    this.loadStandard();
  },
  methods: {
    loadData() {
      if (!this.packageID) return;
      let para = {
        packageID: this.packageID,
      };

      getExclusivePackageDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
          this.discount = data.Discount * 10;
          this.discountPrice = data.DiscountPrice;
          this.checkedGroup = data.PackageItem;
          console.log("this.items:", data);
          this.addIsChecked();
        }
      });
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
        mecid: userInfo.unitId,
      };
      getPackageTypeDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.packageTypeOptions = data;
        }
      });
    },
    loadStandard() {
      let para = {
        planId: this.planId,
      };
      getStandardForPlanDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.standardOptions = data;
        }
      });
    },
    cancel() {
      this.$emit("closePop");
    },
    save() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          let itemIDs = "";
          let projects = this.$refs.deployProject.projectList;

          if (!projects.length > 0) {
            this.$vs.notify({
              title: "错误提示",
              text: "请选择项目信息",
              color: "warning",
            });
          }
          itemIDs = projects
            .map((obj) => {
              return obj.ID;
            })
            .join(",");

          let packageTypes = null;
          if (this.data_local.PackageTypes) {
            packageTypes = this.data_local.PackageTypes.map(
              (r) => r.Value
            ).join(",");
          }

          let para = {
            planID: this.planId,
            packageName: this.data_local.PackageName,
            packagePrice: this.packagePrice,
            discount: this.discount / 10,
            discountPrice: this.discountPrice,
            marriage: this.data_local.Marriage,
            gender: this.data_local.Gender,
            remark: this.data_local.Remark,
            sort: this.data_local.Sort,
            itemIDs: itemIDs,
            standardID: this.data_local.StandardID,
            packageType: packageTypes,
          };

          if (this.mark == "add") {
            addExclusivePackage(para).then((res) => {
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
            para.packageID = this.packageID;
            editExclusivePackage(para).then((res) => {
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
  },
  watch: {},
};
</script>
<style lang='sass' scoped>
</style>
