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
        <!-- 项目单项名称 -->
        <vs-input
          label="项目单项名称"
          v-model="dataProjectItemName"
          class="mt-5 w-full"
          name="项目单项名称"
          v-validate="'required'"
        />
        <span class="text-danger text-sm" v-show="errors.has('项目单项名称')">{{ errors.first('项目单项名称') }}</span>

        <!-- 项目单项价格 -->
        <vs-input label="项目单项价格" v-model="dataProjectItemPrice" class="mt-5 w-full" name="项目单项价格" />
        <span class="text-danger text-sm" v-show="errors.has('项目单项价格')">{{ errors.first('项目单项价格') }}</span>

        <!-- 婚姻状况 -->
        <div class="mt-4">
          <label class="vs-input--label">婚姻状况</label>
          <v-select
            v-model="dataMarriage"
            label="Name"
            :options="maritalStatus"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
          <!-- <span class="text-danger text-sm" v-show="errors.has('婚姻状况')">{{ errors.first('婚姻状况') }}</span> -->
        </div>

        <!-- 性别 -->
        <div class="mt-4">
          <label class="vs-input--label">性别</label>
          <v-select
            v-model="dataGender"
            label="Name"
            :options="genders"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
          <!-- <span class="text-danger text-sm" v-show="errors.has('性别')">{{ errors.first('性别') }}</span> -->
        </div>

        <!-- 描述 -->
        <vs-input label="描述" v-model="dataRemark" class="mt-5 w-full" name="描述" />
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
          <label class="vs-input--label">是否锁定</label>
          <vs-switch v-model="data.IsLocked" />
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
import vSelect from "vue-select";

import { addProjectItem, editProjectItem } from "@/http/package.js";
import {
  getMaritalDataSource,
  getGenderDataSource
} from "@/http/data_source.js";

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
    VuePerfectScrollbar,
    vSelect
  },
  data() {
    return {
      dataProjectItemName: null,
      dataProjectItemPrice: null,
      dataRemark: null,
      dataSort: null,

      dataMarriage: null,
      maritalStatus: [],
      dataGender: null,
      genders: [],

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
      if (this.data.ID) {
        this.dataProjectItemName = this.data.TypeName;
        this.dataRemark = this.data.Remark;
        this.dataSort = this.data.Sort;
      } else {
        this.initValues();
        this.$validator.reset();
      }
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
          this.$validator.reset();
          this.initValues();
        }
      }
    },
    isFormValid() {
      return !this.errors.any() && this.dataProjectItemName;
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    }
  },
  methods: {
    initValues() {
      this.dataProjectItemName = null;
      this.dataRemark = null;
      this.dataSort = null;
    },
    submitData() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          if (this.data.mark == "add") {
            let para = {
              sngleName: this.dataProjectItemName,
              singlePrice: this.dataProjectItemPrice,
              marriage: this.dataMarriage,
              gender: this.dataGender,
              sort: this.dataSort,
              remark: this.dataRemark,
              mecid: userInfo.mecID,
              isOptional: false
            };
            addProjectItem(para).then(res => {
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
          } else if (this.data.mark == "edit") {
            let para = {
              ID: this.data.ID,
              typeName: this.dataProjectItemName,
              remark: this.dataRemark,
              sort: this.dataSort,
              mecid: userInfo.mecID,
              isLocked: this.data.IsLocked
            };
            console.log("para:", para);
            editProjectItem(para).then(res => {
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
    },
    loadMaritalStatus() {
      getMaritalDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.maritalStatus = data;
        }
      });
    },
    loadGender() {
      getGenderDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.genders = data;
        }
      });
    }
  },
  created() {
    this.loadMaritalStatus();
    this.loadGender();
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
