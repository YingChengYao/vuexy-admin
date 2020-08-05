<template>
  <div class="vx-col md:w-2/3 w-full mb-base">
    <vx-card title="Form With Label Placeholder">
      <div class="vx-row mb-2">
        <div class="vx-col w-full">
          <vs-input
            class="w-full"
            icon-pack="feather"
            icon="icon-user"
            icon-no-border
            label-placeholder="我的昵称"
            v-model="name"
          />
        </div>
      </div>
      <div class="vx-row mb-2">
        <div class="vx-col w-full">
          <vs-input
            type="password"
            class="w-full"
            icon-pack="feather"
            icon="icon-lock"
            icon-no-border
            label-placeholder="旧密码"
            v-model="oldpwd"
          />
        </div>
      </div>
      <div class="vx-row mb-2">
        <div class="vx-col w-full">
          <vs-input
            type="password"
            class="w-full"
            icon-pack="feather"
            icon="icon-lock"
            icon-no-border
            label-placeholder="新密码"
            v-model="newpwd"
          />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-input
            type="password"
            class="w-full"
            icon-pack="feather"
            icon="icon-lock"
            icon-no-border
            label-placeholder="确认密码"
            v-model="confirmpwd"
          />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-button class="mr-3 mb-2">提交</vs-button>
          <vs-button
            color="warning"
            type="border"
            class="mb-2"
            @click="name = oldpwd = newpwd = confirmpwd = ''"
          >重置</vs-button>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      name: null,
      oldpwd: null,
      newpwd: null,
      confirmpwd: null,
    };
  },
  components: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='sass' scoped>
</style>
