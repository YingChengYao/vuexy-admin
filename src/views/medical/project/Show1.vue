<template>
  <div>
    <vx-card>
      <div>已选项目</div>
      <ul class="faq-topics mt-4 mb-5" v-if="projectList.length>0">
        <li v-for="tr in projectList" :key="tr.ItemID" class="p-2 font-medium flex items-center">
          <div class="h-3 w-3 rounded-full mr-2"></div>
          <span class="cursor-pointer">{{ tr.ItemName }}</span>
          <span
            class="text-primary px-4 cursor-pointer"
            size="small"
            type="border"
            @click="delProject(tr.ItemID)"
          >删除</span>
        </li>
      </ul>
      <div v-else class="mb-5">No Data</div>
      <vs-row class="mb-6" vs-align="center">
        <vs-col class="sm:w-1/6">
          <span>合计</span>
        </vs-col>
        <vs-col class="sm:w-2/3">
          <vs-input disabled class="w-full" v-model="packagePrice" />
        </vs-col>
      </vs-row>
      <vs-row class="mb-6" vs-align="center">
        <vs-col class="sm:w-1/6">
          <span>折扣</span>
        </vs-col>
        <vs-col class="sm:w-2/3">
          <vs-input-number
            v-model="discount"
            :step="1"
            min="0"
            max="10"
            class="inline-flex"
            @input="changeDiscount($event)"
            v-validate="'between:0,10|decimal:1'"
            name="折扣"
          />
          <span class="text-danger text-sm" v-show="errors.has('折扣')">{{ errors.first('折扣') }}</span>
        </vs-col>
      </vs-row>
      <vs-row class="mb-6" vs-align="center">
        <vs-col class="sm:w-1/6">
          <span>折扣价</span>
        </vs-col>
        <vs-col class="sm:w-2/3 px-2">
          <vs-input
            class="w-full"
            v-model="discountPrice"
            v-validate="'required|decimal:2'"
            name="折扣价"
            @input="changeDiscountPrice($event)"
          />
          <span class="text-danger text-sm" v-show="errors.has('折扣价')">{{ errors.first('折扣价') }}</span>
        </vs-col>
      </vs-row>
    </vx-card>
  </div>
</template>
<script>
import {
  accAdd,
  accSubtr,
  accMul,
  accDivCoupon
} from "@/common/utils/data/calc";

export default {
  name: "",
  props: {},
  data() {
    return {
      projectList: [],
      discount: 10,
      discountPrice: 0
    };
  },
  components: {},
  computed: {
    packagePrice() {
      return this.projectList.reduce((pre, cur) => {
        return accAdd(pre, cur.ItemPrice);
      }, 0);
    }
  },
  watch: {
    packagePrice() {
      let price = accMul(accDivCoupon(this.discount, 10), this.packagePrice);
      this.discountPrice = price.toFixed(2);
    },
    discount() {
      this.$event.$emit("projectDiscount", this.discount);
    },
    discountPrice() {
      this.$event.$emit("projectDiscountPrice", this.discountPrice);
    }
  },
  created() {},
  mounted() {
    this.$event.$on("checkedItems", data => {
      this.$nextTick(() => {
        this.projectList = data.checkedGroup;
      });
    });
    this.$event.$on("initProjectCheckedData", data => {
      this.$nextTick(() => {
        console.log("initProjectCheckedData:", data);
        this.projectList = data.checkedGroup;
        this.discount = data.discount;
        this.discountPrice = data.discountPrice;
      });
    });
  },
  methods: {
    changeDiscount(event) {
      let price = accMul(this.packagePrice, accDivCoupon(event, 10));
      this.discountPrice = price.toFixed(2);
    },
    changeDiscountPrice(event) {
      let dis = accMul(accDivCoupon(event, this.packagePrice), 10);
      this.discount = dis.toFixed(1);
    },
    delProject(id) {
      this.$event.$emit("delProject", id);
    }
  }
};
</script>
<style scoped>
</style>
