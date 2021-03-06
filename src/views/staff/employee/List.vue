<template>
  <div id class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive" v-if="popupActive">
      <employee-edit
        @closePop="closePop"
        @loadData="loadData"
        :employeeID="employeeID"
        :key="timer"
        :mark="mark"
        :data="employeeData"
      />
    </vs-popup>

    <vs-popup fullscreen title :active.sync="popupActivePosition">
      <position-list
        ref="position"
        v-if="popupActivePosition"
        :isPop="true"
        :multipleCheck="true"
        :operateName="[]"
      ></position-list>
      <div class="text-right mt-5">
        <span>
          <vs-button
            class="vx-col"
            color="primary"
            type="border"
            @click="savePosition"
            v-preventClick
          >保存</vs-button>
        </span>
        <span class="px-2">
          <vs-button class="vx-col" color="primary" type="border" @click="cancelPosition">取消</vs-button>
        </span>
      </div>
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label :style="{'z-index':'currentPage'}" class="vx-col label-name px-2">职工名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="employeeNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <label class="vx-col label-name px-2" v-if="isShowWorkingStatus">状态</label>
        <v-select
          v-if="isShowWorkingStatus"
          v-model="workingStatusSelect"
          label="Name"
          value="Value"
          :options="workingStatusOptions"
          class="vx-col md:w-1/6 sm:w-1/2 w-full mx-2"
          :reduce="m => m.Value"
        />

        <vs-button class="vx-col flex" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vx-table
        ref="table"
        v-model="selected"
        :items="items"
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
          <vs-button
            v-if="!isPop"
            color="primary"
            type="border"
            class="mb-4 mr-4"
            @click.stop="$refs.fileInput.click()"
          >批量导入</vs-button>
          <vs-button
            v-if="!isPop"
            color="primary"
            type="border"
            class="mb-4 mr-4"
            @click.stop="download()"
          >模板下载</vs-button>
          <vs-button
            v-if="!isPop"
            color="primary"
            type="border"
            class="mb-4 mr-4"
            @click="batchFire"
          >解雇</vs-button>
        </template>
        <template slot="thead-header">
          <vs-th>姓名</vs-th>
          <vs-th>身份证</vs-th>
          <vs-th>婚姻状态</vs-th>
          <vs-th>性别</vs-th>
          <vs-th>手机号</vs-th>
          <vs-th>状态</vs-th>
          <vs-th v-if="!isPop">修改人</vs-th>
          <vs-th v-if="!isPop">修改时间</vs-th>
          <vs-th v-if="!isPop">操作</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.EmployeeName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.IdNo }}</p>
          </vs-td>
          <vs-td>
            <vs-chip
              transparent
              :color="item.tr.Marital | getMarriageForUserColor"
            >{{ item.tr.MaritalName}}</vs-chip>
          </vs-td>
          <vs-td>
            <vs-chip
              transparent
              :color="item.tr.Gender | getGenderForUserColor"
            >{{ item.tr.GenderName}}</vs-chip>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Mobile }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.WorkingStatusName }}</p>
          </vs-td>
          <vs-td v-if="!isPop">
            <p>{{ item.tr.ModifyName }}</p>
          </vs-td>
          <vs-td v-if="!isPop">
            <p>{{ item.tr.ModifyTime | formatDate }}</p>
          </vs-td>
          <vs-td class="whitespace-no-wrap" v-if="!isPop">
            <span class="text-primary" size="small" type="border" @click.stop="editData(item.tr)">编辑</span>
            <span
              class="text-primary px-2"
              size="small"
              type="border"
              @click.stop="deployPosition(item.tr)"
            >设置职位</span>
          </vs-td>
        </template>
        <template slot="pagination">
          <slot></slot>
        </template>
      </vx-table>
    </div>

    <div class="excel-import" style="display:none">
      <input
        type="file"
        ref="fileInput"
        multiple
        class="hidden"
        accept=".xlsx, .xls"
        @change="handleClick"
      />
    </div>
  </div>
</template>

<script>
import EmployeeEdit from "./Edit";
import PositionList from "views/staff/position/List";

