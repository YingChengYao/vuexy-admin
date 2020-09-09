<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ this.data.title }}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component
      :is="scrollbarTag"
      class="scroll-area--data-list-add-new"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="mt-6 px-6">
        <v-tree
          ref="tree"
          :canDeleteRoot="true"
          :data="treeData"
          :draggable="true"
          :tpl="tpl"
          :halfcheck="true"
          :multiple="true"
        />
      </div>
    </component>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData">提交</vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">取消</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { VTree, VSelectTree } from "vue-tree-halower";

import { getMenusForRole, deployMenuForRole } from "@/http/basic_setting.js";

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    VuePerfectScrollbar,
    VTree,
    VSelectTree,
  },
  data() {
    return {
      dataTypeName: null,
      dataRemark: null,
      dataSort: null,

      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },

      treeData: [],
    };
  },
  watch: {
    // isSidebarActive(val) {
    //   if (!val) return;
    //   if (this.data.ID) {
    //     this.dataTypeName = this.data.TypeName;
    //     this.dataRemark = this.data.Remark;
    //     this.dataSort = this.data.Sort;
    //   } else {
    //     this.initValues();
    //     this.$validator.reset();
    //   }
    // },
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar");
        }
      },
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
  },
  methods: {
    loadData() {
      console.log(this.data);
      let para = {
        roleId: this.data.ID,
      };
      getMenusForRole(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.treeData = data;
          console.log(data);
        }
      });
    },
    submitData() {
      let checked = this.$refs.tree.getCheckedNodes();
      let menus = checked
        .map((obj) => {
          return obj.id;
        })
        .join(",");

      let para = {
        id: this.data.ID,
        menus: menus,
      };
      deployMenuForRole(para).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "成功",
            text: res.message,
            color: "success",
          });
          this.$emit("closeSidebar");
          this.$emit("loadData");
        }
      });
    },
    tpl(...args) {
      let { 0: node, 2: parent, 3: index } = args;
      let titleClass = node.selected
        ? "node-title node-selected"
        : "node-title";
      if (node.searched) titleClass += " node-searched";
      return (
        <span>
          <span
            class={titleClass}
            domPropsInnerHTML={node.title}
            onClick={() => {
              this.$refs.tree.nodeSelected(node);
            }}
          ></span>
        </span>
      );
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/vuexy/extraComponents/tree.scss";

.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
  // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

  &:not(.ps) {
    overflow-y: auto;
  }
}

button.btn-async {
  background: rgba(var(--vs-warning), 0.15);
}

button.btn-delete {
  background: rgba(var(--vs-danger), 0.15);
}

.node-selected {
  // color: red;
}
</style>
