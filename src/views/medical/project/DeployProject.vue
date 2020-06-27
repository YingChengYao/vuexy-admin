<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full md:w-2/5 lg:w-1/4 rounded-lg">
        <vx-card>
          <project-show />
        </vx-card>
      </div>

      <div class="vx-col w-full md:w-3/5 lg:w-3/4 mt-12 md:mt-0">
        <vx-card>
          <div slot="no-body" class="tabs-container px-6 pt-6">
            <div class="tab-text">
              <project-list class="mt-4" :packageId="packageId" isSelected="true" />
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectList from "./List";
import ProjectShow from "./Show";

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
