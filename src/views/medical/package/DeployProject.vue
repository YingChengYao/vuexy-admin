<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full md:w-2/5 lg:w-1/5 rounded-lg">
        <vx-card>
          <div>已选项目</div>
          <ul class="faq-topics mt-4 mb-5" v-if="projectList.length>0">
            <li v-for="tr in projectList" :key="tr.ID" class="p-2 font-medium flex items-center">
              <div class="h-3 w-3 rounded-full mr-2"></div>
              <span class="cursor-pointer">{{ tr.ItemName }}</span>
              <span
                class="text-primary px-4 cursor-pointer"
                size="small"
                type="border"
                @click="delProject(tr)"
              >删除</span>
            </li>
          </ul>
          <div v-else class="mb-5">暂无数据</div>
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

      <div class="vx-col w-full md:w-3/5 lg:w-4/5 mt-12 md:mt-0">
        <project-list
          ref="projectList"
          :packageID="packageID"
          :isComponent="true"
          :multipleCheck="true"
          @checkHandle="checkHandle"
        ></project-list>
        <div v-if="isUseButton" class="text-right mt-5">
          <span>
            <vs-button @click="save" class="mr-2" v-preventClick>保存</vs-button>
          </span>
          <span class="px-2">
            <vs-button type="border" color="warning" @click="cancel">取消</vs-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectList from "views/medical/project/List";

import {
  deployProjectForPackage,
  getProjectsForPackage,
} from "@/http/package.js";
import {
  accAdd,
  accSubtr,
  accMul,
  accDivCoupon,
} from "@/common/utils/data/calc";
export default {
  name: "",
  props: {
    packageID: {
      type: String,
      required: true,
    },
    isUseButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      discount: 10,
      discountPrice: 0,
      //packagePrice: 0,
      projectList: [],
    };
  },
  components: {
    ProjectList,
  },
  computed: {
    packagePrice() {
      return this.projectList.reduce((pre, cur) => {
        return pre + cur.ItemPrice;
      }, 0);
    },
  },
  created() {},
  mounted() {
    this.loadCheckedGroup();
  },
  watch: {
    packagePrice() {
      let price = (this.discount / 10) * this.packagePrice;
      this.discountPrice = price.toFixed(2);
    },
  },
  methods: {
    loadCheckedGroup() {
      if (!this.packageID) return;
      let para = {
        packageID: this.packageID,
      };
      getProjectsForPackage(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);

          this.$refs.projectList.loadSelectedData(data.Item);

          data.Discount = !data.Discount ? 1 : data.Discount;
          this.discount = accMul(data.Discount, 10);
          this.discountPrice =
            data.DiscountPrice == null ? 0 : data.DiscountPrice;
        }
      });
    },
    save() {
      let projectIds = this.$refs.projectList.selected
        .map((obj) => {
          return obj.ID;
        })
        .join(",");

      let para = {
        packageID: this.packageID,
        itemIDs: projectIds,
        discount: this.discount / 10,
        discountPrice: this.discountPrice,
      };
      deployProjectForPackage(para).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "成功",
            text: res.message,
            color: "success",
          });
          this.$emit("loadData");
          this.cancel();
        }
      });
    },
    cancel() {
      this.$emit("closePop", false);
    },
    checkHandle(val) {
      this.projectList = val;
    },
    changeDiscount(event) {
      let price = accMul(this.packagePrice, accDivCoupon(event, 10));
      this.discountPrice = price.toFixed(2);
    },
    changeDiscountPrice(event) {
      let dis = (event / this.packagePrice) * 10;
      this.discount = dis.toFixed(1);
    },
    delProject(data) {
      this.$refs.projectList.delProject(data);
    },
  },
};
</script>
<style lang='sass' scoped>
</style>
