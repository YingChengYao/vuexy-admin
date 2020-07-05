<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-select label="父级单位" v-model="data_local.ParentID" class="w-full select-large">
            <vs-select-item
              v-for="(item,index) in genderOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 组织机构代码 -->
          <vs-input
            label="组织机构代码"
            v-model="data_local.CompanyCode"
            class="w-full"
            name="组织机构代码"
            v-validate="'required'"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('组织机构代码')"
          >{{ errors.first('组织机构代码') }}</span>
        </div>

        <!-- 单位名称 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="单位名称"
            v-model="data_local.CompanyName"
            class="w-full"
            name="单位名称"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('单位名称')">{{ errors.first('单位名称') }}</span>
        </div>
        <!-- 联系人 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input label="联系人" v-model="data_local.Contact" class="w-full" />
        </div>

        <!-- 联系电话 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input label="联系电话" v-model="data_local.Tel" class="w-full" />
        </div>
        <!-- 手机号 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input label="手机号" v-model="data_local.Mobile" class="w-full" />
        </div>

        <!-- 排序 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input label="排序" v-model="data_local.Sort" class="w-full" />
        </div>
        <!-- 备注 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input label="备注" v-model="data_local.Remark" class="w-full" />
        </div>

        <!-- 所属行业 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-select label="所属行业" v-model="data_local.Industry" class="w-full select-large">
            <vs-select-item
              v-for="(item,index) in industryOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>
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
  getProjectTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource
} from "@/http/data_source.js";
import {
  addEmployeeUnit,
  editEmployeeUnit,
  getEmployeeUnitDetail
} from "@/http/staff.js";

export default {
  name: "",
  components: {
    vSelect
  },
  props: {
    unitId: {
      type: String,
      default: null
    },
    mark: {
      type: String,
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
      industryOptions: [],
    };
  },
  computed: {},
  created() {
    this.loadMaritalStatus();
    this.loadGender();
    this.loadItemTypeData();
    this.loadData();
  },
  mounted() {},
  methods: {
    loadData() {
      if (!this.unitId) return;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        mecid: userInfo.mecID,
        id: this.unitId
      };
      // getProjectItemDetails(para).then(res => {
      //   if (res.resultType == 0) {
      //     const data = JSON.parse(res.message);
      //     this.data_local = data;
      //   }
      // });
    },
    save_changes() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));

          let para = {
            parentID: this.data_local.ParentID,
            companyCode: this.data_local.CompanyCode,
            companyName: this.data_local.CompanyName,
            contact: this.data_local.Contact,
            tel: this.data_local.Tel,
            mobile: this.data_local.Mobile,
            sort: this.data_local.Sort,
            industry: this.data_local.Industry,
            remark: this.data_local.Remark,
          };

          // if (this.data_local.IsOptional) {
          //   para.singlePrice = this.data_local.SinglePrice;
          //   para.marriage = this.data_local.Marriage;
          //   para.gender = this.data_local.Gender;
          //   para.itemTypeID =
          //     this.data_local.ItemTypeID != null
          //       ? this.data_local.ItemTypeID.Value
          //       : null;
          // }
          if (this.mark === "add") {
            addEmployeeUnit(para).then(res => {
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
            para.ID = this.unitId;
            para.isLocked = this.data_local.IsLocked;
            editEmployeeUnit(para).then(res => {
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
      //this.$router.push("/project_item").catch(() => {});
      this.$emit("closePop", false);
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
    loadItemTypeData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        mecid: userInfo.mecID
      };
      getProjectTypeDataSource(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.projectTypeStatus = data;
        }
      });
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
