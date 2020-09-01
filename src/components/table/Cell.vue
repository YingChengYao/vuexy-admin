<template>
  <div class ref="cell">
    <template v-if="renderType === 'expand' && !row._disableExpand">
      <div :class="expandCls" @click="toggleExpand">
        <Icon type="ios-arrow-forward"></Icon>
      </div>
    </template>
    <table-expand
      v-if="renderType === 'render'"
      :row="row"
      :column="column"
      :index="index"
      :render="column.render"
    ></table-expand>
  </div>
</template>

<script>
import TableExpand from "./expand";
export default {
  name: "",
  components: { TableExpand },
  data() {
    return {
      renderType: "",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
</style>
