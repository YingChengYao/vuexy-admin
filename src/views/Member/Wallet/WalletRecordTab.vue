<template>
  <div id="wallet-record-tab">
    <Wallet-data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      @loadData="loadData"
      :data="sidebarData"
    />

    <vs-table :data="walletRecords">
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
        <vs-th>金额</vs-th>
        <vs-th v-show="false">金额类型</vs-th>
        <vs-th>金额类型</vs-th>
        <vs-th>金额来源</vs-th>
        <vs-th>备注</vs-th>
        <vs-th>创建人</vs-th>
        <vs-th>创建时间</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="tr.ID">{{ indextr+1 }}</vs-td>
          <vs-td :data="tr.ID" v-show="false">{{ tr.ID }}</vs-td>
          <vs-td :data="tr.Money">{{ tr.Money }}</vs-td>
          <vs-td :data="tr.WalletType" v-show="false">{{ tr.WalletType }}</vs-td>
          <vs-td :data="tr.WalletTypeName">{{ tr.WalletTypeName }}</vs-td>

          <vs-td :data="tr.Type">{{ tr.Type }}</vs-td>
          <vs-td :data="tr.Remark">{{ tr.Remark }}</vs-td>
          <vs-td :data="tr.CreateId">{{ tr.CreateId }}</vs-td>
          <vs-td :data="tr.CreateTime">{{ tr.CreateTime | formatDate}}</vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <div class="con-pagination-table vs-table--pagination">
      <vs-pagination
        :total="totalPage"
        v-model="currentPage"
        :pagedown="true"
        :totalItems="totalItems"
        @changePageMaxItems="changePageMaxItems"
        :pagedownItems="descriptionItems"
        :size="pageSize"
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
import WalletDataViewSidebar from "./WalletDataViewSidebar.vue";
import { getWalletRecords } from "@/http/member.js";

export default {
  props: {
    userId: {
      type: String
    }
  },
  components: {
    WalletDataViewSidebar
  },

  data() {
    return {
      //data_local: JSON.parse(JSON.stringify(this.userId))
      currentPage: 1,
      pageSize: 4,
      totalPage: 0,
      totalItems: 0,
      descriptionItems: [4, 10, 15, 20],
      walletRecords: [],

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
      getWalletRecords(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.walletRecords = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          console.log("钱包：", data);
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
#wallet-record-tab {
  .header-left {
    flex: 1;
  }
}
</style>