import "@/common/global";
import { getWorkingStatusDataSource } from "@/http/data_source.js";
import {
  getEmployees,
  deployPositionForEmployee,
  getPositionForEmployee,
  batchAddEmployee,
  batchFire,
} from "@/http/staff.js";
export default {
  components: {
    EmployeeEdit,
    PositionList,
  },
  props: {
    multipleCheck: {
      type: Boolean,
      default: true,
    },
    isPop: {
      type: Boolean,
      default: false,
    },
    isShowWorkingStatus: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      //filter
      employeeNameInput: "",
      workingStatusSelect: null,
      workingStatusOptions: [],

      //Page
      items: [],
      totalItems: 0,
      selected: [],

      // 职工添加修改Pop
      title: null,
      popupActive: false,
      employeeID: null,
      timer: "",
      mark: null,
      employeeData: null,

      //设置职位
      popupActivePosition: false,
    };
  },
  computed: {},
  created() {
    this.loadWorkingStatus();
  },
  mounted() {},
  watch: {
    currentPage() {
      this.loadData();
    },
  },
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.$refs.table.currentPage,
        pageSize: this.$refs.table.itemsPerPage,
        companyId: userInfo.companyID,
        employeeName: this.employeeNameInput,
        workingStatus: this.workingStatusSelect,
      };

      getEmployees(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.items = data.Items;
          this.totalItems = data.TotalItems;
        }
      });
    },
    loadSelectedData(data) {
      if (!Array.isArray(data) || !data.length > 0) return;
      this.selected = data;
      this.initCheckedItems();
    },
    initCheckedItems() {
      if (!this.multipleCheck) return;
      if (this.items.length > 0) {
        this.items.map((item, index) => {
          if (this.selected.length > 0) {
            let val = this.selected.find((t) => t.ID === item.ID);
            item.isChecked = !val ? false : true;
          }
        });
        this.$refs.table.handleCheckboxAll();
      }
    },
    loadWorkingStatus() {
      let para = {
        isSelect: true,
      };
      getWorkingStatusDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.workingStatusOptions = data;
          if (data.length > 0) {
            this.workingStatusSelect = data[1].Value;
          }
          this.loadData();
        }
      });
    },
    batchFire() {
      if (!this.selected.length > 0) {
        this.$vs.notify({
          title: "Error",
          text: "请选择要离职的员工",
          color: "danger",
        });
        return;
      }
      let ids = this.selected.map((n) => n.ID);

      let data = {
        ids: ids,
      };

      batchFire(data).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "Success",
            text: "离职成功",
            color: "success",
          });
          this.loadData();
        }
      });
    },
    download() {
      const url = global.baseURL + "/Template/职工模板.xlsx";
      var iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
    },
    //#region 职工
    addNewData() {
      this.employeeID = null;
      this.popupActive = true;
      this.title = "添加员工信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(tr) {
      this.employeeID = tr.ID;
      console.log(tr);
      this.employeeData = tr;
      this.popupActive = true;
      this.title = "修改员工信息";
      this.mark = "edit";
      this.handleLoad();
    },
    closePop() {
      this.popupActive = false;
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    handleClick(e) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let formData = new FormData();
      formData.append("Files", e.target.files[0]);
      formData.append("CompanyID", userInfo.companyID);
      batchAddEmployee(formData).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "Success",
            text: "名单导入成功",
            color: "success",
          });
          this.loadData();
        }
      });
    },
    //#endregion
    //#region 职位
    deployPosition(tr) {
      this.popupActivePosition = true;
      this.employeeID = tr.ID;
      this.loadPositionData(this.employeeID);
    },
    savePosition() {
      let positionids = this.$refs.position.selected.map((r) => r.ID).join(",");
      let para = {
        employeeID: this.employeeID,
        positionIDs: positionids,
      };
      deployPositionForEmployee(para).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "Success",
            text: "职位设置成功",
            color: "success",
          });
          this.popupActivePosition = false;
          this.loadData();
        }
      });
    },
    loadPositionData(id) {
      let para = {
        employeeID: id,
      };
      getPositionForEmployee(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.$refs.position.loadSelectedData(data);
        }
      });
    },
    cancelPosition() {
      this.popupActivePosition = false;
    },
    //#endregion
  },
};
</script>

<style lang="scss">
</style>
