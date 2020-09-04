<template>
  <div id class="data-list-container">
    <vs-popup fullscreen :title="title" :active.sync="popupActive">
      <project-edit @closePop="closePop" @loadData="loadData" :projectID="projectID" :key="timer" />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">项目名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="searchInfo.itemName"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />

        <label class="vx-col label-name px-2" v-if="!isComponent">状态</label>
        <vs-select
          v-model="searchInfo.status"
          v-if="!isComponent"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2 select-large"
        >
          <vs-select-item
            v-for="(item,index) in statusOptions"
            :key="index"
            :value="item.Value"
            :text="item.Name"
            class="w-full"
          />
        </vs-select>
        <label class="vx-col label-name px-2" v-if="!isComponent">项目类型</label>
        <vs-select
          v-model="searchInfo.itemTypeId"
          v-if="!isComponent"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2 select-large"
        >
          <vs-select-item
            v-for="(item,index) in projectTypeOptions"
            :key="index"
            :value="item.Value"
            :text="item.Name"
            class="w-full"
          />
        </vs-select>
        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vx-table
        ref="table"
        v-model="selected"
        :items="initItems"
        @loadData="loadData"
        :totalItems="totalItems"
        :pageSize="10"
        :multipleCheck="multipleCheck"
      >
        <template slot="header">
          <vs-button
            v-if="!isPop"
            color="primary"
            type="border"
            class="mb-4 mr-4"
            @click="addNewData"
          >添加</vs-button>
        </template>
        <template slot="thead-header">
          <vs-th style="width:10rem;">项目名称</vs-th>
          <vs-th>项目价格</vs-th>
          <vs-th>婚姻状态</vs-th>
          <vs-th>性别</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>状态</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>修改时间</vs-th>
          <vs-th v-if="!isPop">操作</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vx-tooltip :text="item.tr.Children?item.tr.TypeName:item.tr.ItemName">
            <vs-td style="width:10rem;display: block;" class="wrap">
              <span :style="'margin-left:'+ (item.tr.level)*20 +'px'">
                <span @click.stop="toggle(item.tr)" v-if="item.tr.Children">
                  <vs-icon
                    :icon-pack="item.tr.isExpand?'iconfont icon-shangxiazuoyouTriangle11':'iconfont icon-shangxiazuoyouTriangle12'"
                  ></vs-icon>
                </span>
                {{item.tr.Children?item.tr.TypeName:item.tr.ItemName}}
              </span>
            </vs-td>
          </vx-tooltip>

          <vs-td>
            <p v-if="!item.tr.Children">{{ item.tr.ItemPrice }}</p>
          </vs-td>
          <vs-td>
            <vs-chip
              transparent
              :color="item.tr.Marriage | getMarriageColor"
              v-if="!item.tr.Children"
            >{{ item.tr.MarriageName}}</vs-chip>
          </vs-td>
          <vs-td>
            <vs-chip
              transparent
              :color="item.tr.Gender | getGenderColor"
              v-if="!item.tr.Children"
            >{{ item.tr.GenderName}}</vs-chip>
          </vs-td>
          <vs-td>
            <p v-if="!item.tr.Children">{{item.tr.Sort }}</p>
          </vs-td>
          <vs-td>
            <p v-if="!item.tr.Children">{{ item.tr.StatusName }}</p>
          </vs-td>
          <vs-td>
            <p v-if="!item.tr.Children">{{ item.tr.ModifyName }}</p>
          </vs-td>
          <vs-td>
            <p v-if="!item.tr.Children">{{ item.tr.ModifyTime | formatDate }}</p>
          </vs-td>
          <vs-td class="whitespace-no-wrap" v-if="!isPop">
            <span
              v-if="!item.tr.Children"
              class="text-primary"
              size="small"
              type="border"
              @click.stop="editData(item.tr.ID)"
            >编辑</span>
          </vs-td>
        </template>
        <template slot="pagination">
          <slot name="pagination"></slot>
        </template>
        <template slot="paginationright">
          <slot name="paginationright"></slot>
        </template>
      </vx-table>
    </div>
  </div>
