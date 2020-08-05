<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 名称 -->
          <vs-input
            label="名称"
            v-model="data_local.Name"
            class="w-full"
            name="名称"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('名称')">{{ errors.first('名称') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 编码 -->
          <vs-input
            label="编码"
            v-model="data_local.Code"
            class="w-full"
            name="编码"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('编码')">{{ errors.first('编码') }}</span>
        </div>
       
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input class="w-full" label="描述" v-model="data_local.Remark" name="描述" />
          <span class="text-danger text-sm" v-show="errors.has('描述')">{{ errors.first('描述') }}</span>
        </div>
         <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 状态 -->
          <label class="vs-input--label">状态</label>
          <div class="mt-2">
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
  getSysDictionaryDetail,
  addSysDictionary,
  updateSysDictionary,
} from "@/http/dictionary.js";

import {
  getProjectTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource,
} from "@/http/data_source.js";
import {
  addProjectItem,
  editProjectItem,
  getProjectItemDetails,
} from "@/http/package.js";

export default {
  name: "",
  components: {
    vSelect,
  },
  props: {
    dictionaryID: {
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
    };
  },
  computed: {},
  created() {
    // this.loadMaritalStatus();
    // this.loadGender();
    // this.loadItemTypeData();
    this.loadData();
  },
  mounted() {},
  methods: {
    loadData() {
      if (!this.projectItemId) return;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        mecid: userInfo.mecID,
        id: this.projectItemId,
      };
      getProjectItemDetails(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
        }
      });
    },
    save_changes() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));

          let para = {
            singleName: this.data_local.SingleName,
            sort: this.data_local.Sort,
            remark: this.data_local.Remark,
            mecid: userInfo.mecID,
            isOptional: this.data_local.IsOptional,
          };

          if (this.data_local.IsOptional) {
            para.singlePrice = this.data_local.SinglePrice;
            para.marriage = this.data_local.Marriage;
            para.gender = this.data_local.Gender;
            para.itemTypeID =
              this.data_local.ItemTypeID != null
                ? this.data_local.ItemTypeID.Value
                : null;
          }
          if (this.mark === "add") {
            addProjectItem(para).then((res) => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success",
                });
                this.$emit("loadData");
                this.cancel();
              }
            });
          } else if (this.mark == "edit") {
            para.ID = this.projectItemId;
            para.isLocked = this.data_local.IsLocked;
            editProjectItem(para).then((res) => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
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
