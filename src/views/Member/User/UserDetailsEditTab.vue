<template>
  <div id="user-edit-tab-info">
    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <vs-input
          class="w-full mt-4"
          label="用户名"
          v-model="data_local.UserName"
          v-validate="'required|alpha_num'"
          name="用户名"
        />
        <span class="text-danger text-sm" v-show="errors.has('用户名')">{{ errors.first('用户名') }}</span>

        <vs-input
          class="w-full mt-4"
          label="身份证"
          v-model="data_local.IdNumber"
          v-validate="'required|id_card_no'"
          name="身份证"
        />
        <span class="text-danger text-sm" v-show="errors.has('身份证')">{{ errors.first('身份证') }}</span>

        <vs-input
          class="w-full mt-4"
          label="手机号"
          v-model="data_local.Mobile"
          v-validate="'required|phone'"
          name="手机号"
        />
        <span class="text-danger text-sm" v-show="errors.has('手机号')">{{ errors.first('手机号') }}</span>

         <!-- <vs-input class="w-full mt-4" label="是否锁定" v-model="data_local.IsLocked" name="是否锁定" />
        <span class="text-danger text-sm" v-show="errors.has('是否锁定')">{{ errors.first('是否锁定') }}</span>-->
        <div class="mt-4">
          <label class="vs-input--label">是否锁定</label>
          <vs-switch v-model="data_local.IsLocked" />
        </div>
      </div>

      <div class="vx-col md:w-1/2 w-full">
        <div class="mt-4">
          <label class="vs-input--label">婚姻状况</label>
          <v-select
            v-model="marital_status"
            :clearable="false"
            :options="maritalOptions"
            v-validate="'required'"
            name="status"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('status')"
          >{{ errors.first('status') }}</span>
        </div>

        <div class="mt-4">
          <label class="vs-input--label">性别</label>
          <v-select
            v-model="gender_local"
            :clearable="false"
            :options="genderOptions"
            v-validate="'required'"
            name="role"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
          <span class="text-danger text-sm" v-show="errors.has('role')">{{ errors.first('role') }}</span>
        </div>

        <vs-input class="w-full mt-4" label="备注" v-model="data_local.remark" name="备注" />
        <span class="text-danger text-sm" v-show="errors.has('备注')">{{ errors.first('备注') }}</span>
       
      </div>
    </div>

    <!-- Save & Reset Button -->
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="save_changes" :disabled="!validateForm">更改</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="back">返回</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { getUserDetails, updateUser } from "@/http/member.js";

export default {
  props: {
    userId: {
      type: String
    }
  },
  components: {
    vSelect
  },
  data() {
    return {
      data_local: {},
      maritalOptions: [
        { label: "请选择", value: null },
        { label: "已婚", value: "1" },
        { label: "未婚", value: "2" },
        { label: "离异", value: "3" },
        { label: "丧偶", value: "4" }
      ],
      genderOptions: [
        { label: "请选择", value: null },
        { label: "男", value: "1" },
        { label: "女", value: "2" }
      ]
    };
  },
  computed: {
    marital_status: {
      get() {
        return {
          label: this.data_local.MaritalStatusName,
          value: this.data_local.MaritalStatus
        };
      },
      set(obj) {
        this.data_local.MaritalStatus = obj.value;
        this.data_local.MaritalStatusName = obj.label;
      }
    },
    gender_local: {
      get() {
        return {
          label: this.data_local.GenderName,
          value: this.data_local.Gender
        };
      },
      set(obj) {
        this.data_local.Gender = obj.value;
        this.data_local.GenderName = obj.label;
      }
    },
    validateForm() {
      return !this.errors.any();
    }
  },
  methods: {
    loadData() {
      let para = {
        id: this.userId
      };
      getUserDetails(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
        }
      });
    },
    save_changes() {
      if (!this.validateForm) return;

      const para = {
        id: this.data_local.ID,
        userName: this.data_local.UserName,
        idNumber: this.data_local.IdNumber,
        mobile: this.data_local.Mobile,
        maritalStatus: this.data_local.MaritalStatus,
        remark: this.data_local.Remark,
        gender: this.data_local.Gender,
        isLocked: this.data_local.IsLocked
      };

      updateUser(para).then(res => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "Success",
            text: res,
            color: "success"
          });
        }
      });
    },
    back() {
      this.$router.push("/member-user").catch(() => {});
    }
  },
  created() {
    this.loadData();
  }
};
</script>
