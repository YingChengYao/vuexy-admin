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
      <div class="p-6">
        <!-- 项目类型名称 -->
        <vs-input
          label="项目类型名称"
          v-model="dataTypeName"
          class="mt-5 w-full"
          name="项目类型名称"
          v-validate="'required'"
        />
        <span class="text-danger text-sm" v-show="errors.has('项目类型名称')">{{ errors.first('项目类型名称') }}</span>

        <!-- 描述 -->
        <vs-input
          label="描述"
          v-model="dataRemark"
          class="mt-5 w-full"
          name="描述"
          v-validate="'required'"
        />
        <span class="text-danger text-sm" v-show="errors.has('描述')">{{ errors.first('描述') }}</span>

        <!-- 排序 -->
        <vs-input
          label="排序"
          v-model="dataSort"
          class="mt-5 w-full"
          name="排序"
          v-validate="'numeric'"
        />
        <span class="text-danger text-sm" v-show="errors.has('排序')">{{ errors.first('排序') }}</span>

        <div class="mt-4" v-show="data.ID">
          <label class="vs-input--label">状态</label>
          <v-select
            v-model="data.Status"
            label="Name"
            value="Value"
            :options="statusOptions"
            :reduce="m => m.Value"
          />
        </div>
      </div>
    </component>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData" :disabled="!isFormValid">提交</vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">取消</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import { addItemType, editItemType } from "@/http/package.js";
import { getDataStatusDataSource } from "@/http/data_source.js";

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
      statusOptions: [],
    };
  },
  watch: {
    isSidebarActive(val) {
      if (!val) return;
      if (this.data.ID) {
        this.dataTypeName = this.data.TypeName;
        this.dataRemark = this.data.Remark;
        this.dataSort = this.data.Sort;
      } else {
        this.initValues();
        this.$validator.reset();
      }
    },
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar");
          this.$validator.reset();
          this.initValues();
        }
      },
    },
    isFormValid() {
      return !this.errors.any() && this.dataTypeName;
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
  },
  methods: {
    initValues() {
      this.dataTypeName = null;
      this.dataRemark = null;
      this.dataSort = null;
    },
    async loadDataStatus() {
      await getDataStatusDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.statusOptions = data;
        }
      });
    },
    submitData() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          if (this.data.mark == "add") {
            let para = {
              typeName: this.dataTypeName,
              remark: this.dataRemark,
              sort: this.dataSort,
              mecid: userInfo.mecID,
            };
            addItemType(para).then((res) => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "成功",
                  text: res.message,
                  color: "success",
                });
                this.$emit("closeSidebar");
                this.$emit("loadData");
                this.initValues();
              }
            });
          } else if (this.data.mark == "edit") {
            let para = {
              ID: this.data.ID,
              typeName: this.dataTypeName,
              remark: this.dataRemark,
              sort: this.dataSort,
              mecid: userInfo.mecID,
              status: this.data.Status,
            };
            console.log("para:", para);
            editItemType(para).then((res) => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "成功",
                  text: res.message,
                  color: "success",
                });
                this.$emit("loadData");
                this.$emit("closeSidebar");
                this.initValues();
              }
            });
          }
        }
      });
    },
  },
  created() {
    this.loadDataStatus();
  },
};
</script>

<style lang="scss" scoped>
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
</style>
