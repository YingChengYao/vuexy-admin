<template>
  <div id class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive">
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
        :employeeID="employeeID"
      >
        <template>
          <span class="mt-5">
            <span>
              <vs-button class="vx-col" color="primary" type="border" @click="savePosition">保存</vs-button>
            </span>
            <span class="px-2">
              <vs-button class="vx-col" color="primary" type="border" @click="cancelPosition">取消</vs-button>
            </span>
          </span>
        </template>
      </position-list>
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label :style="{'z-index':'currentPage'}" class="vx-col label-name px-2">职工名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="employeeNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <label class="vx-col label-name px-2">在职状态</label>
        <vs-select
          v-model="workingStatusSelect"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2 select-large"
        >
          <vs-select-item
            v-for="(item,index) in workingStatusOptions"
            :key="index"
            :value="item.Value"
            :text="item.Name"
            class="w-full"
          />
        </vs-select>
        <vs-button class="vx-col flex" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vs-table ref="table" :data="items" stripe>
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button
              v-if="!isPop"
              color="primary"
              type="border"
              class="mb-4 mr-4"
              @click="addNewData"
            >添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <th class="td-check" v-if="multipleCheck">
            <span class="con-td-check">
              <vs-checkbox :checked="isCheckedAll" @change="handleCheckAll()" size="small" />
            </span>
          </th>
          <vs-th>编号</vs-th>
          <vs-th>职工名称</vs-th>
          <vs-th>身份证</vs-th>
          <vs-th>婚姻状态</vs-th>
          <vs-th>性别</vs-th>
          <vs-th>手机号</vs-th>
          <vs-th>在职状态</vs-th>
          <vs-th v-if="!isPop">修改人</vs-th>
          <vs-th v-if="!isPop">修改时间</vs-th>
          <vs-th v-if="!isPop">操作</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td v-if="multipleCheck" class="td-check">
                <vs-checkbox :checked="tr.isChecked" @change="handleCheckbox(tr)" size="small" />
              </vs-td>
              <vs-td>
                <p>{{ indextr+1 }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.EmployeeName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.IdNo }}</p>
              </vs-td>
              <vs-td>
                <vs-chip
                  transparent
                  :color="tr.Marital | getMarriageForUserColor"
                  v-if="!tr.Children"
                >{{ tr.MaritalName}}</vs-chip>
              </vs-td>
              <vs-td>
                <vs-chip
                  transparent
                  :color="tr.Gender | getGenderForUserColor"
                  v-if="!tr.Children"
                >{{ tr.GenderName}}</vs-chip>
              </vs-td>
              <vs-td>
                <p>{{ tr.Mobile }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.WorkingStatusName }}</p>
              </vs-td>
              <vs-td v-if="!isPop">
                <p>{{ tr.ModifyName }}</p>
              </vs-td>
              <vs-td v-if="!isPop">
                <p>{{ tr.ModifyTime | formatDate }}</p>
              </vs-td>
              <vs-td class="whitespace-no-wrap" v-if="!isPop">
                <span class="text-primary" size="small" type="border" @click.stop="editData(tr)">编辑</span>
                <span
                  class="text-primary px-2"
                  size="small"
                  type="border"
                  @click.stop="deployPosition(tr)"
                >设置职位</span>
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>

      <div class="flex">
        <slot></slot>
        <vs-pagination
          style="flex:1"
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
  </div>
</template>

<script>
import EmployeeEdit from "./Edit";
import PositionList from "views/staff/position/List";
import { AgGridVue } from "ag-grid-vue";

