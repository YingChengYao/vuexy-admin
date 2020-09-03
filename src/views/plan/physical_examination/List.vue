<template>
  <div>
    <vs-popup fullscreen :title="title" :active.sync="popupActive" v-if="popupActive">
      <examination-detail
        v-if="popupActive"
        @closePop="closePop"
        @loadData="getTableData"
        :planId="planId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">项目类型名称</label>
        <vs-input
          placeholder
          v-model="searchInfo.SingleName"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
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
          <!-- <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button> -->
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
  </div>
</template>

<script>
import ExaminationDetail from "./Detail";

import infoList from "@/components/mixins/infoList";
import { getPhysicalExaminations } from "@/http/plan.js";
import { formatTimeToStr } from "@/common/utils/data/date";

export default {
  mixins: [infoList],
  data() {
    return {
      //table
      searchInfo: {},
      selected: [],
      listApi: getPhysicalExaminations,
      cloumns: [
        { headerName: "计划名称", field: "PlanName" },
        { headerName: "单位名称", field: "CompanyName" },
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
            title: "查看",
            show: true,
            method: (index, row) => {
              this.viewData(row.ID);
            },
          },
        ],
      },

      title: null,
      popupActive: false,
      planId: null,
      timer: "",
      mark: null,
    };
  },
  components: {
    ExaminationDetail,
  },
  created() {
    this.getTableData();
  },
  mounted() {},
  methods: {
    viewData(id) {
      this.planId = id;
      this.popupActive = true;
      this.title = "查看体检动态";
      this.mark = "view";
      this.handleLoad();
    },
    closePop() {
      this.popupActive = false;
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
