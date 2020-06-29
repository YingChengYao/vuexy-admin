<template>
  <div>
    <vx-card>
      <div>已选项目</div>
      <ul class="faq-topics mt-4">
        <li
          v-for="project in projectList"
          :key="project.ItemID"
          class="p-2 font-medium flex items-center"
        >
          <div class="h-3 w-3 rounded-full mr-2"></div>
          <span class="cursor-pointer">{{ project.ItemName }}</span>
        </li>
      </ul>
      <vs-row class="mb-6" vs-align="center">
        <vs-col class="sm:w-1/6">
          <span>合计</span>
        </vs-col>
        <vs-col class="sm:w-2/3">
          <vs-input disabled class="w-full" v-model="packagePrice" />
        </vs-col>
        <!-- <vs-input class="w-full" label="合计" v-model="packagePrice" name="合计" />
        <span class="text-danger text-sm" v-show="errors.has('合计')">{{ errors.first('合计') }}</span>-->
      </vs-row>
      <vs-row class="mb-6" vs-align="center">
        <vs-col class="sm:w-1/6">
          <span>折扣</span>
        </vs-col>
        <vs-col class="sm:w-2/3">
          <vs-input-number
            v-model="discount"
            :step="1"
            min="1"
            max="10"
            class="inline-flex"
            @input="updateDiscount($event)"
            v-validate="'between:1,10'"
            name="折扣"
          />
          <span class="text-danger text-sm" v-show="errors.has('折扣')">{{ errors.first('折扣') }}</span>
          <!-- <vs-input
            class="w-full"
            v-model="discount"
            v-validate="'required|between:0,1'"
            name="折扣"
          />
          <span class="text-danger text-sm" v-show="errors.has('折扣')">{{ errors.first('折扣') }}</span>-->
        </vs-col>
      </vs-row>
      <vs-row class="mb-6" vs-align="center">
        <vs-col class="sm:w-1/6">
          <span>折扣价</span>
        </vs-col>
        <vs-col class="sm:w-2/3">
          <vs-input class="w-full" v-model="discountPrice" v-validate="'required|decimal:2'" />
        </vs-col>
        <!-- <vs-input class="w-full" label="合计" v-model="packagePrice" name="合计" />
        <span class="text-danger text-sm" v-show="errors.has('合计')">{{ errors.first('合计') }}</span>-->
      </vs-row>
    </vx-card>
  </div>
</template>
<script>
export default {
  name: "",
  props: {},
  data() {
    return {
      projectList: [],
      discount: 1,
      discountPrice: 0,
      packagePrice: 0
    };
  },
  components: {},
  created() {},
  mounted() {
    console.log(0);
    this.$event.$on("checkedItems", data => {
      this.$nextTick(() => {
        this.projectList = data.checkedGroup;
        this.discount = data.discount | 1;
        this.discountPrice = data.discountPrice | 22;
        this.packagePrice = data.packagePrice | 22;
      });
    });
  },
  methods: {
    updateDiscount(event) {
      console.log(event);
    }
  }
};
</script>
<style scoped>
</style>
