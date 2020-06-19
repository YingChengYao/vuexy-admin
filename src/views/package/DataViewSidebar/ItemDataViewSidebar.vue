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
        <!-- 项目分类 -->
        <vs-select v-model="dataItemType" label="项目分类" class="mt-5 w-full" name="项目分类">
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.text"
            v-for="item in itemTypeStatus"
          />
        </vs-select>
        <span class="text-danger text-sm" v-show="errors.has('项目分类')">{{ errors.first('项目分类') }}</span>

        <!-- 项目名称 -->
        <vs-input
          label="项目名称"
          v-model="dataItemName"
          class="mt-5 w-full"
          name="项目名称"
          v-validate="'required'"
        />
        <span class="text-danger text-sm" v-show="errors.has('项目名称')">{{ errors.first('项目名称') }}</span>

        <!-- 项目价格 -->
        <vs-input
          label="项目价格"
          v-model="dataItemPrice"
          class="mt-5 w-full"
          name="项目价格"
          v-validate="'required'"
        />
        <span class="text-danger text-sm" v-show="errors.has('项目价格')">{{ errors.first('项目价格') }}</span>

        <div class="mt-4">
          <label class="vs-input--label">是否必选</label>
          <vs-switch v-model="dataIsMandatory" />
        </div>

        <!-- 婚姻状况 -->
        <vs-select v-model="dataMarital" label="婚姻状况" class="mt-5 w-full" name="婚姻状况">
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.text"
            v-for="item in maritalStatus"
          />
        </vs-select>
        <span class="text-danger text-sm" v-show="errors.has('婚姻状况')">{{ errors.first('婚姻状况') }}</span>

        <!-- 性别 -->
        <vs-select v-model="dataGender" label="性别" class="mt-5 w-full" name="性别">
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.text"
            v-for="item in genders"
          />
        </vs-select>
        <span class="text-danger text-sm" v-show="errors.has('性别')">{{ errors.first('性别') }}</span>

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

import { addItem, editItem } from "@/http/package.js";

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
      dataItemName: null,
      dataItemPrice: null,
      dataRemark: null,
      dataSort: null,
      dataIsMandatory: false,

      dataItemType: null,
      itemTypeStatus: [
        { text: "一般检查项目", value: "6471778398541963264" },
        { text: "常规检验系列", value: "6471939081858441216" },
        { text: "肿瘤疾病检测系列", value: "6472003557907488768" },
        { text: "妇科检查系列", value: "6472043303534845952" },
        { text: "彩超检查系列", value: "6472313946604036096" }
      ],
      dataMarital: null,
      maritalStatus: [
        { text: "请选择", value: null },
        { text: "已婚", value: "1" },
        { text: "未婚", value: "2" },
        { text: "离异", value: "3" },
        { text: "丧偶", value: "4" }
      ],
      dataGender: null,
      genders: [
        { text: "请选择", value: null },
        { text: "男", value: "1" },
        { text: "女", value: "2" }
      ],

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
        this.dataItemType = this.data.ItemTypeID;
        this.dataItemName = this.data.ItemName;
        this.dataItemPrice = this.data.ItemPrice;
        this.dataIsMandatory = this.data.IsMandatory;
        this.dataMarital = this.data.Marital;
        this.dataGender = this.data.Gender;
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
      return (
        !this.errors.any() &&
        this.dataItemType &&
        this.dataItemName &&
        this.dataItemPrice
      );
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    }
  },
  methods: {
    initValues() {
      this.dataItemType = null;
      this.dataItemName = null;
      this.dataItemPrice = null;
      this.dataIsMandatory = null;
      this.dataMarital = null;
      this.dataGender = null;
      this.dataRemark = null;
      this.dataSort = null;
    },
    submitData() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          let para = {
            itemTypeID: this.dataItemType,
            itemName: this.dataItemName,
            itemPrice: this.dataItemPrice,
            isMandatory: this.dataIsMandatory,
            marital: this.dataMarital,
            gender: this.dataGender,
            remark: this.dataRemark,
            sort: this.dataSort,
            mecid: userInfo.mecID
          };
          if (this.data.mark == "add") {
            addItem(para).then(res => {
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
            para.ID = this.data.ID;
            editItem(para).then(res => {
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
    loadItemTypeData() {}
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
