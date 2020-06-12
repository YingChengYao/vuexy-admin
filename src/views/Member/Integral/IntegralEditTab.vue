<template>
  <div id="user-edit-tab-info">
    <div class="vx-row">
      <h2>sdklfhkl</h2>
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button
            class="ml-auto mt-2"
            @click="save_changes"
            :disabled="!validateForm"
          >更改</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="back">返回</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getIntegralRecords } from "@/http/member.js";

export default {
  props: {
    userId: {
      type: String
    }
  },
  data() {
    return {
      //data_local: JSON.parse(JSON.stringify(this.userId))
      currentPage: 1,
      PageSize: 4
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any();
    }
  },
  methods: {
    loadData() {
      let para = {
        userid: this.userId,
        pageIndex: this.currentPage,
        pageSize: this.PageSize
      };
      getIntegralRecords(para).then(res => {
        console.log("integrals:", res);
        this.integrals = res.Items;
        // this.totalPage = res.TotalPages;
        // this.totalItems = res.TotalItems;
      });
    },
    save_changes() {
      if (!this.validateForm) return;
    },
    back(){
      this.$router.push("/member-user").catch(() => {});
    }
  },
  created() {
    this.loadData();
  }
};
</script>
