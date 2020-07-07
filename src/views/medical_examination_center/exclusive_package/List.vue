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
    <div class="vx-row">
      <div class="vx-col w-full md:w-2/5 lg:w-1/3 rounded-lg">
        <vx-card>
          <vs-table ref="table" stripe :data="packages" @selected="handleSelected">
            <div
              slot="header"
              class="flex flex-wrap-reverse items-center flex-grow justify-between"
            >
              <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
                <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addPackage">添加</vs-button>
              </div>
              <!-- <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
                <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">修改</vs-button>
              </div>
              <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
                <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">删除</vs-button>
              </div>-->
            </div>

            <template slot="thead">
              <vs-th>编号</vs-th>
              <vs-th>套餐名称</vs-th>
              <vs-th>价格</vs-th>
              <vs-th>是否锁定</vs-th>
            </template>

            <template slot-scope="{data}">
              <tbody>
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    <p>{{ indextr+1 }}</p>
                  </vs-td>
                  <vs-td>
                    <p>{{ tr.PackageName }}</p>
                  </vs-td>
                  <vs-td>
                    <p>{{ tr.PackagePrice }}</p>
                  </vs-td>
                  <vs-td>
                    <p>{{ tr.IsLocked?'是':'否' }}</p>
                  </vs-td>
                </vs-tr>
              </tbody>
            </template>
          </vs-table>
        </vx-card>
        <vs-pagination
          :total="totalPage"
          v-model="currentPage"
          :pagedown="true"
          :totalItems="totalItems"
          @changePageMaxItems="changePageMaxItems"
          :pagedownItems="descriptionItems"
          :size="itemsPerPage"
          class="the-footer flex-wrap justify-between"
        ></vs-pagination>
      </div>

      <div class="vx-col w-full md:w-3/5 lg:w-2/3 mt-12 md:mt-0">
        <vx-card>
          <div slot="no-body" class="tabs-container px-6 pt-6">
            <div class="tab-text">
              <vs-row vs-align="center">
                <label class="vx-col label-name px-2">项目明细</label>
              </vs-row>
              <div class="p-6">
                <vs-table ref="table" :data="initItems" stripe>
                  <template slot="thead">
                    <vs-th>编号</vs-th>
                    <vs-th style="width:10rem;">项目名称</vs-th>
                    <vs-th>项目价格</vs-th>
                    <vs-th>婚姻状态</vs-th>
                    <vs-th>性别</vs-th>
                    <vs-th>排序</vs-th>
                    <vs-th>是否锁定</vs-th>
                    <vs-th>修改人</vs-th>
                    <vs-th>修改时间</vs-th>
                  </template>

                  <template slot-scope="{data}">
                    <tbody>
                      <vs-tr
                        :data="tr"
                        :key="indextr"
                        v-for="(tr, indextr) in data"
                        v-show="tr.isShow"
                      >
                        <vs-td>
                          <p>{{ indextr+1 }}</p>
                        </vs-td>
                        <vx-tooltip :text="tr.Children?tr.TypeName:tr.ItemName">
                          <vs-td style="width:10rem;display: block;" class="wrap">
                            <span :style="'margin-left:'+ (tr.level)*20 +'px'">
                              <span @click.stop="toggle(tr)" v-if="tr.Children">
                                <vs-icon
                                  :icon-pack="tr.isExpand?'iconfont icon-shangxiazuoyouTriangle11':'iconfont icon-shangxiazuoyouTriangle12'"
                                ></vs-icon>
                              </span>
                              {{tr.Children?tr.TypeName:tr.ItemName}}
                            </span>
                          </vs-td>
                        </vx-tooltip>

                        <vs-td>
                          <p v-if="!tr.Children">{{ tr.ItemPrice }}</p>
                        </vs-td>
                        <vs-td>
                          <vs-chip
                            transparent
                            :color="getMarriageColor(tr.Marriage)"
                            v-if="!tr.Children"
                          >{{ tr.MarriageName}}</vs-chip>
                        </vs-td>
                        <vs-td>
                          <vs-chip
                            transparent
                            :color="getGenderColor(tr.Gender)"
                            v-if="!tr.Children"
                          >{{ tr.GenderName}}</vs-chip>
                        </vs-td>
                        <vs-td>
                          <p v-if="!tr.Children">{{tr.Sort }}</p>
                        </vs-td>
                        <vs-td>
                          <p v-if="!tr.Children">{{ tr.IsLocked?'是':'否' }}</p>
                        </vs-td>
                        <vs-td>
                          <p v-if="!tr.Children">{{ tr.ModifyName }}</p>
                        </vs-td>
                        <vs-td>
                          <p v-if="!tr.Children">{{ tr.ModifyTime | formatDate }}</p>
                        </vs-td>
                      </vs-tr>
                    </tbody>
                  </template>
                </vs-table>

                <div class="flex">
                  <span class="mt-5">
                    <!-- <span>
                      <vs-button class="vx-col" color="primary" type="border" @click="save">保存</vs-button>
                    </span>
                    <span class="px-2">
                      <vs-button class="vx-col" color="primary" type="border" @click="cancel">取消</vs-button>
                    </span>-->
                  </span>
                  <!-- <vs-pagination
                    style="flex:1"
                    :total="totalPage"
                    v-model="currentPage"
                    :pagedown="true"
                    :totalItems="totalItems"
                    @changePageMaxItems="changePageMaxItems"
                    :pagedownItems="descriptionItems"
                    :size="itemsPerPage"
                    class="the-footer flex-wrap justify-between"
                  ></vs-pagination>-->
                </div>
              </div>
            </div>
          </div>
        </vx-card>
      </div>

      <!-- <div class="con-pagination-table vs-table--pagination">
        <vs-pagination
          :total="totalPage"
          v-model="currentPage"
          :pagedown="true"
          :totalItems="totalItems"
          @changePageMaxItems="changePageMaxItems"
          :pagedownItems="descriptionItems"
          :size="itemsPerPage"
        ></vs-pagination>
      </div>-->
    </div>

    <!-- <div class="vx-card p-6" style="position: fixed;bottom: 0;width: calc(100% - 4.4rem - 260px);z-index: 9919;">
       
    </div>-->
  </div>
