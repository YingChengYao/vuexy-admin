<template>
  <div class>
    <vs-popup :title="title" :active.sync="popupActive" v-if="popupActive">
      <menu-detail
        v-if="popupActive"
        @closePop="closePop"
        @loadData="getTableData"
        :menuId="menuId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">套餐类型名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="searchInfo.typeName"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <vs-button class="vx-col" color="primary" type="border" @click="getTableData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <qr-table ref="table" :items="tableData" :cloumns="cloumns" :operates="operates">
        <template slot="header">
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
        </template>
      </qr-table>
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
    </div>
  </div>
</template>

<script>
import MenuDetail from "./Detail";
import { getMenus } from "@/http/basic_setting.js";
import { getDataStatusDataSource } from "@/http/data_source.js";
import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";
export default {
  mixins: [infoList],
  components: { MenuDetail },
  data() {
    return {
      types: [],
      listApi: getMenus,
      cloumns: [
        { headerName: "菜单名称", field: "DisplayName", expand: true },
        { headerName: "路由", field: "Path" },
        {
          headerName: "是否隐藏",
          field: "IsHide",
          formatter: (value) => {
            if (value) return "是";
            else return "否";
          },
        },
        { headerName: "排序", field: "Sort" },
      ],
      operates: {
        list: [
          {
            title: "编辑",
            show: true,
            method: (index, row) => {
              this.editData(row.ID);
            },
          },
        ],
      },
      statusOptions: [],

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},

      //pop
      title: null,
      popupActive: false,
      menuId: null,
      timer: "",
      mark: null,
    };
  },
  computed: {},
  methods: {
    async getTableData(
      pageIndex = this.currentPage,
      pageSize = this.itemsPerPage
    ) {
      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        ...this.searchInfo,
      };
      getMenus(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.totalItems = data.TotalItems;
          this.tableData = [];
          //let d = composeTree(data.Items, "ID", "ParentID");
          this.initData(data.Items, 0, null);
          console.log(" this.tableData:", this.tableData);
        }
      });
    },
    initData(items, level, parent) {
      if (!Array.isArray(items)) {
        return;
      }
      items.map((item, index) => {
        item = Object.assign({}, item, {
          parent: parent,
          level: level,
        });
        if (item.Children != undefined && item.Children.length > 0) {
          item = Object.assign({}, item, {
            children: item.Children,
          });
        }
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

        this.tableData.push(item);

        this.initData(item.children, level + 1, item.ID);
      });
    },
    addNewData() {
      this.menuId = null;
      this.popupActive = true;
      this.title = "添加角色信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.menuId = id;
      this.popupActive = true;
      this.title = "修改角色信息";
      this.mark = "edit";
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },
  },
  mounted() {
    this.getTableData();
  },
  watch: {},
};
</script>

<style lang="scss">
</style>
