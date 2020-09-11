<template>
  <div class ref="cell">
    <template v-if="renderType === 'normal'">
      <!-- <template v-if="column.tooltip">
        <Tooltip
          transfer
          :content="row[column.key]"
          :theme="tableRoot.tooltipTheme"
          :disabled="!showTooltip"
          :max-width="300"
          class="ivu-table-cell-tooltip"
        >
          <span
            ref="content"
            @mouseenter="handleTooltipIn"
            @mouseleave="handleTooltipOut"
            class="ivu-table-cell-tooltip-content"
          >{{ row[column.key] }}</span>
        </Tooltip>
      </template>
      <span v-else>{{row[column.key]}}</span>-->
      <span>{{column.formatter?column.formatter(row[column.field],row):row[column.field]}}</span>
    </template>
    <table-render
      v-if="renderType === 'render'"
      :row="row"
      :column="column"
      :index="index"
      :render="column.render"
    ></table-render>
  </div>
</template>

<script>
import TableRender from "./render";
export default {
  name: "",
  components: { TableRender },
  props: {
    row: Object,
    column: Object,
    index: Number, // _index of data
    checked: Boolean,
    disabled: Boolean,
    expanded: Boolean,
    fixed: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      renderType: "",
    };
  },
  created() {
    if (this.column.type === "index") {
      this.renderType = "index";
    } else if (this.column.type === "selection") {
      this.renderType = "selection";
    } else if (this.column.type === "html") {
      this.renderType = "html";
    } else if (this.column.type === "expand") {
      this.renderType = "expand";
    } else if (this.column.render) {
      this.renderType = "render";
    } else if (this.column.slot) {
      this.renderType = "slot";
    } else {
      this.renderType = "normal";
    }
  },
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
</style>
