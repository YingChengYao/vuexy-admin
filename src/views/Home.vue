<template>
  <h4>You are in home.</h4>
</template>

<script>
import { getName } from "@/http/api.js";
export default {
  name: "",
  data() {
    return {};
  },
  components: {},
  created() {
    this.djMock();
  },
  mounted() {},
  methods: {
    djMock() {
      getName().then(res => {
        console.log(res);
      });
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
