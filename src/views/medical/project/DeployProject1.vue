<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full md:w-2/5 lg:w-1/5 rounded-lg">
        <project-show />
      </div>

      <div class="vx-col w-full md:w-3/5 lg:w-4/5 mt-12 md:mt-0">
        <project-list :packageId="packageId" :isComponent="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectList from "views/medical/project/List";
import ProjectShow from "views/medical/project/Show";

export default {
  name: "",
  data() {
    return {
      packageId: null
    };
  },
  components: {
    ProjectList,
    ProjectShow
  },
  created() {
    this.packageId = this.$route.params.id;
  },
  mounted() {},
  methods: {}
};
</script>
<style lang='sass' scoped>
</style>
