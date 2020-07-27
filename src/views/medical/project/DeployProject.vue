<template>
  <div>
    dslk
    <div class="vx-row">
      <div class="vx-col w-full md:w-2/5 lg:w-1/5 rounded-lg">
      1
        <project-show />
      </div>

      <div class="vx-col w-full md:w-3/5 lg:w-4/5 mt-12 md:mt-0">
        <project-list :packageId="packageId" :isComponent="true" :multipleCheck="true">
          <template slot="paginationright">
            <div class="pl-2 flex align-center">
              <div
                class="flex flex-wrap items-center deployProjectForPackage-center justify-end vs-pagination--mb"
                style="width:13rem"
              >
                <vs-button @click="save" class="mr-2">保存</vs-button>
                <vs-button type="border" color="warning" @click="cancel">取消</vs-button>
              </div>
            </div>
          </template>
        </project-list>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectList from "./List";
import ProjectShow from "views/medical/project/Show";

export default {
  name: "",
  data() {
    return {
      packageId: null,
    };
  },
  components: {
    ProjectList,
    ProjectShow,
  },
  created() {
    this.packageId = this.$route.params.id;
  },
  mounted() {},
  methods: {
    save() {
      let projectIds = this.checkedGroup
        .map((obj) => {
          return obj.ItemID;
        })
        .join(",");

      let para = {
        packageID: this.packageId,
        itemIDs: projectIds,
        discount: this.discount / 10,
        discountPrice: this.discountPrice,
      };
      deployProjectForPackage(para).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "Success",
            text: res.message,
            color: "success",
          });
          this.cancel();
        }
      });
    },
    cancel() {},
  },
};
</script>
<style lang='sass' scoped>
</style>
