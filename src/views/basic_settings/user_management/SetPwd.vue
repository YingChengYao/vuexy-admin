<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-input
            class="w-full mt-4"
            label="密码"
            type="password"
            v-model="data_local.Password"
            v-validate="'required'"
            name="密码"
          />
          <span class="text-danger text-sm" v-show="errors.has('密码')">{{ errors.first('密码') }}</span>
        </div>
      </div>
      <!-- Save & Reset Button -->
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" @click="save_changes" v-preventClick>保存</vs-button>
            <vs-button class="ml-4 mt-2" type="border" color="warning" @click="cancel">取消</vs-button>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import {
  getDataStatusDataSource,
  getPlatformTypeDataSource,
  getSubordinateUnitDataSource,
  getMedicalCenterDataSource,
} from "@/http/data_source.js";
import { setPasswordForUser } from "@/http/basic_setting.js";

export default {
  components: {},
  props: {
    userId: {
      type: String,
      default: null,
    },
    mark: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      data_local: {},
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    save_changes() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let para = {
            id: this.userId,
            password: this.data_local.Password,
          };
          setPasswordForUser(para).then((res) => {
            if (res.resultType == 0) {
              this.$vs.notify({
                title: "成功",
                text: res.message,
                color: "success",
              });
              this.cancel();
            }
          });
        }
      });
    },
    cancel() {
      this.$emit("closePop", false);
    },
  },
};
</script>
<style lang='sass' scoped>
</style>
