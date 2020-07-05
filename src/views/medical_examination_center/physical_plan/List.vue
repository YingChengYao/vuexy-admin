<template>
  <div class="data-list-container">
    <vs-popup fullscreen :title="title" :active.sync="popupActive">
      <exclusive-package-edit
        @closePop="closePop"
        @loadData="loadData"
        :planId="planId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <div class="vx-card p-6">
      <vs-table ref="table" stripe :data="plans">
        <!-- <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          </div>
        </div> -->

        <template slot="thead">
          <vs-th>编号</vs-th>
          <vs-th>计划名称</vs-th>
          <vs-th>单位</vs-th>
          <vs-th>状态</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>是否锁定</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>创建时间</vs-th>
          <vs-th>操作</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p>{{ indextr+1 }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PlanName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.CompanyName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.StatusName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Sort }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.IsLocked?'是':'否' }}</p>
              </vs-td>
              <vs-td>
                <p class="product-category">{{ tr.ModifyName}}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.ModifyTime | formatDate }}</p>
              </vs-td>
              <vs-td class="whitespace-no-wrap">
                <span
                  class="text-primary"
                  size="small"
                  type="border"
                  @click.stop="addPackage(tr.ID)"
                >配置套餐</span>
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
    </div>
    <div class="con-pagination-table vs-table--pagination">
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

    <!-- <div class="vx-card p-6" style="position: fixed;bottom: 0;width: calc(100% - 4.4rem - 260px);z-index: 9919;">
       
    </div>-->
  </div>
</template>

<script>
import ExclusivePackageEdit from "views/medical_examination_center/exclusive_package/Edit";

import { getPlansForPhysical } from "@/http/plan.js";
export default {
  components: {
    ExclusivePackageEdit
  },
  data() {
    return {
      plans: [],

      isLockedSelectOptions: [
        {
          name: "请选择",
          value: null
        },
        {
          name: "否",
          value: false
        },
        {
          name: "是",
          value: true
        }
      ],

      //filter
      typeNameInput: "",
      isLockedSelect: false,

      //Page
      itemsPerPage: 4,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [4, 10, 15, 20],
      totalItems: 0,

       // Pop
      title: null,
      popupActive: false,
      planId: null,
      timer: "",
      mark: null,
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        mecID: "6705580839278485504" //userInfo.mecID,
      };

      getPlansForPhysical(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("计划列表：", data);
          this.plans = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    addNewData() {
      this.sidebarData = {
        title: "添加套餐分类",
        mark: "add"
      };
      this.toggleDataSidebar(true);
    },
    addPackage(id) {
      // this.$router.push(`/deploy_project/${data}`).catch(() => {});
      this.planId = id;
      this.popupActive = true;
      this.title = "配置专属套餐";
      this.mark = "addPackage";
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.currentPage = 1;
      this.loadData();
    }
  },
  created(){
    this.loadData();
  },
  mounted() {
  },
  watch: {
    currentPage() {
      this.loadData();
    }
  }
};
</script>

<style lang="scss">
</style>
