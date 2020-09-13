<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4 xrequired"
            label="项目单项名称"
            v-model="data_local.SingleName"
            v-validate="'required'"
            name="项目单项名称"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('项目单项名称')"
          >{{ errors.first('项目单项名称') }}</span>

          <!-- 排序 -->
          <vs-input
            label="排序"
            v-model="data_local.Sort"
            class="mt-4 w-full"
            name="排序"
            v-validate="'numeric'"
          />
          <span class="text-danger text-sm" v-show="errors.has('排序')">{{ errors.first('排序') }}</span>

          <!-- 项目单项价格 -->
          <div class="mt-4" v-show="data_local.IsOptional">
            <vs-input
              label="项目单项价格"
              v-model="data_local.SinglePrice"
              class="w-full"
              name="项目单项价格"
              v-validate="'decimal:2'"
            />
            <span
              class="text-danger text-sm"
              v-show="errors.has('项目单项价格')"
            >{{ errors.first('项目单项价格') }}</span>
          </div>

          <!-- 性别 -->
          <div class="mt-4" v-show="data_local.IsOptional">
            <label class="vs-select--label">性别</label>
            <v-select
              v-model="data_local.Gender"
              label="Name"
              value="Value"
              :options="genderOptions"
              :reduce="m => m.Value"
            />
          </div>

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
        <div class="vx-col md:w-1/2 w-full">
          <vs-input class="w-full mt-4" label="描述" v-model="data_local.Remark" name="remark" />

          <div class="mt-4">
            <label class="vs-input--label">是否作为项目使用</label>
            <div class="mt-2">
              <vs-switch v-model="data_local.IsOptional" />
            </div>
          </div>

          <div class="mt-6" v-show="data_local.IsOptional">
            <label class="vs-select--label">婚姻状况</label>
            <v-select
              v-model="data_local.Marriage"
              label="Name"
              value="Value"
              :options="marriageOptions"
              :reduce="m => m.Value"
            />
          </div>

          <div class="mt-4" v-if="data_local.IsOptional">
            <label class="vs-select--label xrequired">项目分类</label>
            <v-select
              v-model="data_local.ItemTypeID"
              label="Name"
              value="Value"
              :options="projectTypeStatus"
              :reduce="m => m.Value"
              name="项目分类"
              v-validate="'required'"
            />
            <span class="text-danger text-sm" v-show="errors.has('项目分类')">{{ errors.first('项目分类') }}</span>
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
  getProjectTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource,
  getDataStatusDataSource,
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
    projectItemId: {
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
    };
  },
  computed: {},
  created() {
    console.log(0);
    //this.initData();
    this.loadMaritalStatus();
    this.loadGender();
    this.loadItemTypeData();
    this.loadData();
    this.loadDataStatus();
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
          console.log("单项详情：", data);
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
            para.itemTypeID = this.data_local.ItemTypeID;
          }
          if (this.mark === "add") {
            addProjectItem(para).then((res) => {
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
            para.ID = this.projectItemId;
            para.status = this.data_local.Status;

            editProjectItem(para).then((res) => {
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
