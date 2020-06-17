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
      <!-- <h4>{{ Object.entries(this.data).length === 0 ? "ADD NEW" : "UPDATE" }} ITEM</h4> -->
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
        <!-- 积分 -->
        <vs-input
          label="积分"
          v-model="dataIntegral"
          class="mt-5 w-full"
          name="积分"
          v-validate="{ required: true, regex: /\d+(\.\d+)?$/ }"
        />
        <span class="text-danger text-sm" v-show="errors.has('积分')">{{ errors.first('积分') }}</span>

        <!-- 备注 -->
        <vs-input label="备注" v-model="dataRemark" class="mt-5 w-full" name="备注" />
        <span class="text-danger text-sm" v-show="errors.has('备注')">{{ errors.first('备注') }}</span>
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

import { addIntegra, spendIntegra } from "@/http/member.js";

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    VuePerfectScrollbar
  },
  data() {
    return {
      dataIntegral: null,
      dataRemark: null,

      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  watch: {
    isSidebarActive(val) {
      if (!val) return;
      if (Object.entries(this.data).length === 0) {
        this.initValues();
        this.$validator.reset();
      } else {
        const { category, id, img, name, order_status, price } = JSON.parse(
          JSON.stringify(this.data)
        );
        this.dataId = id;
        this.dataCategory = category;
        this.dataImg = img;
        this.dataName = name;
        this.dataOrder_status = order_status;
        this.dataPrice = price;
        this.initValues();
      }
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    }
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar");
          // this.$validator.reset()
          this.initValues();
        }
      }
    },
    isFormValid() {
      return !this.errors.any() && this.dataIntegral;
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    }
  },
  methods: {
    initValues() {
      if (this.data.id) return;
      this.dataIntegral = null;
      this.dataRemark = null;
    },
    submitData() {
      this.$validator.validateAll().then(result => {
        if (result) {
          debugger;
          const para = {
            userId: this.data.userId,
            integral: this.dataIntegral,
            remark: this.dataRemark
          };

          if (this.data.mark == "add") {
            addIntegra(para).then(res => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success"
                });
                this.$emit("closeSidebar");
                this.$emit("loadData");
                this.initValues();
              }
            });
          } else if (this.data.mark == "spend") {
            spendIntegra(para).then(res => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success"
                });
                this.$emit("loadData");
                this.$emit("closeSidebar");
                this.initValues();
              }
            });
          }
        }
      });
    }
  }
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
