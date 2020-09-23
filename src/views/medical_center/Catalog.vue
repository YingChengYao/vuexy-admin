<template>
  <div class="no-scroll-content">
    <vs-row vs-align="center" class="px-6 pt-6 mb-6 flex flex-row">
      <vs-input
        placeholder="名称"
        v-model="searchInfo.packageName"
        class="vx-col md:w-3/5 sm:w-1/2 w-full mr-4"
      />
      <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
    </vs-row>
    <component :is="scrollbarTag" class="scroll-area" :settings="settings" :key="$vs.rtl">
      <div class="px-6 flex flex-col">
        <ul class="faq-topics mb-5" v-if="medicalCenters.length>0">
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
    </component>
  </div>
</template>

<script>
import { getAllMedicalCenters } from "@/http/medical_center.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

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
      searchInfo: {},
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
    };
  },
  components: {
    VuePerfectScrollbar,
  },
  computed: {
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
  },
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
.scroll-area {
  position: relative;
  margin: auto;
  width: 100%;
  height: calc(100% - 100px);

  &:not(.ps) {
    overflow-y: auto;
  }
}
</style>
