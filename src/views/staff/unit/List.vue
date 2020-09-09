<template>
  <div class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive" v-if="popupActive" width="60%">
      <unit-edit
        @closePop="closePop"
        @loadData="getTableData"
        :unitId="unitId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">单位名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="searchInfo.unitName"
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
      <qr-table
        ref="table"
        v-model="selected"
        :items="tableData"
        :multipleCheck="multipleCheck"
        :cloumns="cloumns"
        :operates="operates"
      >
        <template slot="header">
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          <vs-button
            color="primary"
            type="border"
            class="mb-4 mr-4"
            @click.stop="$refs.fileInput.click()"
          >批量导入</vs-button>
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click.stop="download()">模板下载</vs-button>
        </template>
      </qr-table>
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
import UnitEdit from "./Edit";
import { composeTree } from "@/common/utils/data/array.js";
import { getEmployeeUnits, batchAddEmployeeUnit } from "@/http/staff.js";
import { getDataStatusDataSource } from "@/http/data_source.js";

import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";

export default {
  mixins: [infoList],
  components: {
    UnitEdit,
  },
  props: {
    multipleCheck: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //Page
      searchInfo: {},
      selected: [],
      listApi: getEmployeeUnits,
      cloumns: [
        { headerName: "单位名称", field: "CompanyName", expand: true },
        { headerName: "单位编码", field: "CompanyCode" },
        { headerName: "辖区", field: "CountyName" },
        { headerName: "联系人", field: "Contact" },
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
            title: "编辑",
            show: true,
            method: (index, row) => {
              this.editData(row.ID);
            },
          },
        ],
      },

      //filter
      statusOptions: [],

      // Pop
      title: null,
      popupActive: false,
      unitId: null,
      timer: "",
      mark: null,
    };
  },
  computed: {},
  mounted() {
    this.loadDataStatus().then((val) => {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.searchInfo.id = userInfo.companyID;
      this.getTableData();
    });
  },
  watch: {},
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
      getEmployeeUnits(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          //this.tableData = data.Items;
          this.totalItems = data.TotalItems;
          this.tableData = [];
          let d = composeTree(data.Items, "ID", "ParentID");
          this.initData(d, 0, null);
          console.log("单位:", this.tableData);
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
    toggle: function (m) {
      if (m.children) {
        this.toggleExpand(m.ID, !m.isExpand);
        m.isExpand = !m.isExpand;
      }
    },
    toggleExpand(ID, isShow) {
      this.tableData.map((i) => {
        if (i.parent == ID) {
          i.isShow = isShow;
          if (i.children) {
            if (isShow) {
              if (i.isExpand) this.toggleExpand(i.ID, isShow);
            } else {
              if (i.isExpand) {
                this.toggleExpand(i.ID, isShow);
              }
            }
          }
        }
      });
    },
    handleClick(e) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let formData = new FormData();
      formData.append("Files", e.target.files[0]);
      formData.append("CompanyID", userInfo.companyID);
      batchAddEmployeeUnit(formData).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "成功",
            text: "名单导入成功",
            color: "success",
          });
          this.getTableData();
        }
      });
    },
    download() {
      const url = global.baseURL + "/Template/NewCompanyTemplate.xlsx";
      var iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
    },
    //#region 弹窗
    addNewData() {
      this.unitId = null;
      this.popupActive = true;
      this.title = "添加职工单位";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.unitId = id;
      this.popupActive = true;
      this.title = "修改职工单位";
      this.mark = "edit";
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },
    //#endregion
  },
};
</script>

<style lang="scss" scoped>
</style>
