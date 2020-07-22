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
      <h4>{{ Object.entries(this.data).length === 0 ? "新增" : "UPDATE" }}用户</h4>
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
        <!-- 用户名 -->
        <vs-input
          label="用户名"
          v-model="dataName"
          class="mt-5 w-full"
          name="用户名"
          v-validate="'required|alpha_num'"
        />
        <span class="text-danger text-sm" v-show="errors.has('用户名')">{{ errors.first('用户名') }}</span>

        <!-- 身份证 -->
        <vs-input
          label="身份证"
          v-model="idNumber"
          class="mt-5 w-full"
          name="身份证"
          v-validate="'required|id_card_no'"
        />
        <span class="text-danger text-sm" v-show="errors.has('身份证')">{{ errors.first('身份证') }}</span>

        <!-- 手机号 -->
        <vs-input label="手机号" v-model="mobile" class="mt-5 w-full" name="手机号" v-validate="'mobile'" />
        <span class="text-danger text-sm" v-show="errors.has('手机号')">{{ errors.first('手机号') }}</span>

        <!-- 婚姻状况 -->
        <vs-select
          v-model="dataMarital"
          label="婚姻状况"
          class="mt-5 w-full"
          name="婚姻状况"
        >
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.text"
            v-for="item in maritalStatus"
          />
        </vs-select>
        <span class="text-danger text-sm" v-show="errors.has('婚姻状况')">{{ errors.first('婚姻状况') }}</span>

        <!-- 性别 -->
        <vs-select
          v-model="dataGender"
          label="性别"
          class="mt-5 w-full"
          name="性别"
        >
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.text"
            v-for="item in genders"
          />
        </vs-select>
        <span class="text-danger text-sm" v-show="errors.has('性别')">{{ errors.first('性别') }}</span>

        <!-- 备注 -->
        <vs-input label="备注" v-model="remark" class="mt-5 w-full" name="备注" />
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
import { addUser } from "@/http/member.js";

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
      dataName: "",
      idNumber: "",
      mobile: "",
      remark: "",
      dataGender: "",
      genders: [
        { text: "请选择", value: null },
        { text: "男", value: "1" },
        { text: "女", value: "2" }
      ],
      dataMarital: null,
      maritalStatus: [
        { text: "请选择", value: null },
        { text: "已婚", value: "1" },
        { text: "未婚", value: "2" },
        { text: "离异", value: "3" },
        { text: "丧偶", value: "4" }
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
      if (Object.entries(this.data).length === 0) {
        this.initValues();
        this.$validator.reset();
      } else {
        // const { category, id, img, name, order_status, price } = JSON.parse(
        //   JSON.stringify(this.data)
        // );
        // this.dataId = id;
        // this.dataCategory = category;
        // this.dataImg = img;
        // this.dataName = name;
        // this.dataOrder_status = order_status;
        // this.dataPrice = price;
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
          this.$validator.reset();
          this.initValues();
        }
      }
    },
    isFormValid() {
      return (
        !this.errors.any() && this.dataName && this.idNumber && this.mobile
      );
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    }
  },
  methods: {
    initValues() {
      if (this.data.id) return;
      this.dataName = "";
      this.idNumber = "";
      this.mobile = "";
      this.remark = "";
      this.dataGender = "";
      this.dataMarital = "";
    },
    submitData() {
      this.$validator.validateAll().then(result => {
        if (result) {
          // if (this.dataId !== null && this.dataId >= 0) {
          //   this.$store.dispatch("dataList/updateItem", obj).catch(err => {
          //     console.error(err);
          //   });
          // } else {
          //   delete obj.id;
          //   obj.popularity = 0;
          //   this.$store.dispatch("dataList/addItem", obj).catch(err => {
          //     console.error(err);
          //   });
          // }

          const para = {
            userName: this.dataName,
            idNumber: this.idNumber,
            mobile: this.mobile,
            maritalStatus: this.dataMarital,
            gender: this.dataGender,
            remark: this.remark
          };
          addUser(para).then(res => {
            if (res.resultType == 0) {
              this.$vs.notify({
                title: "Success",
                text: res.message,
                color: "success"
              });
              this.$emit("closeSidebar");
              this.initValues();
            }
          });
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
