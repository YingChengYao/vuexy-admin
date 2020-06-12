<template>
  <div id="user-edit-tab-info">
    <div class="vx-row">
      <h2>sdklfhkl</h2>
    </div>

    <!-- Save & Reset Button -->
    <!-- <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button
            class="ml-auto mt-2"
            @click="save_changes"
            :disabled="!validateForm"
          >Save Changes</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import { getUserDetails } from "@/http/member.js";

export default {
  props: {
    userId: {
      type: String
    }
  },
  data() {
    return {
      //data_local: JSON.parse(JSON.stringify(this.userId))
    };
  },
  computed: {
    // validateForm() {
    //   return !this.errors.any();
    // }
  },
  methods: {
    loadData() {
      console.log("userId:",this.userId)
      let para = {
        id: this.userId
      };
      getUserDetails(para).then(res => {
        console.log("res:",res);
        // this.users = res.Items;
        // this.totalPage = res.TotalPages;
        // this.totalItems = res.TotalItems;
      });
    }
    // save_changes() {
    //   if (!this.validateForm) return;
    // },
    // reset_data() {
    //   this.data_local = Object.assign({}, this.data);
    // }
  },
  created() {
    this.loadData();
  }
};
</script>
