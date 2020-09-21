<template>
  <div id="user-edit-tab-info">
    <vx-card>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-input--label">项目分类</label>
          <v-select
            v-model="data_local.ItemTypeID"
            label="Name"
            value="Value"
            :options="projectTypeOptions"
            :reduce="m => m.Value"
          />
          <span class="text-danger text-sm" v-show="errors.has('项目分类')">{{ errors.first('项目分类') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 项目名称 -->
          <vs-input
            label="项目名称"
            v-model="data_local.ItemName"
            class="w-full xrequired"
            name="项目名称"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('项目名称')">{{ errors.first('项目名称') }}</span>
        </div>

        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 项目价格 -->
          <vs-input
            label="项目价格"
            v-model="data_local.ItemPrice"
            class="w-full xrequired"
            name="项目价格"
            v-validate="'required|decimal:2'"
          />
          <span class="text-danger text-sm" v-show="errors.has('项目价格')">{{ errors.first('项目价格') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
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

        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-input--label">婚姻状况</label>
          <v-select
            v-model="data_local.Marriage"
            label="Name"
            value="Value"
            :options="marriageOptions"
            :reduce="m => m.Value"
          />
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-input--label">性别</label>
          <v-select
            v-model="data_local.Gender"
            label="Name"
            value="Value"
            :options="genderOptions"
            :reduce="m => m.Value"
          />
        </div>

        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input class="w-full" label="备注" v-model="data_local.Remark" name="备注" />
          <span class="text-danger text-sm" v-show="errors.has('备注')">{{ errors.first('备注') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4" v-if="projectId">
          <label class="vs-input--label">状态</label>
          <v-select
            v-model="data_local.Status"
            label="Name"
            value="Value"
            :options="statusOptions"
            :reduce="m => m.Value"
          />
        </div>

        <div class="vx-col w-full mt-4">
          <project-item-list
            ref="projectItem"
            :isPop="true"
            :multipleCheck="true"
            tableTitle="单项配置"
          ></project-item-list>
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
import ProjectItemList from "views/medical/project_item/List";

import {
  getProjectTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource,
  getProjectItemDataSource,
  getDataStatusDataSource,
} from "@/http/data_source.js";
import { addProject, editProject, getProjectDetail } from "@/http/package.js";

export default {
  name: "",
  components: {
    vSelect,
    ProjectItemList,
  },
  props: {
    projectId: {
      type: String,
      default: "",
    },
    mecId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      mark: null,

      data_local: {
        Singles: [],
      },

      projectTypeOptions: [],
      marriageOptions: [],
      genderOptions: [],
      projectItemOptions: [],
      statusOptions: [],

      //单项
      singleNameInput: null,
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,
      selected: [],
    };
  },
  computed: {},
  created() {
    // this.initValues();
    this.loadData();
  },
  mounted() {
    this.loadMaritalStatus();
    this.loadGender();
    this.loadProjectTypeData();
    this.loadProjectItemData();
    this.loadDataStatus();
  },
  methods: {
    // initValues() {
    //   this.data_local = {
    //     Singles: [],
    //   };
    // },
    loadData() {
      if (!this.projectId) return;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        mecid: userInfo.unitId,
        itemId: this.projectId,
      };
      getProjectDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
          console.log("项目详情:", data.SingleList);
          this.$refs.projectItem.loadSelectedData(data.SingleList);
          console.log("项目详情:", data);
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

          let singles = this.$refs.projectItem.selected
            .map((r) => r.ID)
            .join(",");

          let para = {
            itemTypeID: this.data_local.ItemTypeID,
            itemName: this.data_local.ItemName,
            itemPrice: this.data_local.ItemPrice,
            isMandatory: this.data_local.IsMandatory,
            singles: singles,
            marriage: this.data_local.Marriage,
            gender: this.data_local.Gender,
            remark: this.data_local.Remark,
            sort: this.data_local.Sort,
            mecid: userInfo.unitId,
            status: this.data_local.Status,
          };

          if (!this.projectId) {
            addProject(para).then((res) => {
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
          } else if (this.projectId) {
            para.ID = this.projectId;
            para.isLocked = this.data_local.IsLocked;
            editProject(para).then((res) => {
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
    handleSelected(tr) {
      console.log("this.selected:", this.selected);
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
    loadProjectTypeData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        mecid: userInfo.unitId,
      };
      getProjectTypeDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.projectTypeOptions = data;
        }
      });
    },
    loadProjectItemData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        mecid: userInfo.unitId,
      };
      getProjectItemDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.projectItemOptions = data;
        }
      });
    },
  },
};
</script>
<style lang='sass' scoped>
</style>
