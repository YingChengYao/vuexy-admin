<template>
  <div>
    <div>已选项目</div>
    <ul class="faq-topics mt-4" v-if="data">
      <li
        v-for="project in data"
        :key="project.id"
        class="p-2 font-medium flex items-center"
      >
        <div class="h-3 w-3 rounded-full mr-2"></div>
        <span class="cursor-pointer">11{{ project.name }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    data: {
      type: Object,
      default: () => {}
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
      this.data = this.peojectList;
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
