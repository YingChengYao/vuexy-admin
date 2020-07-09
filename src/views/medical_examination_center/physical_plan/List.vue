<template>
  <div class="data-list-container">
    <vs-popup fullscreen :title="title" :active.sync="popupActive">
      <exclusive-package-list
        @closePop="closePop"
        @loadData="loadData"
        @openPackageEditPop="openPackageEditPop"
        :planId="planId"
        :key="timer"
        :mark="mark"
      />
      <vs-popup fullscreen :title="titlePackageEdit" :active.sync="popupActivePackageEdit">
        <exclusive-package-edit
          ref="packageEdit"
          @closePackageEditPop="closePackageEditPop"
          @loadData="loadData"
          :packageId="packageId"
          :key="timer"
          :markPackageEdit="markPackageEdit"
        />
      </vs-popup>
    </vs-popup>

    <vx-card title="体检计划列表" class="p-6" refresh-content-action @refresh="refreshData">
      <vs-table ref="table" stripe :data="plans">
        <!-- <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          </div>
        </div>-->

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
                  class="text-primary px-2"
                  size="small"
                  type="border"
                  @click.stop="addPackage(tr)"
                >配置套餐</span>
                <span
                  class="text-primary"
                  size="small"
                  type="border"
                  @click.stop="lookPackage(tr.ID)"
                >查看套餐</span>
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
    </vx-card>
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
import ExclusivePackageList from "views/medical_examination_center/exclusive_package/List";

import { getPlansForPhysical } from "@/http/plan.js";
export default {
  components: {
    ExclusivePackageEdit,
    ExclusivePackageList
  },
  data() {
    return {
      //Page
      plans: [],
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,

      // Pop
      title: null,
      popupActive: false,
      planId: null,
      timer: "",
      mark: null,
      popupActivePackageEdit: false,
      titlePackageEdit: null,
      markPackageEdit: null,
      packageId: null
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage
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
    refreshData(card) {
      this.loadData();
      card.removeRefreshAnimation(1000);
    },
    //#region 弹窗
    addPackage(data) {
      this.planId = data.ID;
      this.popupActive = true;
      this.title = "配置专属套餐";
      this.mark = "addPackage";
      this.handleLoad();
      // this.$refs.packageEdit.loadStandard();
    },
    lookPackage(id) {
      this.planId = id;
      this.popupActive = true;
      this.title = "查看专属套餐";
      this.mark = "lookPackage";
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },

    //套餐
    //控制套餐弹窗
    openPackageEditPop(data, mark) {
      if (mark == "add") {
        this.titlePackageEdit = "添加专属套餐信息";
        this.markPackageEdit = "add";
        this.$refs.packageEdit.initPackageData();
        this.$refs.packageEdit.loadStandard(this.planId);
      } else if (mark == "edit") {
        this.packageId = data;
        this.markPackageEdit = "edit";
        this.titlePackageEdit = "修改专属套餐信息";
        this.$refs.packageEdit.initPackageData();
        this.$refs.packageEdit.loadPackageData(this.packageId);
        this.$refs.packageEdit.loadStandard(this.planId);
      }
      this.popupActivePackageEdit = true;
    },
    closePackageEditPop() {
      this.popupActivePackageEdit = false;
    },
    //#endregion
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.currentPage = 1;
      this.loadData();
    }
  },
  created() {
    this.loadData();
  },
  mounted() {},
  watch: {
    currentPage() {
      this.loadData();
    }
  }
};
</script>

<style lang="scss">
</style>
