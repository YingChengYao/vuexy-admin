<template>
  <div>
    <vs-row vs-align="center">
      <!-- <label class="vx-col label-name px-2">名称</label> -->
      <vs-input
        placeholder="名称"
        v-model="searchInfo.packageName"
        class="vx-col md:w-3/5 sm:w-1/2 w-full mr-4"
      />
      <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
    </vs-row>
    <ul class="faq-topics mt-4 mb-5" v-if="medicalCenters.length>0">
      <li
        v-for="(item,index) in medicalCenters"
        :key="index"
        class="p-2 font-medium flex items-center"
        style="border-bottom: 1px solid rgba(0,0,0,.08)"
        @click="onClickSuccess(item,index)"
        v-clickDown="index"
      >
        <span
          class="cursor-pointer"
          :class="{'text-primary':medicalCenterSelected==index}"
        >{{ item.MecName }}</span>
      </li>
    </ul>
    <div v-else class="p-2 mt-4 mb-5">暂无数据</div>
  </div>
</template>

<script>
import { getAllMedicalCenters } from "@/http/medical_center.js";

export default {
  name: "",
  props: {
    onClickSuccess: {
      type: Function,
      //   required: true,
    },
  },
  data() {
    return {
      medicalCenters: [],
      medicalCenterSelected: "",
      searchInfo: "",
    };
  },
  components: {},
  created() {
    this.loadData();
  },
  mounted() {},
  methods: {
    loadData() {
      getAllMedicalCenters().then((res) => {
        if (res.resultType == 0) {
          this.medicalCenters = JSON.parse(res.message);
        }
      });
    },
    changeIndex(index) {
      this.medicalCenterSelected = index;
    },
  },
  directives: {
    clickDown: {
      inserted(el, binding, index) {
        if (binding.value === 0) {
          el.click();
        }
      },
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
