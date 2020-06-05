<template>
  <vx-card no-shadow>
    <!-- Img Row -->
    <div class="flex flex-wrap items-center mb-base">
      <vs-avatar :src="activeUserInfo.photoURL" size="70px" class="mr-4 mb-4" />
      <div>
        <vs-button class="mr-4 sm:mb-0 mb-2">Upload photo</vs-button>
        <vs-button type="border" color="danger">Remove</vs-button>
        <p class="text-sm mt-2">允许使用JPG，GIF或PNG。最大大小为800kB</p>
      </div>
    </div>

    <!-- Info -->
    <vs-input class="w-full mb-base" label-placeholder="昵称" v-model="activeUserInfo.username"></vs-input>

    <vs-input class="w-full my-base" label-placeholder="留言/备注" v-model="activeUserInfo.remark"></vs-input>

    <!-- Save & Reset Button -->
    <div class="flex flex-wrap items-center justify-end">
      <vs-button class="ml-auto mt-2">保存</vs-button>
      <vs-button class="ml-4 mt-2" type="border" color="warning">更改</vs-button>
    </div>
  </vx-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    activeUserInfo() {
      return JSON.parse(localStorage.getItem("userInfo"));
    }
  }
};
</script>
