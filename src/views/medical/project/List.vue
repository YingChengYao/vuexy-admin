<template>
  <div id class="data-list-container">
    <vs-popup fullscreen :title="title" :active.sync="popupActive">
      <project-edit @closePop="closePop" @loadData="loadData" :projectId="projectId" :key="timer" />
    </vs-popup>

    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <div class="tab-text">
          <vx-card ref="filterCard" title class="user-list-filters mb-8">
            <vs-row vs-align="center">
              <label class="vx-col label-name px-2">项目名称</label>
              <vs-input
                placeholder="Placeholder"
                v-model="itemNameInput"
                class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
              />

              <label class="vx-col label-name px-2">是否锁定</label>
              <vs-select
                v-model="isLockedSelect"
                class="vx-col md:w-1/6 sm:w-1/2 w-full px-2 select-large"
              >
                <vs-select-item
                  v-for="(item,index) in isLockedSelectOptions"
                  :key="index"
                  :value="item.value"
                  :text="item.name"
                  class="w-full"
                />
              </vs-select>
              <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
            </vs-row>
          </vx-card>

          <div class="vx-card p-6">
            <vs-table ref="table" :data="initItems" stripe>
              <div
                slot="header"
                class="flex flex-wrap-reverse items-center flex-grow justify-between"
              >
                <div
                  class="flex flex-wrap-reverse items-center data-list-btn-container header-left"
                >
                  <vs-button
                    @click="addNewData"
                    color="primary"
                    type="border"
                    class="mb-4 mr-4"
                    v-if="!isPop"
                  >添加</vs-button>
                </div>
              </div>

              <template slot="thead">
                <vs-th>
                  <vs-checkbox
                    :checked="isCheckedAll"
                    @change="handleCheckAll()"
                    v-if="isPop"
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
                <vs-th v-if="!isPop">操作</vs-th>
              </template>

              <template slot-scope="{data}">
                <tbody>
                  <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" v-show="tr.isShow">
                    <vs-td>
                      <vs-checkbox
                        :checked="tr.isChecked"
                        @change="handleCheckbox(tr)"
                        v-show="!tr.Children"
                        size="small"
                        v-if="isPop"
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
                    <vs-td class="whitespace-no-wrap" v-if="!isPop">
                      <span
                        v-if="!tr.Children"
                        class="text-primary"
                        size="small"
                        type="border"
                        @click.stop="editData(tr.ID)"
                      >编辑</span>
                    </vs-td>
                  </vs-tr>
                </tbody>
              </template>
            </vs-table>

            <div class="flex">
              <span v-if="isPop" class="mt-5">
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
</template>

<script>
import ProjectShow from "./Show";
import ProjectEdit from "./Edit";
import {
  getItems,
  getProjectsForPackage,
  deployProjectForPackage
} from "@/http/package.js";
import { clone } from "@/common/utils/data/clone";
import {
  accAdd,
  accSubtr,
  accMul,
  accDivCoupon
} from "@/common/utils/data/calc";

