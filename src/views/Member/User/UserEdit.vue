<!-- =========================================================================================
  File Name: UserEdit.vue
  Description: User Edit Page
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="page-user-edit">
    <!-- <vs-alert color="danger" title="User Not Found" :active.sync="user_not_found">
      <span>User record with id: {{ $route.params.userId }} not found.</span>
      <span>
        <span>Check</span>
        <router-link :to="{name:'page-user-list'}" class="text-inherit underline">All Users</router-link>
      </span>
    </vs-alert>-->

    <vx-card v-if="user_data">
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="信息">
            <div class="tab-text">
              <user-details-edit-tab class="mt-4" :userId="user_data" />
            </div>
          </vs-tab>
          <vs-tab label="积分">
            <div class="tab-text">
              <integral-record-tab class="mt-4" :userId="user_data" />
            </div>
          </vs-tab>
          <vs-tab label="钱包">
            <div class="tab-text">
              <wallet-record-tab class="mt-4" :userId="user_data" />
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import { getIntegralRecords } from "@/http/member.js";

import IntegralRecordTab from "../Integral/IntegralRecordTab.vue";
import WalletRecordTab from "../Wallet/WalletRecordTab.vue";
import UserDetailsEditTab from "./UserDetailsEditTab.vue";

// Store Module
//import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

export default {
  
  components: {
    UserDetailsEditTab,
    WalletRecordTab,
    IntegralRecordTab
  },
  data() {
    return {
      user_data: null,
      user_not_found: false,
      activeTab: 0
    };
  },
  watch: {
    activeTab() {
      this.fetch_user_data(this.$route.params.userId);
    }
  },
  methods: {
    fetch_user_data(userId) {
      this.user_data = userId;
    },
    loadIntegralData() {
      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage
      };

      getIntegralRecords(para).then(res => {
        if (res.resultType == 0) {
          const data = res.message;
          this.users = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    }
  },
  created() {
    console.log("user:", this.$route.params.userId);
    this.fetch_user_data(this.$route.params.userId);
  }
};
</script>

<style lang="scss">
#page-user-edit {
  .vs-tabs--li button.vs-tabs--btn {
    padding-right: 20px;
    padding-left: 20px;
  }
}
</style>