<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full md:w-2/5 lg:w-1/5">
        <vx-card class="mb-8">
          <medical-center-catalog ref="catalog" :onClickSuccess="loadPackage"></medical-center-catalog>
        </vx-card>
      </div>
      <div class="vx-col w-full md:w-3/5 lg:w-4/5">
        <vx-card class="mb-8">
          <package-list ref="package" :isInitData="false"></package-list>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import MedicalCenterCatalog from "views/medical_center/Catalog";
import PackageList from "./List";
export default {
  components: {
    MedicalCenterCatalog,
    PackageList,
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