</template>

<script>
import ProjectEdit from "./Edit";
import {
  getItems,
  getProjectsForPackage,
  deployProjectForPackage,
} from "@/http/package.js";
import { clone } from "@/common/utils/data/clone";
import {
  accAdd,
  accSubtr,
  accMul,
  accDivCoupon,
} from "@/common/utils/data/calc";
import {
  getDataStatusDataSource,
  getProjectTypeDataSource,
} from "@/http/data_source.js";

export default {
  props: {
    packageID: {
      type: String,
      default: null,
    },
    isComponent: {
      type: Boolean,
      default: false,
    },
    multipleCheck: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ProjectEdit,
  },
  data() {
    return {
      //Pop
      popupActive: false,
      projectID: null,
      title: null,
      timer: "",

      statusOptions: [],
      searchInfo: {},
      projectTypeOptions: [],

      //Page
      totalItems: 0,
      selected: [],
      items: [],
      initItems: [],

      //pop
      isPop: true,
      checkedGroup: [],
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.$refs.table.currentPage,
        pageSize: this.$refs.table.itemsPerPage,
        mecid: userInfo.mecID,
        ...this.searchInfo,
      };

      getItems(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.items = data.Items;
          this.totalItems = data.TotalItems;
          if (this.items) {
            this.initItemsData(this.items, 0, null);
          }
        }
      });
    },
    initItemsData(items, level, parent) {
      this.initItems = [];
      this.initData(items, level, parent);
    },
    initData(items, level, parent) {
      if (!items) {
        return;
      }
      items.map((item, index) => {
        item = Object.assign({}, item, {
          parent: parent,
          level: level,
        });
        if (item.Children != undefined && item.Children.length > 0) {
          item = Object.assign({}, item, {
            isExpand: true,
            noUseTrCheckBox: true,
          });
        }
        if (typeof item.isChecked == "undefined") {
          item = Object.assign({}, item, {
            isChecked: false,
          });
        }
        if (typeof item.isHide == "undefined") {
          item = Object.assign({}, item, {
            isHide: false,
          });
        }
        this.initItems.push(item);

        if (item.Children) {
          this.initData(item.Children, level + 1, item.ID);
        }
      });
    },
    toggle(m) {
      if (m.Children) {
        this.initItems.forEach((i) => {
          if (i.parent == m.ID) {
            i.isHide = !i.isHide;
          }
        });
        m.isExpand = !m.isExpand;
      }
    },
    delProject(data) {
      let index = this.selected.findIndex((i) => i.ID === data.ID);
      if (index < 0) return;
      this.selected.splice(index, 1);
      this.$refs.table.initCheckedItems();
    },
    loadSelectedData(data) {
      if (!Array.isArray(data) || !data.length > 0) return;
      this.selected = data;
      this.$refs.table.initCheckedItems(this.selected);
    },
    async loadDataStatus() {
      await getDataStatusDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.statusOptions = data;
          if (data.length > 0) {
            this.searchInfo.status = data[0].Value;
          }
        }
      });
    },
    async loadProjectTypeDataStatus() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        isSelect: true,
        mecId: userInfo.mecID,
      };
      await getProjectTypeDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.projectTypeOptions = data;
          // if (data.length > 0) {
          //   this.searchInfo.projectType = data[0].Value;
          // }
        }
      });
    },
    //#region 弹窗
    addNewData() {
      this.projectID = null;
      this.popupActive = true;
      this.title = "添加项目信息";
      this.handleLoad();
    },
    editData(id) {
      this.projectID = id;
      this.title = "修改项目信息";
      this.popupActive = true;
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },
    //#endregion
  },
  created() {
    this.isPop = this.packageID ? true : false;
  },
  mounted() {
    this.loadDataStatus().then((val) => {
      this.loadData();
    });
    this.loadProjectTypeDataStatus();
  },
  watch: {
    selected() {
      this.$emit("checkHandle", this.selected);
    },
  },
};
</script>

<style lang="scss">
</style>
