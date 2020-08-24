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
            >
              <span class="cursor-pointer">{{ item.MecName }}</span>
              <!-- <span
                class="text-primary px-4 cursor-pointer"
                size="small"
                type="border"
                @click="delProject(tr)"
              >删除</span>-->
            </li>
          </ul>
          <div v-else class="mb-5">No Data</div>
        </vx-card>
      </div>
      <div class="vx-col w-full md:w-2/5 lg:w-1/5">
        <vx-card>
          <div>专属套餐</div>
          <ul class="faq-topics mt-4 mb-5" v-if="medicalCenters.length>0">
            <li
              v-for="(item,index) in medicalCenters"
              :key="index"
              class="p-2 font-medium flex items-center"
              style="border-bottom: 1px solid rgba(0,0,0,.08)"
            >
              <span class="cursor-pointer">{{ item.MecName }}</span>
              <!-- <span
                class="text-primary px-4 cursor-pointer"
                size="small"
                type="border"
                @click="delProject(tr)"
              >删除</span>-->
            </li>
          </ul>
          <div v-else class="mb-5">No Data</div>
        </vx-card>
      </div>
      <div class="vx-col w-full md:w-3/5 lg:w-3/5">
        <vx-card title="体检中心信息">
          <vx-table ref="table" :items="medicalCenters" @loadData="loadData" :pagination="false">
            <template slot="thead-header">
              <vs-th>体检中心名称</vs-th>
              <vs-th>体检中心编号</vs-th>
              <vs-th>联系人</vs-th>
              <vs-th>手机号</vs-th>
              <vs-th>电话</vs-th>
            </template>
            <template slot="thead-content" slot-scope="item">
              <vs-td>
                <p>{{ item.tr.MecName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ item.tr.MecCode }}</p>
              </vs-td>
              <vs-td>
                <p>{{ item.tr.Contact }}</p>
              </vs-td>
              <vs-td>
                <p>{{ item.tr.Mobile }}</p>
              </vs-td>
              <vs-td>
                <p>{{ item.tr.Tel }}</p>
              </vs-td>
            </template>
          </vx-table>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlanDetail } from "@/http/plan.js";
import { formatTimeToStr } from "@/common/utils/data/date";
export default {
  name: "",
  props: {
    planID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      data_local: {},

      medicalCenters: [],
      clickNotClose: true,
      isChatSidebarActive: true,
    };
  },
  components: {},
  created() {},
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      let para = {
        planID: this.planID,
      };
      getPlanDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data.Model;
          console.log("计划详情：", data);
          this.data_local.StartTime = formatTimeToStr(
            this.data_local.StartTime,
            "yyyy-MM-dd"
          );
          this.data_local.EndTime = formatTimeToStr(
            this.data_local.EndTime,
            "yyyy-MM-dd"
          );

          this.medicalCenters = data.Physical;
          this.employees = data.Employee;
          this.standards = data.PlanStandard;
        }
      });
    },
  },
};
</script>
<style lang='sass' scoped>
</style>
