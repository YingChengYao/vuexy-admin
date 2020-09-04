<template>
  <div class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive">
      <dictionary-edit
        v-if="popupActive"
        @closePop="closePop"
        @loadData="loadData"
        :dictionaryId="dictionaryId"
        :detailId="detailId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">名称</label>
        <vs-input
          placeholder
          v-model="searchInfo.Name"
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
    </div>
  </div>
</template>

<script>
import DictionaryEdit from "./Edit";

import { getSysDictionaryDetails } from "@/http/dictionary.js";
import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";

export default {
  mixins: [infoList],
  components: {
    DictionaryEdit,
  },
  props: {
    dictionaryId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      //Page
      listApi: getSysDictionaryDetails,
      cloumns: [
        { headerName: "展示值", field: "Name" },
        // { headerName: "字典值", field: "Code" },
        { headerName: "状态", field: "StatusName" },
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
          {
            title: "详情",
            show: true,
            method: (index, row) => {
              this.viewDetails(row.ID);
            },
          },
        ],
      },
      // Pop
      title: null,
      popupActive: false,
      timer: "",
      mark: null,
      detailId: "",
    };
  },
  computed: {},
  methods: {
    // loadData() {
    //   let para = {
    //     id: this.dictionaryId,
    //   };
    //   getSysDictionaryDetails(para).then((res) => {
    //     if (res.resultType == 0) {
    //       const data = JSON.parse(res.message);
    //       console.log("dics:", data);
    //       this.dictionaryDetails = data;
    //       this.totalItems = data.TotalItems;
    //     }
    //   });
    // },
    //#region 弹窗
    addNewData() {
      this.detailId = null;
      this.popupActive = true;
      this.title = "添加项目单项信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.detailId = id;
      this.popupActive = true;
      this.title = "修改项目单项信息";
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
  mounted() {
    this.searchInfo.id = this.dictionaryId;
    this.getTableData();
  },
  watch: {},
};
</script>

<style lang="scss">
</style>
