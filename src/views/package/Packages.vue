<template>
  <div id class="data-list-container">
    <item-data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      @loadData="loadData"
      :data="sidebarData"
    />

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <div class="vx-row">
        <label class="vx-col label-name">用户名</label>
        <div class="vx-col md:w-1/6 sm:w-1/2 w-full">
          <vs-input placeholder="Placeholder" v-model="nameInput" />
        </div>
        <vs-button
          radius
          color="primary"
          type="border"
          icon-pack="feather"
          icon="icon-search"
          @click="loadData"
        ></vs-button>
      </div>
    </vx-card>

    <div class="vx-card p-6">
      <vs-table ref="table" multiple v-model="selected" :data="items">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <vs-th sort-key="id" v-show="false">ID</vs-th>
          <vs-th sort-key="no">编号</vs-th>
          <vs-th sort-key="item_name">项目名称</vs-th>
          <vs-th sort-key="item_type_id">所属类别编号</vs-th>
          <vs-th sort-key="item_type">所属类别</vs-th>
          <vs-th sort-key="item_price">项目价格</vs-th>
          <vs-th sort-key="marriage">婚姻状态</vs-th>
          <vs-th sort-key="gender">性别</vs-th>
          <vs-th sort-key="sort">排序</vs-th>
          <vs-th sort-key="is_locked">是否锁定</vs-th>
          <vs-th sort-key="remark">描述</vs-th>
          <vs-th sort-key="modify_name">修改人</vs-th>
          <vs-th sort-key="modify_time">修改时间</vs-th>
          <vs-th>操作</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td v-show="false">
                <p>{{ tr.ID }}</p>
              </vs-td>
              <vs-td>
                <p>{{ indextr+1 }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PackageName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PackageTypeID }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PackageTypeName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PackagePrice }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Marriage}}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Gender }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Sort }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.IsLocked?'是':'否' }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Remark }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.ModifyName }}</p>
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

      <vs-pagination
        :total="totalPage"
        v-model="currentPage"
        :pagedown="true"
        :totalItems="totalItems"
        @changePageMaxItems="changePageMaxItems"
        :pagedownItems="descriptionItems"
        :size="itemsPerPage"
        class="the-footer flex-wrap justify-between"
      ></vs-pagination>
    </div>
  </div>
</template>

<script>
import ItemDataViewSidebar from "./DataViewSidebar/ItemDataViewSidebar";
import ItemType from "./ItemType";

import { getItems } from "@/http/package.js";
export default {
  components: {
    ItemDataViewSidebar,
    ItemType
  },
  data() {
    return {
      selected: [],
      items: [],
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

      nameInput: ""
    };
  },
  computed: {},
  methods: {
    loadData() {
      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage
      };

      getItems(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("项目：", data);
          this.items = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    addNewData() {
      this.sidebarData = {
        title: "添加项目",
        mark: "add"
      };
      this.toggleDataSidebar(true);
    },
    editData(data) {
      this.sidebarData = data;
      this.sidebarData.title = "修改项目";
      this.sidebarData.mark = "edit";
      this.toggleDataSidebar(true);
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.loadData();
    }
  },
  created() {
    console.log("路由：", this.$router);
    console.log("路由1：", this.$store.state.permission.routes);
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
