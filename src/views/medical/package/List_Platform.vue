<template>
  <div class="vx-row">
    <div class="vx-card md:w-2/5 lg:w-1/5">
      <medical-center-catalog ref="catalog" :onClickSuccess="loadPackage"></medical-center-catalog>
    </div>
    <div class="vx-col w-full md:w-3/5 lg:w-4/5">
      <vx-card class="mb-8">
        <package-list ref="package" :isInitData="false"></package-list>
      </vx-card>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import MedicalCenterCatalog from "views/medical_center/Catalog";
import PackageList from "./List";
export default {
  components: {
    MedicalCenterCatalog,
    PackageList,
    VuePerfectScrollbar,
  },
  props: {},
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
    };
  },
  computed: {
    scrollbarTag() {
      console.log("tag:", this.$store.getters.scrollbarTag);
      return this.$store.getters.scrollbarTag;
    },
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    loadPackage(data, index) {
      this.$refs.catalog.changeIndex(index);
      this.$refs.package.loadData(data.ID);
    },
  },
};
</script>

<style lang="scss">
</style>
