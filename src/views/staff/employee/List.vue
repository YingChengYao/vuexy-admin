<template>
  <div id class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive">
      <employee-edit
        @closePop="closePop"
        @loadData="loadData"
        :employeeId="employeeId"
        :key="timer"
        :mark="mark"
        :data="employeeData"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">职工名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="employeeNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <vs-button class="vx-col flex" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vs-table ref="table" :data="items" stripe>
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button
              v-if="!isSelectedPop"
              color="primary"
              type="border"
              class="mb-4 mr-4"
              @click="addNewData"
            >添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <th class="td-check">
            <span class="con-td-check">
              <vs-checkbox
                :checked="isCheckedAll"
                @change="handleCheckAll()"
                v-if="isSelectedPop"
                size="small"
              />
            </span>
          </th>
          <vs-th>编号</vs-th>
          <vs-th>职工名称</vs-th>
          <vs-th>身份证</vs-th>
          <vs-th>婚姻状态</vs-th>
          <vs-th>性别</vs-th>
          <vs-th>手机号</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>是否锁定</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>修改时间</vs-th>
          <vs-th v-if="!isSelectedPop">操作</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <vs-checkbox
                  :checked="tr.isChecked"
                  @change="handleCheckbox(tr)"
                  size="small"
                  v-if="isSelectedPop"
                />
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
                <p>{{ tr.Sort }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.IsLocked?'是':'否' }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.ModifyName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.ModifyTime | formatDate }}</p>
              </vs-td>
              <vs-td class="whitespace-no-wrap" v-if="!isSelectedPop">
                <span class="text-primary" size="small" type="border" @click.stop="editData(tr)">编辑</span>
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>

      <div class="flex">
        <span v-if="isSelectedPop" class="mt-5">
          <span>
            <vs-button class="vx-col" color="primary" type="border" @click="save">保存</vs-button>
          </span>
          <span class="px-2">
            <vs-button class="vx-col" color="primary" type="border" @click="cancel">取消</vs-button>
          </span>
        </span>
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
import { AgGridVue } from "ag-grid-vue";

import { getEmployees } from "@/http/staff.js";
export default {
  components: {
    EmployeeEdit,
    AgGridVue
  },
  props: {
    isSelectedPop: Boolean,
    default: false
  },
  data() {
    return {
      columnDefs: [
        { headerName: "姓名", field: "name" },
        { headerName: "性别", field: "gender" },
        { headerName: "年龄", field: "age" }
      ],
      rowData: [
        { name: "李煜", gender: "男", age: 20 },
        { name: "柳叶", gender: "女", age: 25 },
        { name: "姜宇", gender: "男", age: 18 }
      ],
      items: [],
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
      employeeNameInput: "",
      isLockedSelect: false,

      //Page
      itemsPerPage: 2,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,

      // Pop
      title: null,
      popupActive: false,
      employeeId: null,
      timer: "",
      mark: null,
      employeeData: null,

      //checked
      isCheckedAll: false,
      checkedGroup: []
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        companyId: userInfo.companyID,
        employeeName: this.employeeNameInput
      };

      getEmployees(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.items = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          console.log("职工:", data);
          this.initData();
          this.addIsChecked();
        }
      });
    },
    initCheckedGroup() {
      this.checkedGroup = [];
    },
    initData() {
      this.items.map((item, index) => {
        if (typeof item.isChecked == "undefined") {
          item = Object.assign({}, item, {
            isChecked: false
          });
        }
      });
    },
    //#region 弹窗
    addNewData() {
      this.employeeId = null;
      this.popupActive = true;
      this.title = "添加员工信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(tr) {
      console.log(tr);
      this.employeeId = tr.ID;
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
    //#region 自定义checked
    handleCheckbox(tr) {
      if (tr) {
        tr.isChecked = !tr.isChecked;

        if (tr.isChecked) {
          let item = {
            ID: tr.ID,
            EmployeeName: tr.EmployeeName
          };

          this.checkedGroup.push(item);
        } else {
          this.delProject(tr.ID);
        }
        console.log("this.checkedGroup:", this.checkedGroup);
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
      this.items.map((item, index) => {
        item.isChecked = this.isCheckedAll;
      });
    },
    delProject(id) {
      if (this.checkedGroup.length > 0) {
        this.checkedGroup.map((item, index) => {
          if (item.ID === id) {
            this.checkedGroup.splice(index, 1);
          }
        });
      }
    },
    /*分页请求后返回新数据的时候，该每一项设置属性 isChecked 为 false，但是当数组内部有保存的数据时，
    且该保存的数据id和请求返回回来的id相同的话，就把该项选中，比如我勾选了第一页中的某一项，会把
    该项的id保存到数组内部去，当切换到第二页的时候，那么再返回到第一页的时候，会获取该id是否与数组的
    id是否相同，如果相同的话，就把该项数据选中*/
    addIsChecked() {
      if (this.items.length > 0) {
        this.items.map((item, index) => {
          if (this.checkedGroup.length > 0) {
            this.checkedGroup.map((checkedItem, index) => {
              if (item.ID === checkedItem.ID) {
                item.isChecked = true;
              }
            });
          }
        });
        this.handleCheckboxAll();
      }
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
  },
  created() {
    this.loadData();
  },
  mounted() {},
  watch: {
    currentPage() {
      this.loadData();
    }
  }
};
</script>

<style lang="scss">
</style>
