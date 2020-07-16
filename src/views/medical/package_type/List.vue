<template>
  <div class="data-list-container">
    <package-type-data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      @loadData="loadData"
      :data="sidebarData"
    />

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">套餐类型名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="typeNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />

        <label class="vx-col label-name px-2">是否锁定</label>
        <vs-select
          v-model="isLockedSelect"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2 select-large"
        >
          <vs-select-item
            v-for="(item,index) in isLockedSelectOptions"
            :key="index"
            :value="item.value"
            :text="item.name"
            class="w-full"
          />
        </vs-select>

        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <grid-table :cloumns="cloumns" :rowData="types"></grid-table>
      <!-- <vs-table ref="table" stripe :data="types">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <vs-th>编号</vs-th>
          <vs-th>套餐类型名称</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>是否锁定</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>创建时间</vs-th>
          <vs-th>操作</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p>{{ indextr+1 }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.TypeName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Sort }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.IsLocked?'是':'否' }}</p>
              </vs-td>
              <vs-td>
                <p class="product-category">{{ tr.ModifyName}}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.ModifyTime | formatDate }}</p>
              </vs-td>
              <vs-td class="whitespace-no-wrap">
                <span class="text-primary" size="small" type="border" @click.stop="editData(tr)">编辑</span>
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>-->
    </div>
    <div class="con-pagination-table vs-table--pagination">
      <vs-pagination
        :total="totalPage"
        v-model="currentPage"
        :pagedown="true"
        :totalItems="totalItems"
        @changePageMaxItems="changePageMaxItems"
        :pagedownItems="descriptionItems"
        :size="itemsPerPage"
      ></vs-pagination>
    </div>

    <!-- <div class="vx-card p-6" style="position: fixed;bottom: 0;width: calc(100% - 4.4rem - 260px);z-index: 9919;">
       
    </div>-->
  </div>
</template>

<script>
import PackageTypeDataViewSidebar from "./PackageTypeDataViewSidebar";
import GridTable from "components/grid-table/GridTable";
import { getPackageTypes } from "@/http/package.js";
export default {
  components: {
    PackageTypeDataViewSidebar,
    GridTable
  },
  data() {
    return {
      types: [],
      cloumns: [
        {
          title: "套餐类型名称",
          field: "TypeName"
        },
        {
          title: "排序",
          field: "Sort"
        },
        {
          title: "是否锁定",
          field: "IsLocked",
        },
        {
          title: "修改人",
          field: "ModifyName"
        },
        {
          title: "修改时间",
          field: "ModifyTime"
        }
      ],

      isLockedSelectOptions: [
        {
          name: "请选择",
          value: null
        },
        {
          name: "否",
          value: false
        },
        {
          name: "是",
          value: true
        }
      ],

      //filter
      typeNameInput: "",
      isLockedSelect: false,

      //Page
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {}
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        mecID: userInfo.mecID,
        typeName: this.typeNameInput,
        isLocked: this.isLockedSelect
      };

      getPackageTypes(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("套餐类型：", data);
          this.types = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    addNewData() {
      this.sidebarData = {
        title: "添加套餐分类",
        mark: "add"
      };
      this.toggleDataSidebar(true);
    },
    editData(data) {
      this.sidebarData = data;
      this.sidebarData.title = "修改套餐分类";
      this.sidebarData.mark = "edit";
      this.toggleDataSidebar(true);
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.currentPage = 1;
      this.loadData();
    }
  },
  mounted() {
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
