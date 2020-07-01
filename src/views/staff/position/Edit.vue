<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <!-- 职位名称 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="职位名称"
            v-model="data_local.PositionName"
            class="w-full"
            name="职位名称"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('职位名称')">{{ errors.first('职位名称') }}</span>
        </div>
        <!-- 排序 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input label="排序" v-model="data_local.Sort" class="w-full" name="排序" v-validate="'numeric'" />
          <span class="text-danger text-sm" v-show="errors.has('排序')">{{ errors.first('排序') }}</span>
        </div>

        <!-- 备注 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input label="备注" v-model="data_local.Remark" class="w-full" />
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
import { addPosition } from "@/http/staff.js";

export default {
  name: "",
  components: {
    vSelect
  },
  props: {
    positionId: {
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
      provinceOptions: [],
      cityOptions: [],
      countyOptions: [],
      streetOptions: []
    };
  },
  computed: {},
  created() {
    //this.initData();
    this.loadMaritalStatus();
    this.loadGender();
    this.loadItemTypeData();
    this.loadData();
  },
  mounted() {},
  methods: {
    loadData() {
      if (!this.positionId) return;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        companyID: userInfo.companyID,
        positionName: this.data_local.PositionName
      };
      getProjectItemDetails(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
        }
      });
    },
    save_changes() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));

          let para = {
            companyID: userInfo.companyID,
            positionName1: this.data_local.PositionName,
            sort: this.data_local.Sort,
            remark: this.data_local.Remark
          };

          if (this.mark === "add") {
            addPosition(para).then(res => {
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
            para.ID = this.positionId;
            para.isLocked = this.data_local.IsLocked;
            editProjectItem(para).then(res => {
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
