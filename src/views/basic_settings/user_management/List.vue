<template>
  <div class>
    <vs-popup :title="title" :active.sync="popupActive" v-if="popupActive">
      <menu-detail
        v-if="popupActive"
        @closePop="closePop"
        @loadData="getTableData"
        :userId="userId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>
    <vs-popup fullscreen :title="title" :active.sync="popupActiveRole" v-if="popupActiveRole">
      <role-list
        ref="role"
        v-if="popupActiveRole"
        @closePop="closeRolePop"
        @loadData="getTableData"
        :userId="userId"
        :key="timer"
        :mark="mark"
        :multipleCheck="true"
        :operateName="[]"
      ></role-list>
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" @click.stop="saveRole" v-preventClick>保存</vs-button>
            <vs-button class="ml-4 mt-2" type="border" color="warning" @click.stop="closeRolePop">取消</vs-button>
          </div>
        </div>
      </div>
    </vs-popup>

    <vs-popup :title="title" :active.sync="popupActivePwd" v-if="popupActivePwd">
      <set-pwd
        ref="pwd"
        v-if="popupActivePwd"
        @closePop="closePwdPop"
        :userId="userId"
        :key="timer"
        :mark="mark"
      ></set-pwd>
      <!-- <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" @click.stop="saveRole" v-preventClick>保存</vs-button>
            <vs-button class="ml-4 mt-2" type="border" color="warning" @click.stop="closeRolePop">取消</vs-button>
          </div>
        </div>
      </div>-->
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">用户名称</label>
        <vs-input v-model="searchInfo.userName" class="vx-col md:w-1/6 sm:w-1/2 w-full px-2" />
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
import RoleList from "views/basic_settings/role/List";
import SetPwd from "./SetPwd";

import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";

import { getUsers, deployRoleForUser } from "@/http/basic_setting.js";
import {
  getDataStatusDataSource,
  getPlatformTypeDataSource,
} from "@/http/data_source.js";

export default {
  mixins: [infoList],
  components: { MenuDetail, RoleList, SetPwd },
  props: {},
  data() {
    return {
      types: [],
      listApi: getUsers,
      cloumns: [
        { headerName: "ID", field: "ID" },
        { headerName: "用户名", field: "UserName" },
        { headerName: "昵称", field: "UserNickName" },
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
          {
            title: "设置角色",
            show: true,
            method: (index, row) => {
              this.setRole(row.ID);
            },
          },
          {
            title: "设置密码",
            show: true,
            method: (index, row) => {
              this.setPassword(row.ID);
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
      userId: null,
      timer: "",
      mark: null,
      popupActiveRole: false,
      popupActivePwd: false,
    };
  },
  computed: {},
  methods: {
    addNewData() {
      this.userId = null;
      this.popupActive = true;
      this.title = "添加用户信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.userId = id;
      this.popupActive = true;
      this.title = "修改用户信息";
      this.mark = "edit";
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },
    setRole(id) {
      this.userId = id;
      this.popupActiveRole = true;
      this.title = "设置用户角色";
      this.mark = "role";
      this.handleLoad();
    },
    closeRolePop() {
      this.popupActiveRole = false;
    },
    saveRole() {
      let selected = this.$refs.role.selected;
      if (selected.length <= 0) {
        this.$vs.notify({
          title: "保存失败",
          text: "请选择角色！",
          color: "warning",
        });
        return;
      }
      let roles = selected
        .map((obj) => {
          return obj.ID;
        })
        .join(",");
      let para = {
        id: this.userId,
        roles: roles,
      };
      deployRoleForUser(para).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "成功",
            text: res.message,
            color: "success",
          });
          this.getTableData();
          this.closeRolePop();
        }
      });
    },
    setPassword(id) {
      this.userId = id;
      this.popupActivePwd = true;
      this.title = "设置用户密码";
      this.mark = "pwd";
      this.handleLoad();
    },
    closePwdPop() {
      this.popupActivePwd = false;
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
