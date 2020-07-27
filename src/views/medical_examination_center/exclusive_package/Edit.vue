<template>
  <div>
    <vx-card title="基本信息">
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mt-4"
            label="套餐名称"
            v-model="data_local.PackageName"
            v-validate="'required'"
            name="套餐名称"
          />
          <span class="text-danger text-sm" v-show="errors.has('套餐名称')">{{ errors.first('套餐名称') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full">
          <div class="mt-4">
            <vs-select label="婚姻状况" v-model="data_local.Marriage" class="w-full select-large">
              <vs-select-item
                v-for="(item,index) in marriageOptions"
                :key="index"
                :value="item.Value"
                :text="item.Name"
                class="w-full"
              />
            </vs-select>
          </div>
        </div>

        <div class="vx-col md:w-1/2 w-full">
          <vs-input class="w-full mt-4" label="备注" v-model="data_local.Remark" name="备注" />
        </div>
        <div class="vx-col md:w-1/2 w-full">
          <div class="mt-4">
            <vs-select label="性别" v-model="data_local.Gender" class="w-full select-large">
              <vs-select-item
                v-for="(item,index) in genderOptions"
                :key="index"
                :value="item.Value"
                :text="item.Name"
                class="w-full"
              />
            </vs-select>
          </div>
        </div>

        <div class="vx-col md:w-1/2 w-full">
          <div class="mt-4">
            <label class="vs-input--label">标识</label>
            <v-select
              multiple
              :closeOnSelect="false"
              v-model="data_local.PackageTypes"
              label="Name"
              :options="packageTypeOptions"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
          </div>
        </div>
        <div class="vx-col md:w-1/2 w-full">
          <div class="mt-4">
            <vs-select label="标准" v-model="data_local.Standard" class="w-full select-large">
              <vs-select-item
                v-for="(item,index) in standardOptions"
                :key="index"
                :value="item.Value"
                :text="item.Name"
                class="w-full"
              />
            </vs-select>
          </div>
        </div>
      </div>
    </vx-card>

    <vx-card title="配置项目" class="mt-6">
      <div class="vx-row">
        <div class="vx-col w-full md:w-2/5 lg:w-1/5 rounded-lg">
          <vx-card>
            <div>已选项目</div>
            <ul class="faq-topics mt-4 mb-5" v-if="checkedGroup.length>0">
              <li
                v-for="tr in checkedGroup"
                :key="tr.ItemID"
                class="p-2 font-medium flex items-center"
              >
                <div class="h-3 w-3 rounded-full mr-2"></div>
                <span class="cursor-pointer">{{ tr.ItemName }}</span>
                <span
                  class="text-primary px-4 cursor-pointer"
                  size="small"
                  type="border"
                  @click="cancelProjectBox(tr.ItemID)"
                >删除</span>
              </li>
            </ul>
            <div v-else class="mb-5">No Data</div>
            <vs-row class="mb-6" vs-align="center">
              <vs-col class="sm:w-1/6">
                <span>合计</span>
              </vs-col>
              <vs-col class="sm:w-2/3">
                <vs-input disabled class="w-full" v-model="packagePrice" />
              </vs-col>
            </vs-row>
            <vs-row class="mb-6" vs-align="center">
              <vs-col class="sm:w-1/6">
                <span>折扣</span>
              </vs-col>
              <vs-col class="sm:w-2/3">
                <vs-input-number
                  v-model="discount"
                  :step="1"
                  min="0"
                  max="10"
                  class="inline-flex"
                  @input="changeDiscount($event)"
                  v-validate="'between:0,10|decimal:1'"
                  name="折扣"
                />
                <span class="text-danger text-sm" v-show="errors.has('折扣')">{{ errors.first('折扣') }}</span>
              </vs-col>
            </vs-row>
            <vs-row class="mb-6" vs-align="center">
              <vs-col class="sm:w-1/6">
                <span>折扣价</span>
              </vs-col>
              <vs-col class="sm:w-2/3 px-2">
                <vs-input
                  class="w-full"
                  v-model="discountPrice"
                  v-validate="'required|decimal:2'"
                  name="折扣价"
                  @input="changeDiscountPrice($event)"
                />
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('折扣价')"
                >{{ errors.first('折扣价') }}</span>
              </vs-col>
            </vs-row>
          </vx-card>
        </div>

        <div class="vx-col w-full md:w-3/5 lg:w-4/5 mt-12 md:mt-0">
          <vx-card>
            <div slot="no-body" class="tabs-container px-6 pt-6">
              <div class="tab-text">
                <!-- <vx-card ref="filterCard" title class="user-list-filters mb-8"> -->
                <vs-row vs-align="center">
                  <label class="vx-col label-name px-2">项目名称</label>
                  <vs-input
                    placeholder="Placeholder"
                    v-model="itemNameInput"
                    class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
                  />
                  <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
                </vs-row>
                <!-- </vx-card> -->
                <div class="p-6">
                  <vs-table ref="table" :data="initItems" stripe>
                    <template slot="thead">
                      <vs-th>
                        <vs-checkbox
                          :checked="isCheckedAll"
                          @change="handleCheckAll()"
                          size="small"
                        />
                      </vs-th>
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
                            <vs-checkbox
                              :checked="tr.isChecked"
                              @change="handleCheckbox(tr)"
                              v-show="!tr.Children"
                              size="small"
                            />
                          </vs-td>
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
                              :color="tr.Marriage | getMarriageColor"
                              v-if="!tr.Children"
                            >{{ tr.MarriageName}}</vs-chip>
                          </vs-td>
                          <vs-td>
                            <vs-chip
                              transparent
                              :color="tr.Gender | getGenderColor"
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
                      <span>
                        <vs-button class="vx-col" color="primary" type="border" @click="save">保存</vs-button>
                      </span>
                      <span class="px-2">
                        <vs-button class="vx-col" color="primary" type="border" @click="cancel">取消</vs-button>
                      </span>
                    </span>
                    <vs-pagination
                      style="flex:1"
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
                </div>
              </div>
            </div>
          </vx-card>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from "vue-select";

import {
  getPackageTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource,
  getStandardForPlanDataSource
} from "@/http/data_source.js";
import { getItems } from "@/http/package.js";
import {
  addExclusivePackage,
  editExclusivePackage,
  getExclusivePackageDetail
} from "@/http/plan.js";
import {
  accAdd,
  accSubtr,
  accMul,
  accDivCoupon
} from "@/common/utils/data/calc";

export default {
  name: "",
  components: {
    vSelect
  },
  props: {
    packageId: {
      type: String,
      default: null
    },
    planId: {
      type: String,
      default: null
    },
    mark: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      data_local: {},
      marriageOptions: [],
      genderOptions: [],
      packageTypeOptions: [],
      standardOptions: [],

      //filter
      itemNameInput: "",

      //ProjectPage
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,
      items: [],
      initItems: [],
      isCheckedAll: false,
      checkedGroup: [],

      discount: 10,
      discountPrice: 0
    };
  },
  computed: {
    packagePrice() {
      return this.checkedGroup.reduce((pre, cur) => {
        return pre + cur.ItemPrice;
      }, 0);
    }
  },
  created() {
    if (this.mark == "edit") this.loadData();
  },
  mounted() {
    this.loadMaritalStatus();
    this.loadGender();
    this.loadPackageTypes();
    this.loadStandard();
    this.loadProjectsData();
  },
  methods: {
    loadData() {
      if (!this.packageId) return;
      let para = {
        packageId: this.packageId
      };

      getExclusivePackageDetail(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
          this.discount = data.Discount * 10;
          this.discountPrice = data.DiscountPrice;
          this.checkedGroup = data.PackageItem;
          console.log("this.items:", data);
          this.addIsChecked();
        }
      });
    },
    loadProjectsData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        itemName: this.itemNameInput,
        mecid: userInfo.mecID,
        isLocked: false
      };
      getItems(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.items = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          if (this.items) {
            this.initItemsData(this.items, 0, null);
            this.addIsChecked();
          }
        }
      });
    },
    loadMaritalStatus() {
      getMaritalDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.marriageOptions = data;
        }
      });
    },
    loadGender() {
      getGenderDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.genderOptions = data;
        }
      });
    },
    loadPackageTypes() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        mecid: userInfo.mecID
      };
      getPackageTypeDataSource(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.packageTypeOptions = data;
        }
      });
    },
    loadStandard() {
      let para = {
        planId: this.planId
      };
      getStandardForPlanDataSource(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.standardOptions = data;
        }
      });
    },
    cancel() {
      this.$emit("closePackageEditPop");
    },
    save() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          let itemIDs = "";
          if (this.checkedGroup.length > 0) {
            itemIDs = this.checkedGroup.map(r => r.ItemID).join(",");
          }

          let packageTypes = null;
          if (this.data_local.PackageTypes) {
            packageTypes = this.data_local.PackageTypes.map(r => r.Value).join(
              ","
            );
          }

          let para = {
            planID: this.planId,
            packageName: this.data_local.PackageName,
            packagePrice: this.packagePrice,
            discount: this.discount / 10,
            discountPrice: this.discountPrice,
            marriage: this.data_local.Marriage,
            gender: this.data_local.Gender,
            remark: this.data_local.Remark,
            sort: this.data_local.Sort,
            itemIDs: itemIDs,
            standardID: this.data_local.Standard,
            packageType: packageTypes
          };

          if (this.mark == "add") {
            addExclusivePackage(para).then(res => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success"
                });
                // this.$emit("loadData");
                this.cancel();
              }
            });
          } else if (this.mark == "edit") {
            para.PackageID = this.packageId;
            editExclusivePackage(para).then(res => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success"
                });
                // this.$emit("loadData");
                this.cancel();
              }
            });
          }
        }
      });
    },
    //#region 项目
    initItemsData(items, level, parent) {
      this.initItems = [];
      this.initData(items, level, parent);
    },
    initData(items, level, parent) {
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
        if (typeof item.isChecked == "undefined") {
          item = Object.assign({}, item, {
            isChecked: false
          });
        }
        if (typeof item.isShow == "undefined") {
          item = Object.assign({}, item, {
            isShow: true
          });
        }

        this.initItems.push(item);

        if (item.Children) {
          this.initData(item.Children, level + 1, item.ID);
        }
      });
    },
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.loadData();
    },
    // getMarriageColor(status) {
    //   if (status === 0) return "primary";
    //   if (status === 1) return "success";
    //   if (status === 2) return "danger";
    //   return "primary";
    // },
    // getGenderColor(status) {
    //   if (status === 0) return "primary";
    //   if (status === 1) return "success";
    //   if (status === 2) return "danger";
    //   return "primary";
    // },
    handleCheckbox(tr) {
      if (tr) {
        if (!tr.isChecked) {
          let item = {
            ItemID: tr.ID,
            ItemName: tr.ItemName,
            ItemPrice: tr.ItemPrice
          };
          tr.isChecked = !tr.isChecked;

          this.checkedGroup.push(item);
        } else {
          this.delProject(tr.ID);
        }
      }
      this.handleCheckboxAll();
    },
    handleCheckboxAll() {
      let checkedCount = this.initItems.filter(f => !f.Children && f.isChecked)
        .length;
      let count = this.initItems.filter(f => !f.Children).length;

      this.isCheckedAll = checkedCount == count ? true : false;
    },
    delProject(id) {
      if (this.checkedGroup.length > 0) {
        this.checkedGroup.map((item, index) => {
          if (item.ItemID === id) {
            this.checkedGroup.splice(index, 1);
          }
        });
      }
    },
    handleCheckAll() {
      if (!this.initItems.length > 0) return;
      this.isCheckedAll = !this.isCheckedAll;
      this.initItems.map((item, index) => {
        if (!item.Children) {
          if (this.isCheckedAll) {
            if (!item.isChecked) {
              let checkItem = {
                ItemID: item.ID,
                ItemName: item.ItemName,
                ItemPrice: item.ItemPrice
              };
              item.isChecked = true;
              this.checkedGroup.push(checkItem);
            }
          } else {
            if (item.isChecked) {
              item.isChecked = false;
              this.delProject(item.ID);
            }
          }
        }
      });
    },
    addIsChecked() {
      if (this.initItems.length > 0) {
        this.initItems.map((item, index) => {
          if (this.checkedGroup.length > 0) {
            this.checkedGroup.map((checkedItem, index) => {
              if (item.ID === checkedItem.ItemID) {
                item.isChecked = true;
              }
            });
          }
        });
        this.handleCheckboxAll();
      }
    },
    //#endregion
    //#region 套餐价格
    changeDiscount(event) {
      let price = accMul(this.packagePrice, accDivCoupon(event, 10));
      this.discountPrice = price.toFixed(2);
    },
    changeDiscountPrice(event) {
      let dis = (event / this.packagePrice) * 10;
      this.discount = dis.toFixed(1);
    },
    cancelProjectBox(id) {
      this.initItems.map((tr, index) => {
        if (tr.ID == id) {
          if (!tr.isChecked) {
            let item = {
              ItemID: tr.ID,
              ItemName: tr.ItemName,
              ItemPrice: tr.ItemPrice
            };
            tr.isChecked = !tr.isChecked;
            this.checkedGroup.push(item);
          } else {
            tr.isChecked = !tr.isChecked;
            this.delProject(tr.ID);
          }
        }
      });
    }
    //#endregion
  },
  watch: {
    currentPage() {
      this.loadData();
    },
    packagePrice() {
      let price = (this.discount / 10) * this.packagePrice;
      this.discountPrice = price.toFixed(2);
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
