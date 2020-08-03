<template>
  <div id="user-edit-tab-info">
    <vx-card>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-select label="项目分类" v-model="data_local.ItemTypeID" class="w-full select-large">
            <vs-select-item
              v-for="(item,index) in projectTypeOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>
          <!-- <span class="text-danger text-sm" v-show="errors.has('项目分类')">{{ errors.first('项目分类') }}</span> -->
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 项目名称 -->
          <vs-input
            label="项目名称"
            v-model="data_local.ItemName"
            class="w-full"
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
            class="w-full"
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
        <div class="vx-col md:w-1/2 w-full mt-4">
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

        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input class="w-full" label="备注" v-model="data_local.Remark" name="备注" />
          <span class="text-danger text-sm" v-show="errors.has('备注')">{{ errors.first('备注') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-6" v-if="projectID">
          <label class="vs-input--label">是否锁定</label>
          <vs-switch v-model="data_local.IsLocked" />
        </div>

        <div class="vx-col w-full mt-4">
          <project-item-list
            ref="projectItem"
            :isPop="true"
            :multipleCheck="true"
            tableTitle="单项配置"
          ></project-item-list>

          <!-- <vs-select
            label="单项管理"
            v-model="data_local.Singles"
            class="w-full select-large"
            multiple
            :autocomplete="true"
          >
            <vs-select-item
              v-for="(item,index) in projectItemOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>-->
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
import ProjectItemList from "views/medical/project_item/List";

import {
  getProjectTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource,
  getProjectItemDataSource,
} from "@/http/data_source.js";
import {
  addProject,
  editProject,
  getProjectDetail,
  getSinglesForProject,
} from "@/http/package.js";

export default {
  name: "",
  components: {
    vSelect,
    ProjectItemList,
  },
  props: {
    projectID: String,
    default: "",
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
    this.initValues();
    this.loadData();
  },
  mounted() {
    this.loadMaritalStatus();
    this.loadGender();
    this.loadProjectTypeData();
    this.loadProjectItemData();
  },
  methods: {
    initValues() {
      this.data_local = {
        Singles: [],
      };
    },
    loadData() {
      if (!this.projectID) return;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        mecid: userInfo.mecID,
        itemId: this.projectID,
      };
      getProjectDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
          console.log("项目详情:", data);
        }
      });
    },
    loadSingleData() {
      if (!this.projectID) return;

      let para = {
        itemID: this.projectID,
      };
      getSinglesForProject(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
          this.$refs.medicalCenter.loadSelectedData(data.PlanPhysical);
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
            mecid: userInfo.mecID,
            isLocked: this.data_local.isLocked,
          };

          if (!this.projectID) {
            addProject(para).then((res) => {
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
          } else if (this.projectID) {
            para.ID = this.projectID;
            para.isLocked = this.data_local.IsLocked;
            editProject(para).then((res) => {
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
        mecid: userInfo.mecID,
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
        mecid: userInfo.mecID,
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