import { getWorkingStatusDataSource } from "@/http/data_source.js";
import { getEmployees, deployPositionForEmployee } from "@/http/staff.js";
export default {
  components: {
    AgGridVue,
    EmployeeEdit,
    PositionList
  },
  props: {
    multipleCheck: {
      type: Boolean,
      default: false
    },
    isPop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //filter
      employeeNameInput: "",
      workingStatusSelect: null,
      workingStatusOptions: [],

      //Page
      items: [],
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,

      //checked
      checkedGroup: [],
      isCheckField: "ID",
      isCheckedAll: false,

      // 职工添加修改Pop
      title: null,
      popupActive: false,
      employeeID: null,
      timer: "",
      mark: null,
      employeeData: null,

      //设置职位
      popupActivePosition: false
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
    }
  },
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        companyId: userInfo.companyID,
        employeeName: this.employeeNameInput,
        workingStatus: this.workingStatusSelect
      };

      getEmployees(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.items = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          console.log("职工:", data);
          if (this.multipleCheck) this.addIsChecked();
        }
      });
    },
    initCheckedGroup() {
      this.checkedGroup = [];
    },
    loadWorkingStatus() {
      let para = {
        isSelect: true
      };
      getWorkingStatusDataSource(para).then(res => {
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
    //#region 自定义checked
    handleCheckbox(tr) {
      if (tr) {
        tr.isChecked = !tr.isChecked;

        if (tr.isChecked) {
          this.checkedGroup.push(tr);
        } else {
          this.delChecked(tr);
        }
      }
      this.handleCheckboxAll();
    },
    handleCheckboxAll() {
      let checkedCount = this.items.filter(f => f.isChecked).length;
      let count = this.items.length;
      this.isCheckedAll = checkedCount == count ? true : false;
    },
    handleCheckAll() {
      if (!this.items.length > 0) return;
      this.isCheckedAll = !this.isCheckedAll;
      let val = this.isCheckedAll;
      this.items.map((item, index) => {
        item.isChecked = val;
        this.changeCheckbox(item);
      });
    },
    changeCheckbox(tr) {
      if (tr) {
        if (tr.isChecked) {
          this.checkedGroup.push(tr);
        } else {
          this.delChecked(tr);
        }
      }
    },
    delChecked(tr) {
      if (this.checkedGroup.length > 0) {
        this.checkedGroup.map((item, index) => {
          if (item[this.isCheckField] === tr[this.isCheckField]) {
            this.checkedGroup.splice(index, 1);
          }
        });
      }
    },
    /*分页请求后返回新数据的时候，该每一项设置属性 isChecked 为 false，但是当数组内部有保存的数据时，
    且该保存的数据和请求返回回来的相同的话，就把该项选中，比如我勾选了第一页中的某一项，会把
    该项的id保存到数组内部去，当切换到第二页的时候，那么再返回到第一页的时候，会获取该id是否与数组的
    id是否相同，如果相同的话，就把该项数据选中*/
    addIsChecked() {
      if (this.items.length > 0) {
        this.items.map((item, index) => {
          if (this.checkedGroup.length > 0) {
            this.checkedGroup.map((checkedItem, index) => {
              if (item[this.isCheckField] === checkedItem[this.isCheckField]) {
                item.isChecked = true;
              }
            });
          }
        });
        this.handleCheckboxAll();
      }
    },
    //#endregion

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
      console.log(tr)
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
    //#endregion
    //#region 职位
    deployPosition(tr) {
      this.popupActivePosition = true;
      this.employeeID = tr.ID;
    },
    savePosition() {
      let positionids = this.$refs.position.$refs.table.checkedGroup
        .map(r => r.ID)
        .join(",");
      let para = {
        employeeID: this.$refs.position.employeeID,
        positionid: positionids
      };
      deployPositionForEmployee(para).then(res => {
        if (res.resultType == 0) {
          // const data = JSON.parse(res.message);
          // this.items = data.Items;
          // this.totalPage = data.TotalPages;
          // this.totalItems = data.TotalItems;
          // console.log("职工:", data);
          // if (this.multipleCheck) this.addIsChecked();
        }
      });
    },
    cancelPosition() {
      this.popupActivePosition = false;
    },
    //#endregion

    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.loadData();
    },
    save() {
      this.$emit("saveEmployeeSelected", this.checkedGroup);
      this.cancel();
    },
    cancel() {
      this.$emit("closePop");
    }
  }
};
</script>

<style lang="scss">
</style>
