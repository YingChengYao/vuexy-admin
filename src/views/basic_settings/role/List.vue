<template>
  <div class>
    <vs-popup :title="title" :active.sync="popupActive" v-if="popupActive">
      <role-detail
        v-if="popupActive"
        @closePop="closePop"
        @loadData="getTableData"
        :roleId="roleId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <permissions-view-sidebar
      v-if="addNewDataSidebar"
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      @loadData="getTableData"
      :data="sidebarData"
    />

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="searchInfo.roleName"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <label class="vx-col label-name px-2">状态</label>
        <v-select
          v-model="searchInfo.status"
          label="Name"
          value="Value"
          :options="statusOptions"
          class="vx-col md:w-1/6 sm:w-1/2 w-full mx-2"
          :reduce="m => m.Value"
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
import RoleDetail from "./Detail";
import PermissionsViewSidebar from "./PermissionsViewSidebar";

import { getRoles } from "@/http/basic_setting.js";
import { getDataStatusDataSource } from "@/http/data_source.js";
import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";
export default {
  mixins: [infoList],
  components: { RoleDetail, PermissionsViewSidebar },
  data() {
    return {
      types: [],
      listApi: getRoles,
      cloumns: [
        { headerName: "套餐类型名称", field: "RoleName" },
        { headerName: "排序", field: "Sort" },
        { headerName: "状态", field: "StatusName" },
        { headerName: "修改人", field: "ModifyName" },
        {
          headerName: "修改时间",
          field: "ModifyTime",
          formatter: (value) => {
            if (value) return formatTimeToStr(value);
          },
        },
      ],
      operates: {
        list: [
          {
            title: "编辑",
            show: true,
            method: (index, row) => {
              this.editData(row);
            },
          },
          {
            title: "设置权限",
            show: true,
            method: (index, row) => {
              this.setPermissions(row);
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
      roleId: null,
      timer: "",
      mark: null,
    };
  },
  computed: {},
  methods: {
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
    addNewData() {
      this.roleId = null;
      this.popupActive = true;
      this.title = "添加角色信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.roleId = id;
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
    setPermissions(data) {
      this.sidebarData = data;
      this.sidebarData.title = "权限设置";
      this.sidebarData.mark = "permission";
      this.toggleDataSidebar(true);
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
  },
  mounted() {
    this.loadDataStatus().then((val) => {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.searchInfo.mecId = userInfo.mecID;
      this.getTableData();
    });
  },
  watch: {},
};
</script>

<style lang="scss">
</style>
