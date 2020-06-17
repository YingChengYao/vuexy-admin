<template>
  <div id="integral-record-tab">
    <integral-data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      @loadData="loadData"
      :data="sidebarData"
    />

    <vs-table :data="integralRecords">
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">充值</vs-button>
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click="spend">消费</vs-button>
        </div>
        <div class="flex flex-wrap-reverse items-center data-list-btn-container">
          <vs-button color="primary" type="border" class="mb-4 mr-4 right" @click="back">返回</vs-button>
        </div>
      </div>

      <template slot="thead">
        <vs-th>编号</vs-th>
        <vs-th v-show="false">ID</vs-th>
        <vs-th>积分</vs-th>
        <vs-th v-show="false">积分类型</vs-th>
        <vs-th>积分类型</vs-th>
        <vs-th>积分来源</vs-th>
        <vs-th>备注</vs-th>
        <vs-th>创建人</vs-th>
        <vs-th>创建时间</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="tr.ID">{{ indextr+1 }}</vs-td>
          <vs-td :data="tr.ID" v-show="false">{{ tr.ID }}</vs-td>
          <vs-td :data="tr.Integral">{{ tr.Integral }}</vs-td>
          <vs-td :data="tr.MemberPointsType" v-show="false">{{ tr.MemberPointsType }}</vs-td>
          <vs-td :data="tr.MemberPointsTypeName">{{ tr.MemberPointsTypeName }}</vs-td>

          <vs-td :data="tr.Type">{{ tr.Type }}</vs-td>
          <vs-td :data="tr.Remark">{{ tr.Remark }}</vs-td>
          <vs-td :data="tr.CreateId">{{ tr.CreateId }}</vs-td>
          <vs-td :data="tr.CreateTime">{{ tr.CreateTime | formatDate}}</vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <div class="con-pagination-table vs-table--pagination">
      <vs-pagination
        :statistics="true"
        :statisticalItems="statisticalItems"
        :total="totalPage"
        v-model="currentPage"
        :pagedown="true"
        :totalItems="totalItems"
        @changePageMaxItems="changePageMaxItems"
        :pagedownItems="descriptionItems"
        :size="pageSize"
        statisticsColor="success"
      ></vs-pagination>
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end"></div>
      </div>
    </div>
  </div>
</template>

<script>
import IntegralDataViewSidebar from "./IntegralDataViewSidebar.vue";

import { getIntegralRecords } from "@/http/member.js";

export default {
  props: {
    userId: {
      type: String
    }
  },
  components: {
    IntegralDataViewSidebar
  },

  data() {
    return {
      //data_local: JSON.parse(JSON.stringify(this.userId))
      currentPage: 1,
      pageSize: 4,
      totalPage: 0,
      totalItems: 0,
      descriptionItems: [4, 10, 15, 20],
      integralRecords: [],
      statisticalItems: [{ name: "剩余积分：", data: "ss" }],

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {}
    };
  },
  computed: {},
  methods: {
    loadData() {
      let para = {
        userid: this.userId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      };
      getIntegralRecords(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("积分明细：", data);
          this.integralRecords = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          this.statisticalItems = [
            { name: "剩余积分：", data: data.SurplusSum },
            { name: "已充值积分：", data: data.JoinSum },
            { name: "已消费积分：", data: data.OutSum }
          ];
        }
      });
    },
    addNewData() {
      this.sidebarData = {
        userId: this.userId,
        title: "充值",
        mark: "add"
      };
      this.toggleDataSidebar(true);
    },
    spend() {
      this.sidebarData = {
        userId: this.userId,
        title: "消费",
        mark: "spend"
      };
      this.toggleDataSidebar(true);
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
    deleteData() {},
    back() {
      this.$router.push("/member-user").catch(() => {});
    },
    changePageMaxItems(index) {
      this.pageSize = this.descriptionItems[index];
      this.loadData();
    }
  },
  created() {
    this.loadData();
  },
  watch: {
    currentPage() {
      this.loadData();
    }
  }
};
</script>

<style lang="scss">
#integral-record-tab {
  .header-left {
    flex: 1;
  }
}
</style>

