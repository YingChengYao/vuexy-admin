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
        <div class="vx-col md:w-1/2 w-full mt-6" v-if="projectId">
          <label class="vs-input--label">是否锁定</label>
          <vs-switch v-model="data_local.IsLocked" />
        </div>

        <div class="vx-col w-full mt-4">
          <vs-select
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

    <!-- <vx-card title="单项管理" class="p-6">
      <vs-table
        ref="table"
        stripe
        :data="types"
        multiple
        v-model="selected"
        @selected="handleSelected"
      >
        <template slot="thead">
          <vs-th>编号</vs-th>
          <vs-th>项目单项名称</vs-th>
          <vs-th>是否作为项目使用</vs-th>
          <vs-th>排序</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p>{{ indextr+1 }}</p>
              </vs-td>
              <vs-td :data="tr.SingleName">
                <p>{{ tr.SingleName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.IsOptional?'是':'否' }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Sort }}</p>
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
    </vx-card>-->
  </div>
</template>

<script>
import vSelect from "vue-select";

import {
  getProjectTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource,
  getProjectItemDataSource
} from "@/http/data_source.js";
import {
  addProject,
  editProject,
  getProjectDetail,
  getProjectItems
} from "@/http/package.js";

export default {
  name: "",
  components: {
    vSelect
  },
  props: {
    projectId: String,
    default: ""
  },
  data() {
    return {
      mark: null,

      data_local: {
        Singles: []
      },

      projectTypeOptions: [],
      marriageOptions: [],
      genderOptions: [],
      projectItemOptions: [],

      //单项
      types: [],
      singleNameInput: null,
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,
      selected: []
    };
  },
  computed: {},
  created() {
    this.initValues();
    this.loadData();
    this.loadItemData();
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
        Singles: []
      };
    },
    loadData() {
      if (!this.projectId) return;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        mecid: userInfo.mecID,
        itemId: this.projectId
      };
      getProjectDetail(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
        }
      });
    },
    loadItemData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        mecid: userInfo.mecID,
        singleName: this.singleNameInput,
        isLocked: false
      };

      getProjectItems(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("单项：", data);
          this.types = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    save_changes() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          let singles = "";
          if (this.data_local.Singles.length > 0) {
            singles = this.data_local.Singles.map(r => r).join(",");
          }

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
            isLocked: this.data_local.isLocked
          };

          if (!this.projectId) {
            addProject(para).then(res => {
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
          } else if (this.projectId) {
            para.ID = this.projectId;
            para.isLocked = this.data_local.IsLocked;
            editProject(para).then(res => {
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
      this.$emit("closePop", false);
    },
    handleSelected(tr) {
      console.log("this.selected:", this.selected);
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
        }
      });
    },
    loadProjectTypeData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        mecid: userInfo.mecID
      };
      getProjectTypeDataSource(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.projectTypeOptions = data;
        }
      });
    },
    loadProjectItemData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        mecid: userInfo.mecID
      };
      getProjectItemDataSource(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.projectItemOptions = data;
        }
      });
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
