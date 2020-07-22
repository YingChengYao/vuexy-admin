<template>
  <div class="data-list-container">
    <data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      @loadData="loadData"
      :data="sidebarData"
    />

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">项目类型名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="typeNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />

        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vx-table
        ref="table"
        :items="types"
        @loadData="loadData"
        :totalPage="totalPage"
        :totalItems="totalItems"
        :pageSize="10"
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
          <vs-th>项目类型名称</vs-th>
          <vs-th>描述</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>是否锁定</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>创建时间</vs-th>
          <vs-th>操作</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.TypeName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Remark }}</p>
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
            <span class="text-primary" size="small" type="border" @click.stop="editData(item.tr)">编辑</span>
          </vs-td>
        </template>
      </vx-table>
    </div>
  </div>
</template>

<script>
import DataViewSidebar from "./DataViewSidebar";
import { getItemTypes } from "@/http/package.js";
export default {
  components: {
    DataViewSidebar
  },
  props: {
    isPop: {
      type: Boolean,
      default: false
    },
    // cloumns: {
    //   type: Array,
    //   default: function() {
    //     return [
    //       {
    //         title: "项目类型名称",
    //         field: "TypeName"
    //       },
    //       {
    //         title: "描述",
    //         field: "Remark"
    //       },
    //       {
    //         title: "排序",
    //         field: "Sort"
    //       },
    //       {
    //         title: "是否锁定",
    //         field: "IsLocked"
    //       },
    //       {
    //         title: "修改人",
    //         field: "ModifyName"
    //       },
    //       {
    //         title: "修改时间",
    //         field: "ModifyTime"
    //       },
    //       {
    //         title: "操作",
    //         field: ""
    //       }
    //     ];
    //   }
    // }
  },
  data() {
    return {
      selected: [],
      types: [],
      isMounted: false,

      //Page
      totalPage: 0,
      totalItems: 0,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},

      typeNameInput: ""
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
        typename: this.typeNameInput
      };

      getItemTypes(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("类型：", data);
          this.types = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    addNewData() {
      this.sidebarData = {
        title: "添加项目分类",
        mark: "add"
      };
      this.toggleDataSidebar(true);
    },
    editData(data) {
      this.sidebarData = data;
      this.sidebarData.title = "修改项目分类";
      this.sidebarData.mark = "edit";
      this.toggleDataSidebar(true);
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
  },
  mounted() {
    this.isMounted = true;
    this.loadData();
  },
  watch: {
    currentPage() {
      this.loadData();
    }
  }
};
</script>

<style lang="scss">
</style>
