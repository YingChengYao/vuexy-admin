<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full md:w-2/5 lg:w-1/5">
        <vx-card>
          <div>已选体检中心列表</div>
          <ul class="faq-topics mt-4 mb-5" v-if="medicalCenters.length>0">
            <li
              v-for="(item,index) in medicalCenters"
              :key="index"
              class="p-2 font-medium flex items-center"
              style="border-bottom: 1px solid rgba(0,0,0,.08)"
              @click="loadPlanPackages(item.ID)"
              v-clickDown="index"
            >
              <span
                class="cursor-pointer"
                :class="{'text-primary':medicalCenterSelected==item.ID}"
              >{{ item.MecName }}</span>
            </li>
          </ul>
          <div v-else class="p-2 mt-4 mb-5">暂无数据</div>
        </vx-card>
      </div>
      <div class="vx-col w-full md:w-2/5 lg:w-1/5">
        <vx-card>
          <div>专属套餐</div>
          <ul class="faq-topics mt-4 mb-5" v-if="packages.length>0">
            <li
              v-for="(item,index) in packages"
              :key="index"
              class="p-2 font-medium flex items-center"
              style="border-bottom: 1px solid rgba(0,0,0,.08)"
              @click="loadProjects(item.ID)"
              v-clickDown="index"
            >
              <span
                class="cursor-pointer"
                :class="{'text-primary':packageSelected==item.ID}"
              >{{ item.PackageName }}</span>
            </li>
          </ul>
          <div v-else class="p-2 mt-4 mb-5">暂无数据</div>
        </vx-card>
      </div>
      <div class="vx-col w-full md:w-3/5 lg:w-3/5">
        <vx-card title="项目明细">
          <qr-table ref="table" :items="projects" :cloumns="cloumns"></qr-table>

          <div class="flex">
            <div
              class="mt-5"
            >合计：共{{totalItems}}条，总价：{{packagePrice}}，折扣价：{{discount}}，优惠价：{{discountPrice}}</div>
            <vs-pagination
              :total="totalPage"
              v-model="currentPage"
              :pagedown="true"
              :totalItems="totalItems"
              @changePageMaxItems="changePageMaxItems"
              :pagedownItems="descriptionItems"
              :size="itemsPerPage"
            ></vs-pagination>
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPlanDetail,
  getPlanPhysicals,
  getPlanPackages,
  getProjectsForPlan,
} from "@/http/plan.js";
import { formatTimeToStr } from "@/common/utils/data/date";
import infoList from "@/components/mixins/infoList";
export default {
  name: "",
  mixins: [infoList],
  props: {
    planID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      medicalCenters: [],
      packages: [],

      projects: [],
      listApi: getProjectsForPlan,
      cloumns: [
        { headerName: "项目名称", field: "ItemName", expand: true },
        { headerName: "项目价格", field: "ItemPrice" },
        {
          headerName: "婚姻状态",
          field: "MarriageName",
        },
        { headerName: "性别", field: "GenderName" },
      ],
      totalProjects: 0,
      packagePrice: 0,
      discount: 0,
      discountPrice: 0,

      medicalCenterSelected: "",
      packageSelected: "",
    };
  },
  components: {},
  created() {},
  mounted() {
    this.loadPlanPhysicals();
  },
  directives: {
    clickDown: {
      inserted(el, binding, index) {
        if (binding.value === 0) {
          el.click();
        }
      },
    },
  },
  methods: {
    loadData() {
      this.loadPlanPhysicals();
    },
    loadPlanPhysicals() {
      let para = {
        planID: this.planID,
      };
      getPlanPhysicals(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log(data);
          this.medicalCenters = data.Items;
        }
      });
    },
    loadPlanPackages(mecId) {
      this.medicalCenterSelected = mecId;
      let para = {
        planId: this.planID,
        mecId: mecId,
      };
      getPlanPackages(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log(data);
          this.packages = data.Items;
        }
      });
    },
    async getTableData(
      pageIndex = this.currentPage,
      pageSize = this.itemsPerPage
    ) {
      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        ...this.searchInfo,
      };
      getProjectsForPlan(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          if (!data.Item.Items > 0) {
            this.projects = [];
            return;
          }
          this.discount = data.Discount;
          this.discountPrice = data.DiscountPrice;
          this.packagePrice = data.PackagePrice;
          this.totalItems = data.Item.TotalItems;
          this.initProjectsData(data.Item.Items, 0, null);
        }
      });
    },
    loadProjects(packageId) {
      this.packageSelected = packageId;
      let para = {
        packageId: packageId,
      };
      this.searchInfo.packageId = packageId;
      this.getTableData();
    },
    initProjectsData(items, level, parent) {
      this.projects = [];
      this.initProjectData(items, level, parent);
      console.log("projects:", this.projects);
    },
    initProjectData(items, level, parent) {
      if (!items) {
        return;
      }
      items.map((item, index) => {
        item = Object.assign({}, item, {
          parent: parent,
          level: level,
        });
        if (item.Children != undefined && item.Children.length > 0) {
          item = Object.assign({}, item, {
            isExpand: true,
            hasChildren: true,
          });
        }
        if (typeof item.isShow == "undefined") {
          item = Object.assign({}, item, {
            isShow: true,
          });
        }
        if (item.TypeName) {
          item = Object.assign({}, item, {
            ItemName: item.TypeName,
          });
        }

        this.projects.push(item);

        if (item.Children) {
          this.initProjectData(item.Children, level + 1, item.ID);
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
