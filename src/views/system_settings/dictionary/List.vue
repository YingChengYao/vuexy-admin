<template>
  <div class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive" v-if="popupActive">
      <dictionary-edit
        v-if="popupActive"
        @closePop="closePop"
        @loadData="getTableData"
        :dictionaryId="dictionaryId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>
    <vs-popup fullscreen :title="title" :active.sync="popupActiveDetail" v-if="popupActiveDetail">
      <dictionary-detail-list
        v-if="popupActiveDetail"
        @closePop="closePop"
        @loadData="getTableData"
        :dictionaryId="dictionaryId"
        :key="timer"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">字典名称</label>
        <vs-input
          placeholder
          v-model="searchInfo.name"
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
    </div>
  </div>
</template>

<script>
import DictionaryEdit from "./Edit";
import DictionaryDetailList from "./detail/List";

import { getSysDictionarys } from "@/http/dictionary.js";
import infoList from "@/components/mixins/infoList";
import { formatTimeToStr } from "@/common/utils/data/date";
import { getDataStatusDataSource } from "@/http/data_source.js";

export default {
  mixins: [infoList],
  components: {
    DictionaryEdit,
    DictionaryDetailList,
  },
  data() {
    return {
      //Page
      listApi: getSysDictionarys,
      cloumns: [
        { headerName: "字典名称", field: "Name" },
        // { headerName: "字典编码", field: "Code" },
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
      statusOptions: [],
      // Pop
      title: null,
      popupActive: false,
      dictionaryId: null,
      timer: "",
      mark: null,
      popupActiveDetail: null,
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
    //#region 弹窗
    addNewData() {
      this.dictionaryId = null;
      this.popupActive = true;
      this.title = "添加项目单项信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.dictionaryId = id;
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
    viewDetails(id) {
      this.dictionaryId = id;
      this.popupActiveDetail = true;
      this.title = "字典详情信息";
      this.handleLoad();
    },
    //#endregion
  },
  mounted() {
    this.loadDataStatus().then(() => {
      this.getTableData();
    });
  },
  watch: {},
};
</script>

<style lang="scss">
</style>
