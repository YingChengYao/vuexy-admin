<template>
  <div>
    <vx-card>
      <div>已选项目</div>
      <ul class="faq-topics mt-4">
        <li
          v-for="project in peojectList"
          :key="project.id"
          class="p-2 font-medium flex items-center"
        >
          <div class="h-3 w-3 rounded-full mr-2"></div>
          <span class="cursor-pointer">{{ project.name }}</span>
        </li>
      </ul>
    </vx-card>
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    packageId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      peojectList: []
    };
  },
  components: {},
  created() {
    this.loadData();
  },
  mounted() {},
  methods: {
    loadData() {
      this.peojectList = [
        { id: 9028739748891713536, name: "眼科常规+眼压" },
        { id: 9029037703657938944, name: "耳鼻喉科" }
      ];

      this.$store.commit(
        "saveSelectedProject",
        JSON.stringify(this.peojectList)
      );
    }
  }
};
</script>
<style scoped>
</style>
