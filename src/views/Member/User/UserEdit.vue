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
          <vs-tab label="信息" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <user-details-edit-tab class="mt-4" :userId="user_data" />
            </div>
          </vs-tab>
          <vs-tab label="积分" icon-pack="feather" icon="icon-info">
            <div class="tab-text">
              <integral-edit-tab class="mt-4" :userId="user_data" />
            </div>
          </vs-tab>
          <vs-tab label="钱包" icon-pack="feather" icon="icon-share-2">
            <div class="tab-text">
              <!-- <integral-edit-tab class="mt-4" :data="user_data" /> -->
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import { getIntegralRecords } from "@/http/member.js";

import IntegralEditTab from "../Integral/IntegralEditTab.vue";
import UserDetailsEditTab from "./UserDetailsEditTab.vue";

// Store Module
//import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

export default {
  components: {
    UserDetailsEditTab,
    IntegralEditTab
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
      //   this.$store
      //     .dispatch("userManagement/fetchUser", userId)
      //     .then(res => {
      //       this.user_data = res.data;
      //     })
      //     .catch(err => {
      //       if (err.response.status === 404) {
      //         this.user_not_found = true;
      //         return;
      //       }
      //       console.error(err);
      //     });
    },
    loadIntegralData() {
      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage
      };

      getIntegralRecords(para).then(res => {
        this.users = res.Items;
        this.totalPage = res.TotalPages;
        this.totalItems = res.TotalItems;
      });
    }
  },
  created() {
    this.fetch_user_data(this.$route.params.userId);
  }
};
</script>
