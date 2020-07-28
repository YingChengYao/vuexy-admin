<template>
  <div class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive">
      <project-item-edit
        @closePop="closePop"
        @loadData="loadData"
        :projectItemId="projectItemId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">项目类型名称</label>
        <vs-input
          placeholder
          v-model="singleNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vs-row v-if="tableTitle">
        <span class="mb-4">{{tableTitle}}</span>
      </vs-row>
      <vx-table
        ref="table"
        v-model="selected"
        :items="items"
        :totalPage="totalPage"
        :totalItems="totalItems"
        :pageSize="3"
        :multipleCheck="multipleCheck"
        @loadData="loadData"
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
          <vs-th>项目单项名称</vs-th>
          <vs-th>是否作为项目使用</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>是否锁定</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>创建时间</vs-th>
          <vs-th>操作</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.SingleName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.IsOptional?'是':'否' }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Sort }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.IsLocked?'是':'否' }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.ModifyName}}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.ModifyTime | formatDate }}</p>
          </vs-td>
          <vs-td class="whitespace-no-wrap">
            <span
              class="text-primary"
              size="small"
              type="border"
              @click.stop="editData(item.tr.ID)"
            >编辑</span>
          </vs-td>
        </template>
      </vx-table>
    </div>
  </div>
</template>

<script>
import ProjectItemEdit from "./Edit";
import { getProjectItems } from "@/http/package.js";
export default {
  components: {
    ProjectItemEdit,
  },
  props: {
    isPop: {
      type: Boolean,
      default: false,
    },
    multipleCheck: {
      type: Boolean,
      default: false,
    },
    tableTitle: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      //Page
      items: [],
      singleNameInput: null,
      totalPage: 0,
      totalItems: 0,
      selected: [],

      // Pop
      title: null,
      popupActive: false,
      projectItemId: null,
      timer: "",
      mark: null,
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
        singleName: this.singleNameInput,
      };

      getProjectItems(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.items = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    //#region 弹窗
    addNewData() {
      this.projectItemId = null;
      this.popupActive = true;
      this.title = "添加项目单项信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.projectItemId = id;
      this.popupActive = true;
      this.title = "修改项目单项信息";
      this.mark = "edit";
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
  mounted() {
    this.loadData();
  },
  watch: {
    currentPage() {
      this.loadData();
    },
  },
};
</script>

<style lang="scss">
</style>
