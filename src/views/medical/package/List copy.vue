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
          v-model="searchInfo.packageName"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <label class="vx-col label-name px-2">状态</label>
        <vs-select
          v-model="searchInfo.status"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2 select-large"
        >
          <vs-select-item
            v-for="(item,index) in statusOptions"
            :key="index"
            :value="item.Value"
            :text="item.Name"
            class="w-full"
          />
        </vs-select>

        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vs-table ref="table" :data="items" stripe>
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
          <vs-th>状态</vs-th>
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
                <p>{{ tr.status!=1?'正常':'作废' }}</p>
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
import PackageEdit from "./Edit";
import PackageDeployProject from "./DeployProject";

import { getPackages } from "@/http/package.js";
import { getDataStatusDataSource } from "@/http/data_source.js";

export default {
  components: {
    PackageEdit,
    PackageDeployProject,
  },
  data() {
    return {
      items: [],
      statusOptions: [
        {
          name: "请选择",
          value: null,
        },
        {
          name: "正常",
          value: 0,
        },
        {
          name: "作废",
          value: 1,
        },
      ],
      searchInfo: {},
      selected: [],
      listApi: getPackages,
      cloumns: [
        { headerName: "项目单项名称", field: "SingleName" },
        {
          headerName: "是否作为项目使用",
          field: "IsOptional",
          formatter: (value) => {
            return value ? "是" : "否";
          },
        },
        { headerName: "排序", field: "Sort" },
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
      isLockedSelect: false,

      //Page
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,

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
  created() {},
  mounted() {
    this.loadDataStatus().then((val) => {
      this.loadData();
    });
  },
  watch: {
    currentPage() {
      this.loadData();
    },
  },
  methods: {
    async loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        mecid: userInfo.mecID,
        packageName: this.searchInfo.packageName,
        status: this.searchInfo.status,
      };

      await getPackages(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.items = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          console.log("套餐列表：", this.items);
        }
      });
    },
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
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.loadData();
    },
  },
};
</script>

<style lang="scss">
</style>
