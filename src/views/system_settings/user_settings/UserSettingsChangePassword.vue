<template>
  <vx-card no-shadow>

    <vs-input class="w-full mb-base" label-placeholder="旧密码" v-model="old_password" />
    <vs-input class="w-full mb-base" label-placeholder="新密码" v-model="new_password" />
    <vs-input class="w-full mb-base" label-placeholder="确认密码" v-model="confirm_new_password" />

    <!-- Save & Reset Button -->
    <div class="flex flex-wrap items-center justify-end">
      <vs-button class="ml-auto mt-2">保存</vs-button>
      <vs-button class="ml-4 mt-2" type="border" color="warning">更改</vs-button>
    </div>
  </vx-card>
</template>

<script>
export default {
  data () {
    return {
      old_password: '',
      new_password: '',
      confirm_new_password: ''
    }
  },
  computed: {
    activeUserInfo() {
      return JSON.parse(localStorage.getItem("userInfo"));
    }
  }
}
</script>
