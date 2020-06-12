<template>
  <vx-card no-shadow>
    <!-- Img Row -->
    <div class="flex flex-wrap items-center mb-base">
      <vs-avatar :src="activeUserInfo.photoURL" size="70px" class="mr-4 mb-4"></vs-avatar>
      <vs-upload
        style="display:diaplsy;"
        action="https://jsonplaceholder.typicode.com/posts/"
        limit="1"
        :show-upload-button="false"
      />
      <div>
        <vs-button class="mr-4 sm:mb-0 mb-2" for="fileElem" @click="upload()">上传头像</vs-button>
        <vs-button type="border" color="danger">移除</vs-button>
        <p class="text-sm mt-2">允许使用JPG，GIF或PNG。最大大小为800kB</p>
      </div>
    </div>

    <!-- Info -->
    <vs-input class="w-full mb-base" label-placeholder="昵称" v-model="activeUserInfo.username"></vs-input>

    <vs-input class="w-full my-base" label-placeholder="留言/备注" v-model="activeUserInfo.remark"></vs-input>

    <!-- Save & Reset Button -->
    <div class="flex flex-wrap items-center justify-end">
      <vs-button class="ml-auto mt-2">更改</vs-button>
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
    },
  },
  methods: {
    upload() {
      //this.$refs.fileInput.click()
    },
    choiceImg() {
      this.$refs.fileInput.click();
    },
    getFile() {
      console.log("成功");
    }
  }
};
</script>
