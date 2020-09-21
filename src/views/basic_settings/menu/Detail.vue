<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-input--label">父级菜单</label>
          <v-select
            v-model="data_local.ParentID"
            label="name"
            :options="menuOptions"
            :reduce="m => m.value"
          >
            <template v-slot:option="option">
              <span :style="'margin-left:'+ (option.level)*10 +'px'"></span>
              {{ option.name }}
            </template>
          </v-select>
        </div>
        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4 xrequired"
            label="菜单展示名称"
            v-model="data_local.DisplayName"
            v-validate="'required'"
            name="菜单展示名称"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('菜单展示名称')"
          >{{ errors.first('菜单展示名称') }}</span>
        </div>

        <div class="vx-col md:w-1/2 w-full">
          <vs-input class="w-full mt-4" label="路由name" v-model="data_local.Name" />
        </div>
        <div class="vx-col md:w-1/2 w-full xrequired">
          <vs-input
            class="w-full mt-4"
            label="路由path"
            v-model="data_local.Path"
            v-validate="'required'"
            name="路由path"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('路由path')"
          >{{ errors.first('路由path') }}</span>
        </div>

        <div class="vx-col md:w-1/2 w-full">
          <vs-input class="w-full mt-4" label="图标" v-model="data_local.Icon" />
        </div>

        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4 xrequired"
            label="文件路径"
            v-model="data_local.Component"
            v-validate="'required'"
            name="文件路径"
          />
          <span class="text-danger text-sm" v-show="errors.has('文件路径')">{{ errors.first('文件路径') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full">
          <vs-input class="w-full mt-4" label="描述" v-model="data_local.Remark" />
        </div>

        <div class="vx-col md:w-1/2 w-full">
          <!-- 排序 -->
          <vs-input
            label="排序"
            v-model="data_local.Sort"
            class="mt-4 w-full"
            name="排序"
            v-validate="'numeric'"
          />
          <span class="text-danger text-sm" v-show="errors.has('排序')">{{ errors.first('排序') }}</span>
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

import { getMenusDataSource } from "@/http/data_source.js";
import { addMenu, editMenu, getMenuDetail } from "@/http/basic_setting.js";

export default {
  components: {
    vSelect,
  },
  props: {
    menuId: {
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
      menuOptions: [],
    };
  },
  computed: {},
  created() {
    this.loadMenus();
    this.loadData();
  },
  mounted() {},
  methods: {
    loadData() {
      if (!this.menuId) return;

      let para = {
        id: this.menuId,
      };
      getMenuDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
          console.log("菜单详情：", data);
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
          let para = {
            parentID: this.data_local.ParentID,
            path: this.data_local.Path,
            name: this.data_local.Name,
            displayName: this.data_local.DisplayName,
            icon: this.data_local.Icon,
            isHide: this.data_local.IsHide,
            component: this.data_local.Component,
            remark: this.data_local.Remark,
            sort: this.data_local.Sort,
          };

          if (this.mark === "add") {
            addMenu(para).then((res) => {
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
            para.ID = this.menuId;
            para.status = this.data_local.Status;

            editMenu(para).then((res) => {
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
    loadMenus() {
      getMenusDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.menuOptions = [];
          console.log("this.menuOptions", this.menuOptions);
          // let b = composeTree(data, "Value", "ParentID");
          this.initMenuData(data, 0, null);
        }
      });
    },
    initMenuData(items, level, parent) {
      if (!Array.isArray(items)) {
        return;
      }
      items.map((item, index) => {
        item = Object.assign({}, item, {
          parent: parent,
          level: level,
        });
        if (item.children != undefined && item.children.length > 0) {
          item = Object.assign({}, item, {
            isExpand: true,
          });
        }
        if (typeof item.isChecked == "undefined") {
          item = Object.assign({}, item, {
            isChecked: false,
          });
        }
        if (typeof item.isShow == "undefined") {
          item = Object.assign({}, item, {
            isShow: true,
          });
        }
        this.menuOptions.push(item);

        this.initMenuData(item.children, level + 1, item.value);
      });
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
