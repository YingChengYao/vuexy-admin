<template>
  <div class="vx-row">
    <div class="vx-card md:w-2/5 lg:w-1/5">
      <medical-center-catalog ref="catalog" :onClickSuccess="loadPackage"></medical-center-catalog>
    </div>
    <div class="vx-col w-full md:w-3/5 lg:w-4/5">
      <vx-card class="mb-8">
        <package-type-list ref="package" :isInitData="false"></package-type-list>
      </vx-card>
    </div>
  </div>
</template>

<script>
import MedicalCenterCatalog from "views/medical_center/Catalog";
import PackageTypeList from "./List";
export default {
  components: {
    MedicalCenterCatalog,
    PackageTypeList,
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
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
