<template>
  <div id class="data-list-container">
    <vs-popup fullscreen :title="title" :active.sync="popupActive">
      <project-edit @closePop="closePop" @loadData="loadData" :projectId="projectId" :key="timer" />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">项目名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="itemNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />

        <label class="vx-col label-name px-2" v-if="!isComponent">是否锁定</label>
        <vs-select
          v-model="isLockedSelect"
          v-if="!isComponent"
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
      <vx-table
        ref="table"
        v-model="selected"
        :items="initItems"
        @loadData="loadData"
        :totalPage="totalPage"
        :totalItems="totalItems"
        :pageSize="10"
        :multipleCheck="multipleCheck"
      >
        <template slot="header">
          <vs-button
            v-if="!isPop"
            color="primary"
            type="border"
            class="mb-4 mr-4"
            @click="addNewData"
          >添加</vs-button>
        </template>
        <template slot="thead-header">
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
        <template slot="thead-content" slot-scope="item">
          <vx-tooltip :text="item.tr.Children?item.tr.TypeName:item.tr.ItemName">
            <vs-td style="width:10rem;display: block;" class="wrap">
              <span :style="'margin-left:'+ (item.tr.level)*20 +'px'">
                <span @click.stop="toggle(item.tr)" v-if="item.tr.Children">
                  <vs-icon
                    :icon-pack="item.tr.isExpand?'iconfont icon-shangxiazuoyouTriangle11':'iconfont icon-shangxiazuoyouTriangle12'"
                  ></vs-icon>
                </span>
                {{item.tr.Children?item.tr.TypeName:item.tr.ItemName}}
              </span>
            </vs-td>
          </vx-tooltip>

          <vs-td>
            <p v-if="!item.tr.Children">{{ item.tr.ItemPrice }}</p>
          </vs-td>
          <vs-td>
            <vs-chip
              transparent
              :color="item.tr.Marriage | getMarriageColor"
              v-if="!item.tr.Children"
            >{{ item.tr.MarriageName}}</vs-chip>
          </vs-td>
          <vs-td>
            <vs-chip
              transparent
              :color="item.tr.Gender | getGenderColor"
              v-if="!item.tr.Children"
            >{{ item.tr.GenderName}}</vs-chip>
          </vs-td>
          <vs-td>
            <p v-if="!item.tr.Children">{{item.tr.Sort }}</p>
          </vs-td>
          <vs-td>
            <p v-if="!item.tr.Children">{{ item.tr.IsLocked?'是':'否' }}</p>
          </vs-td>
          <vs-td>
            <p v-if="!item.tr.Children">{{ item.tr.ModifyName }}</p>
          </vs-td>
          <vs-td>
            <p v-if="!item.tr.Children">{{ item.tr.ModifyTime | formatDate }}</p>
          </vs-td>
          <vs-td class="whitespace-no-wrap" v-if="!isPop">
            <span
              v-if="!item.tr.Children"
              class="text-primary"
              size="small"
              type="border"
              @click.stop="editData(item.tr.ID)"
            >编辑</span>
          </vs-td>
        </template>
        <template slot="pagination">
          <slot name="pagination"></slot>
        </template>
        <template slot="paginationright">
          <slot name="paginationright"></slot>
        </template>
      </vx-table>
    </div>
  </div>
</template>

<script>
import ProjectShow from "./Show";
import ProjectEdit from "./Edit";
import {
  getItems,
  getProjectsForPackage,
  deployProjectForPackage,
} from "@/http/package.js";
import { clone } from "@/common/utils/data/clone";
import {
  accAdd,
  accSubtr,
  accMul,
  accDivCoupon,
} from "@/common/utils/data/calc";

export default {
  props: {
    packageId: {
      type: String,
      default: null,
    },
    isComponent: {
      type: Boolean,
      default: false,
    },
    multipleCheck: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ProjectShow,
    ProjectEdit,
  },
  data() {
    return {
      //Pop
      popupActive: false,
      projectId: null,
      title: null,
      timer: "",

      isLockedSelectOptions: [
        {
          name: "请选择",
          value: null,
        },
        {
          name: "否",
          value: false,
        },
        {
          name: "是",
          value: true,
        },
      ],

      //filter
      itemNameInput: "",
      isLockedSelect: false,

      //Page
      totalPage: 0,
      totalItems: 0,
      selected: [],
      items: [],
      initItems: [],

      //pop
      isPop: true,
      checkedGroup: [],
      discount: 10,
      discountPrice: 0,
      packagePrice: 0,
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.$refs.table.currentPage,
        pageSize: this.$refs.table.itemsPerPage,
        itemName: this.itemNameInput,
        mecid: userInfo.mecID,
        isLocked: this.isComponent ? false : this.isLockedSelect,
      };

      getItems(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.items = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          if (this.items) {
            this.initItemsData(this.items, 0, null);
          }
        }
      });
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
    toggle: function (m) {
      console.log(m);
      console.log(this.initItems);
      debugger;
      if (m.Children) {
        this.initItems.forEach((i) => {
          if (i.parent == m.ID) {
            i.isHide = !i.isHide;
          }
        });
        m.isExpand = !m.isExpand;
      }
    },
    initItemsData(items, level, parent) {
      this.initItems = [];
      this.initData(items, level, parent);
    },
    checkedGroupChange(tr) {
      if (tr.isChecked) {
        let r = this.checkedGroup.filter(function (x) {
          return x.ItemID === tr.ID;
        });
        if (r.length > 0) return;

        let item = {
          ItemID: tr.ID,
          ItemName: tr.ItemName,
          ItemPrice: tr.ItemPrice,
        };
        this.checkedGroup.push(item);
      } else {
        this.delProject(tr.ID);
      }
    },
    loadCheckedGroup() {
      if (!this.packageId) return;
      let para = {
        packageId: this.packageId,
      };
      getProjectsForPackage(para).then((res) => {
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
            discountPrice: this.discountPrice,
          });
        }
      });
    },
    // 数据处理 增加自定义属性监听
    initData(items, level, parent) {
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
            noUseTrCheckBox: true,
          });
        }
        if (typeof item.isChecked == "undefined") {
          item = Object.assign({}, item, {
            isChecked: false,
          });
        }
        if (typeof item.isHide == "undefined") {
          item = Object.assign({}, item, {
            isHide: false,
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
        "[object Object]": "object",
      };
      return map[toString.call(obj)];
    },

    //#region 弹窗
    closePop() {
      this.popupActive = false;
    },
    //#endregion
  },
  created() {
    this.isPop = this.packageId ? true : false;
    this.loadCheckedGroup();
  },
  mounted() {
    this.loadData();
    this.$event.$on("delProject", (data) => {
      this.$nextTick(() => {
        this.checkprojectBox(data);
      });
    });
    this.$event.$on("projectDiscount", (data) => {
      this.$nextTick(() => {
        this.discount = data;
      });
    });
    this.$event.$on("projectDiscountPrice", (data) => {
      this.$nextTick(() => {
        this.discountPrice = data;
      });
    });
  },
  watch: {
    currentPage() {
      this.loadData();
    },
    selected() {
      console.log("this.selected:", this.selected);

      this.$emit("checkHandle", this.selected);
    },
    checkedGroup() {
      this.$event.$emit("checkedItems", {
        checkedGroup: this.checkedGroup,
      });
    },
    popupActive() {
      if (!this.popupActive) {
        this.projectId = null;
      }
    },
  },
};
</script>

<style lang="scss">
</style>
