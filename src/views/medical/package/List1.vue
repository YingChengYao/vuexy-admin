<template>
  <div id class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive" v-if="popupActive">
      <package-edit
        @closePop="closePop"
        @loadData="loadData"
        :packageID="packageID"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>
    <vs-popup
      fullscreen
      :title="titlePackageDeployProject"
      :active.sync="popupActivePackageDeployProject"
    >
      <package-deploy-project
        v-if="popupActivePackageDeployProject"
        @closePop="closePackageDeployProjectPop"
        @loadData="loadData"
        :packageID="packageID"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">套餐名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="packageNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <label class="vx-col label-name px-2">状态</label>
        <vs-select v-model="status" class="vx-col md:w-1/6 sm:w-1/2 w-full px-2 select-large">
          <vs-select-item
            v-for="(item,index) in statusOptions"
            :key="index"
            :value="item.value"
            :text="item.name"
            class="w-full"
          />
        </vs-select>

        <vs-button class="vx-col" color="primary" type="border" @click="getTableData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <qr-table
        ref="table"
        v-model="selected"
        :items="tableData"
        :cloumns="cloumns"
        :operates="operates"
      >
        <template slot="header">
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
        </template>
      </qr-table>
      <!-- <vs-table ref="table" :data="items" stripe>
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <vs-th>编号</vs-th>
          <vs-th>套餐名称</vs-th>
          <vs-th>套餐价格</vs-th>
          <vs-th>折扣</vs-th>
          <vs-th>折扣价</vs-th>
          <vs-th>婚姻状态</vs-th>
          <vs-th>性别</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>是否锁定</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>修改时间</vs-th>
          <vs-th>操作</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p>{{ indextr+1 }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PackageName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PackagePrice }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Discount }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.DiscountPrice }}</p>
              </vs-td>
              <vs-td>
                <vs-chip
                  transparent
                  :color="tr.Marriage | getMarriageColor"
                  v-if="!tr.Children"
                >{{ tr.MarriageName}}</vs-chip>
              </vs-td>
              <vs-td>
                <vs-chip
                  transparent
                  :color="tr.Gender | getGenderColor"
                  v-if="!tr.Children"
                >{{ tr.GenderName}}</vs-chip>
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
              <vs-td class="whitespace-no-wrap">
                <span
                  class="text-primary"
                  size="small"
                  type="border"
                  @click.stop="editData(tr.ID)"
                >编辑</span>
                <span
                  class="text-primary px-2"
                  size="small"
                  type="border"
                  @click.stop="deployProject(tr.ID)"
                >项目配置</span>
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>-->

      <div class="flex mt-4">
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
import { getPackages } from "@/http/package.js";
import PackageEdit from "./Edit";
import PackageDeployProject from "./DeployProject";
import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";
export default {
  mixins: [infoList],
  components: {
    PackageEdit,
    PackageDeployProject,
  },
  data() {
    return {
      statusOptions: [
        {
          name: "请选择",
          value: null,
        },
        {
          name: "否",
          value: false,
        },
        {
          name: "是",
          value: true,
        },
      ],
      //Page
      searchInfo: {},
      selected: [],
      listApi: getPackages,

      // <vs-td>
      //   <vs-chip
      //     transparent
      //     :color="tr.Marriage | getMarriageColor"
      //     v-if="!tr.Children"
      //   >{{ tr.MarriageName}}</vs-chip>
      // </vs-td>
      // <vs-td>
      //   <vs-chip
      //     transparent
      //     :color="tr.Gender | getGenderColor"
      //     v-if="!tr.Children"
      //   >{{ tr.GenderName}}</vs-chip>
      // </vs-td>
      cloumns: [
        { headerName: "套餐名称", field: "PackageName" },
        { headerName: "套餐价格", field: "PackagePrice" },
        { headerName: "折扣", field: "Discount" },
        { headerName: "折扣价", field: "DiscountPrice" },
        {
          headerName: "婚姻状态",
          field: "MarriageName",
          template1: (tr) => {
            return (
              <vs-chip transparent color="success">
                {tr.MarriageName}
              </vs-chip>
            );
          },
        },
        { headerName: "性别", field: "GenderName" },
        {
          headerName: "状态",
          field: "Status",
          formatter: (value) => {
            return value ? "是" : "否";
          },
        },
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
            name: "编辑",
            show: true,
            method: (index, row) => {
              this.editData(row.ID);
            },
          },
        ],
      },

      //filter
      packageNameInput: "",
      status: false,

      // Pop
      title: null,
      popupActive: false,
      packageID: null,
      timer: "",
      mark: null,

      //配置项目窗口
      popupActivePackageDeployProject: false,
      titlePackageDeployProject: null,
      timer: "",
      markPackageDeployProject: null,
    };
  },
  computed: {},
  created() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.searchInfo.mecId = userInfo.mecID;
    this.getTableData();
  },
  mounted() {},
  methods: {
    getMarriageColor(status) {
      if (status === 0) return "success";
      if (status === 1) return "warning";
      if (status === 2) return "danger";
      return "success";
    },
    addNewData() {
      this.packageID = "";
      this.popupActive = true;
      this.title = "添加套餐信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.packageID = id;
      this.popupActive = true;
      this.title = "修改套餐信息";
      this.mark = "edit";
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },
    deployProject(id) {
      this.popupActivePackageDeployProject = true;
      this.packageID = id;
      this.titlePackageDeployProject = "配置套餐项目";
      this.handleLoad();
    },
    closePackageDeployProjectPop() {
      this.popupActivePackageDeployProject = false;
    },
  },
  watch: {},
};
</script>

<style lang="scss">
</style>