</template>

<script>
import ExclusivePackageEdit from "views/medical_examination_center/exclusive_package/Edit";

import {
  getPlansForPhysical,
  getExclusivePackages,
  getExclusivePackageProject
} from "@/http/plan.js";
export default {
  components: {
    ExclusivePackageEdit
  },
  props: {
    planId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      plans: [],
      packages: [],
      initItems: [],
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
      //   planId: null,
      timer: "",
      mark: null
    };
  },
  computed: {},
  methods: {
    // loadData() {
    //   let para = {
    //     pageIndex: this.currentPage,
    //     pageSize: this.itemsPerPage
    //   };

    //   getPlansForPhysical(para).then(res => {
    //     if (res.resultType == 0) {
    //       const data = JSON.parse(res.message);
    //       console.log("计划列表：", data);
    //       this.plans = data.Items;
    //       this.totalPage = data.TotalPages;
    //       this.totalItems = data.TotalItems;
    //     }
    //   });
    // },
    loadData() {
      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        planId: this.planId
      };
      getExclusivePackages(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("专属套餐列表：", data);
          this.packages = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    loadExclusivePackageProject(packageId) {
      let para = {
        packageId: packageId
      };
      getExclusivePackageProject(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("专属套餐项目列表：", data);
          this.projects = data.Items;
        }
      });
    },
    addPackage() {
      this.planId = this.planId;
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
    },
    //#region
    handleSelected(tr) {
      this.loadExclusivePackageProject(tr.ID);
    },
    //#endregion
    toggle: function(m) {
      if (m.Children) {
        this.initItems.forEach(i => {
          if (i.parent == m.ID) {
            i.isShow = !i.isShow;
          }
        });
        m.isExpand = !m.isExpand;
      }
    }
  },
  created() {
    //this.loadData();
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
