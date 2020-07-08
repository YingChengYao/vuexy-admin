<template>
  <div class="data-list-container">
    <div class="vx-row">
      <div class="vx-col w-full md:w-2/5 lg:w-2/5 rounded-lg">
        <vx-card>
          <vs-table
            ref="table"
            stripe
            :data="packages"
            v-model="selected"
            @selected="handleSelected"
          >
            <div
              slot="header"
              class="flex flex-wrap-reverse items-center flex-grow justify-between"
              v-if="mark=='addPackage'"
            >
              <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
                <vs-button color="primary" type="border" class="mb-4 mr-4" @click="loadData">刷新</vs-button>
                <vs-button
                  color="primary"
                  type="border"
                  class="mb-4 mr-4"
                  @click="addPackageData"
                >添加</vs-button>
                <vs-button
                  color="primary"
                  type="border"
                  class="mb-4 mr-4"
                  @click="editPackageData"
                >修改</vs-button>
              </div>
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
        </vx-card>
      </div>
      <div class="vx-col w-full md:w-3/5 lg:w-3/5 mt-12 md:mt-0">
        <vx-card>
          <div slot="no-body" class="tabs-container px-6 pt-6">
            <div class="tab-text">
              <vs-row vs-align="center">
                <label class="vx-col label-name px-2">项目明细</label>
              </vs-row>
              <div class="p-6">
                <vs-table :data="initProjects" stripe>
                  <template slot="thead">
                    <vs-th>编号</vs-th>
                    <vs-th style="width:20rem;">项目名称</vs-th>
                    <vs-th>项目价格</vs-th>
                    <vs-th>婚姻状态</vs-th>
                    <vs-th>性别</vs-th>
                    <vs-th>排序</vs-th>
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
                          <vs-td style="width:20rem;display: block;" class="wrap">
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
                      </vs-tr>
                    </tbody>
                  </template>
                </vs-table>

                <div class="flex" v-if="packageId">
                  <div
                    class="mt-5"
                  >合计：共{{totalProjects}}条，总价：{{packagePrice}}，折扣价：{{discount}}，优惠价：{{discountPrice}}</div>
                  <vs-pagination
                    style="flex:1"
                    :total="totalProjectPage"
                    v-model="currentProjectPage"
                    :pagedown="true"
                    :totalItems="totalProjects"
                    @changePageMaxItems="changeProjectPageMaxItems"
                    :pagedownItems="descriptionProjects"
                    :size="projectsPerPage"
                    class="the-footer flex-wrap justify-between"
                  ></vs-pagination>
                </div>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
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
    },
    mark: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      //套餐Page
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,
      packageId: null,
      packages: [],
      selected: [],

      //项目Page
      projects: [],
      initProjects: [],
      projectsPerPage: 10,
      currentProjectPage: 1,
      totalProjectPage: 0,
      descriptionProjects: [10, 20, 50, 100],
      totalProjects: 0,
      discount: 0,
      packagePrice: 0,
      discountPrice: 0
    };
  },
  computed: {},
  methods: {
    loadData() {
      if (!this.planId) return;
      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        planId: this.planId
      };
      getExclusivePackages(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.packages = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    loadExclusivePackageProject(packageId) {
      let id = packageId ? packageId : this.packageId;
      let para = {
        packageId: id,
        pageIndex: this.currentProjectPage,
        pageSize: this.projectsPerPage
      };

      getExclusivePackageProject(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          let item = data.Item;
          this.projects = item.Items;
          this.totalProjectPage = item.TotalPages;
          this.totalProjects = item.TotalItems;
          this.discount = data.Discount;
          this.packagePrice = data.PackagePrice;
          this.discountPrice = data.DiscountPrice;
          this.initProjectsData(this.projects, 0, null);
        }
      });
    },

    //#region 套餐
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.currentPage = 1;
      this.loadData();
    },
    handleSelected(tr) {
      this.packageId = tr.ID;
      this.loadExclusivePackageProject(tr.ID);
    },
    openPackageEditPop(data, mark) {
      this.$emit("openPackageEditPop", data, mark);
    },
    addPackageData() {
      this.openPackageEditPop("", "add");
    },
    editPackageData() {
      if (this.selected.length <= 0) {
        this.$vs.notify({
          title: "Error",
          text: "请选择专属套餐！",
          color: "danger"
        });
      } else {
        this.openPackageEditPop(this.selected, "edit");
      }
    },
    //#endregion

    //#region 项目
    getMarriageColor(status) {
      if (status === 1) return "primary";
      if (status === 2) return "success";
      if (status === 3) return "danger";
      if (status === 4) return "warning";
      return "primary";
    },
    getGenderColor(status) {
      if (status === 0) return "primary";
      if (status === 1) return "success";
      return "primary";
    },
    changeProjectPageMaxItems() {
      this.projectsPerPage = this.descriptionProjects[index];
      this.currentProjectPage = 1;
      this.loadData();
    },
    initProjectsData(items, level, parent) {
      this.initProjects = [];
      this.initProjectData(items, level, parent);
      console.log("initProjects:", this.initProjects);
    },
    initProjectData(items, level, parent) {
      if (!items) {
        return;
      }
      items.map((item, index) => {
        item = Object.assign({}, item, {
          parent: parent,
          level: level
        });
        if (item.Children != undefined && item.Children.length > 0) {
          item = Object.assign({}, item, {
            isExpand: true
          });
        }
        if (typeof item.isShow == "undefined") {
          item = Object.assign({}, item, {
            isShow: true
          });
        }

        this.initProjects.push(item);

        if (item.Children) {
          this.initProjectData(item.Children, level + 1, item.ID);
        }
      });
    },
    toggle(m) {
      if (m.Children) {
        this.initProjects.forEach(i => {
          if (i.parent == m.ID) {
            i.isShow = !i.isShow;
          }
        });
        m.isExpand = !m.isExpand;
      }
    }
    //#endregion
  },
  created() {
    this.loadData();
  },
  mounted() {},
  watch: {
    currentPage() {
      this.loadData();
    },
    currentProjectPage() {
      this.loadExclusivePackageProject();
    }
  }
};
</script>

<style lang="scss">
</style>