export default {
  props: {
    packageId: {
      type: String,
      default: null
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ProjectShow,
    ProjectEdit
  },
  data() {
    return {
      isCheckedAll: false,

      //Pop
      popupActive: false,
      projectId: null,
      title: null,
      timer: "",

      items: [],
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
      itemNameInput: "",
      isLockedSelect: false,

      //Page
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,

      //pop
      isPop: true,
      checkedGroup: [],
      discount: 10,
      discountPrice: 0,
      packagePrice: 0
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        itemName: this.itemNameInput,
        mecid: userInfo.mecID,
        isLocked: this.isLockedSelect
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
    getMarriageColor(status) {
      if (status === 0) return "primary";
      if (status === 1) return "success";
      if (status === 2) return "danger";
      return "primary";
    },
    getGenderColor(status) {
      if (status === 0) return "primary";
      if (status === 1) return "success";
      if (status === 2) return "danger";
      return "primary";
    },
    addNewData() {
      this.projectId = null;
      this.popupActive = true;
      this.title = "添加项目信息";
      this.handleLoad();
    },
    editData(id) {
      this.projectId = id;
      this.title = "修改项目信息";
      this.popupActive = true;
      this.handleLoad();
    },
    save() {
      let projectIds = this.checkedGroup
        .map(obj => {
          return obj.ItemID;
        })
        .join(",");

      let para = {
        packageID: this.packageId,
        itemIDs: projectIds,
        discount: this.discount / 10,
        discountPrice: this.discountPrice
      };
      deployProjectForPackage(para).then(res => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "Success",
            text: res.message,
            color: "success"
          });
          this.cancel();
        }
      });
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    cancel() {
      this.$router.push("/package").catch(() => {});
    },
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.loadData();
    },
    toggle: function(m) {
      if (m.Children) {
        this.initItems.forEach(i => {
          if (i.parent == m.ID) {
            i.isShow = !i.isShow;
          }
        });
        m.isExpand = !m.isExpand;
      }
    },
    initItemsData(items, level, parent) {
      this.initItems = [];
      this.initData(items, level, parent);
    },
    handleCheckbox(tr) {
      if (tr) {
        tr.isChecked = !tr.isChecked;
        if (tr.isChecked) {
          let item = {
            ItemID: tr.ID,
            ItemName: tr.ItemName,
            ItemPrice: tr.ItemPrice
          };
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
    checkprojectBox(id) {
      this.initItems.map((tr, index) => {
        if (tr.ID == id) {
          tr.isChecked = !tr.isChecked;
          if (tr.isChecked) {
            let item = {
              ItemID: tr.ID,
              ItemName: tr.ItemName,
              ItemPrice: tr.ItemPrice
            };
            this.checkedGroup.push(item);
          } else {
            this.delProject(tr.ID);
          }
        }
      });
    },
    handleCheckAll() {
      if (!this.initItems.length > 0) return;
      this.isCheckedAll = !this.isCheckedAll;
      this.initItems.map((item, index) => {
        item.isChecked = this.isCheckedAll;
      });
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
    loadCheckedGroup() {
      if (!this.packageId) return;
      let para = {
        packageId: this.packageId
      };
      getProjectsForPackage(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("项目：", data);
          this.checkedGroup = data.Item;
          this.checkedGroup.map((item, index) => {
            if (!item.ItemPrice) item.ItemPrice = 0;
          });
          data.Discount = !data.Discount ? 1 : data.Discount;

          this.discount = accMul(data.Discount, 10);
          console.log("discount:", this.discount);

          this.discountPrice =
            data.DiscountPrice == null ? 0 : data.DiscountPrice;

          this.$event.$emit("initProjectCheckedData", {
            checkedGroup: this.checkedGroup,
            discount: this.discount,
            discountPrice: this.discountPrice
          });
        }
      });
    },
    /*分页请求后返回新数据的时候，该每一项设置属性 isChecked 为 false，但是当数组内部有保存的数据时，
    且该保存的数据id和请求返回回来的id相同的话，就把该项选中，比如我勾选了第一页中的某一项，会把
    该项的id保存到数组内部去，当切换到第二页的时候，那么再返回到第一页的时候，会获取该id是否与数组的
    id是否相同，如果相同的话，就把该项数据选中*/
    addIsChecked() {
      console.log("checkedGroup:", this.checkedGroup);
      console.log("initItems:", this.initItems);
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
    // 数据处理 增加自定义属性监听
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
    // 深度拷贝函数
    deepCopy(data) {
      var t = this.type(data),
        o,
        i,
        ni;
      if (t === "array") {
        o = [];
      } else if (t === "object") {
        o = {};
      } else {
        return data;
      }
      if (t === "array") {
        for (i = 0, ni = data.length; i < ni; i++) {
          o.push(this.deepCopy(data[i]));
        }
        return o;
      } else if (t === "object") {
        for (i in data) {
          o[i] = this.deepCopy(data[i]);
        }
        return o;
      }
    },
    type(obj) {
      var toString = Object.prototype.toString;
      var map = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regExp",
        "[object Undefined]": "undefined",
        "[object Null]": "null",
        "[object Object]": "object"
      };
      return map[toString.call(obj)];
    },

    //#region 弹窗
    closePop() {
      this.popupActive = false;
    }
    //#endregion
  },
  created() {
    this.isPop = this.packageId ? true : false;
    this.loadCheckedGroup();
  },
  mounted() {
    this.loadData();
    this.$event.$on("delProject", data => {
      this.$nextTick(() => {
        this.checkprojectBox(data);
      });
    });
    this.$event.$on("projectDiscount", data => {
      this.$nextTick(() => {
        this.discount = data;
      });
    });
    this.$event.$on("projectDiscountPrice", data => {
      this.$nextTick(() => {
        this.discountPrice = data;
      });
    });
  },
  watch: {
    currentPage() {
      this.loadData();
    },
    checkedGroup() {
      this.$event.$emit("checkedItems", {
        checkedGroup: this.checkedGroup
      });
    },
    popupActive() {
      if (!this.popupActive) {
        this.projectId = null;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
