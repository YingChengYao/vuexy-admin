<template>
  <div class>
    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <div class="tab-text">
          <project-list class="mt-4" :packageId="packageId" />
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import ProjectList from "../project/List";

export default {
  name: "",
  data() {
    return {
      packageId: null
    };
  },
  components: {
    ProjectList
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
