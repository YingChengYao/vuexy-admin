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

        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vs-table ref="table" multiple stripe v-model="selected" :data="types">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <vs-th sort-key="id" v-show="false">ID</vs-th>
          <vs-th sort-key="id">编号</vs-th>
          <vs-th sort-key="package_type_name">套餐类型名称</vs-th>
          <vs-th sort-key="remark">描述</vs-th>
          <vs-th sort-key="sort">排序</vs-th>
          <vs-th sort-key="is_locked">是否锁定</vs-th>
          <vs-th sort-key="modify_name">修改人</vs-th>
          <vs-th sort-key="modify_time">创建时间</vs-th>
          <vs-th>操作</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td v-show="false">
                <p>{{ tr.ID }}</p>
              </vs-td>
              <vs-td>
                <p>{{ indextr }}</p>
              </vs-td>
              <vs-td :data="tr.TypeName">
                <p>{{ tr.TypeName }}</p>
                <!-- <template slot="edit">
                  <vs-input v-model="tr.TypeName" class="inputx" placeholder />
                  <vs-button color="primary" type="border">更改</vs-button>
                </template>-->
              </vs-td>
              <vs-td :data="tr.Remark">
                <p>{{ tr.Remark }}</p>
                <!-- <template slot="edit">
                  <vs-input v-model="tr.Remark" class="inputx" />
                </template>-->
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
                <feather-icon
                  icon="EditIcon"
                  svgClasses="w-5 h-5 hover:text-primary stroke-current"
                  @click.stop="editData(tr)"
                />
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
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
import { getPackageTypes } from "@/http/package.js";
export default {
  components: {
    PackageTypeDataViewSidebar
  },
  data() {
    return {
      selected: [],
      types: [],
      isMounted: false,

      //Page
      itemsPerPage: 4,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [4, 10, 15, 20],
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
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        mecID: userInfo.mecID,
        typeName: this.typeNameInput
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
