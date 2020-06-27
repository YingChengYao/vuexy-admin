<template>
  <div id class="data-list-container">
    <item-data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      @loadData="loadData"
      :data="sidebarData"
    />

    <div class="vx-row">
      <div v-if="true" class="vx-col w-full md:w-2/5 lg:w-1/4 rounded-lg">
        <vx-card>
          <project-show />
        </vx-card>
      </div>

      <div class="vx-col w-full mt-12 md:mt-0" :class="true?'md:w-3/5 lg:w-3/4':''">
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
                        color="primary"
                        type="border"
                        class="mb-4 mr-4"
                        @click="addNewData"
                        v-show="!isPop"
                      >添加</vs-button>
                      <!-- <vs-checkbox :checked="true" size="small" /> -->
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
                    <vs-th sort-key="no">编号</vs-th>
                    <vs-th sort-key="item_name">项目名称</vs-th>
                    <!-- <vs-th sort-key="item_type_id">所属类别编号</vs-th> -->
                    <!-- <vs-th sort-key="item_type">所属类别</vs-th> -->
                    <vs-th sort-key="item_price">项目价格</vs-th>
                    <vs-th sort-key="is_mandatory">是否必选</vs-th>
                    <vs-th sort-key="marriage">婚姻状态</vs-th>
                    <vs-th sort-key="gender">性别</vs-th>
                    <vs-th sort-key="sort">排序</vs-th>
                    <vs-th sort-key="is_locked">是否锁定</vs-th>
                    <vs-th sort-key="remark">描述</vs-th>
                    <vs-th sort-key="modify_name">修改人</vs-th>
                    <vs-th sort-key="modify_time">修改时间</vs-th>
                    <vs-th>操作</vs-th>
                  </template>

                  <template slot-scope="{data}">
                    <tbody>
                      <vs-tr
                        :data="tr"
                        :style="tr.Children?'pointer-events: none;':''"
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
                            v-if="isPop"
                          />
                        </vs-td>
                        <vs-td>
                          <p>{{ indextr+1 }}</p>
                        </vs-td>
                        <vs-td>
                          <span :style="'margin-left:'+ (tr.level)*20 +'px'">
                            <span @click.stop="toggle(tr)" v-if="tr.Children">
                              <vs-icon
                                :icon-pack="tr.isExpand?'iconfont icon-shangxiazuoyouTriangle11':'iconfont icon-shangxiazuoyouTriangle12'"
                              ></vs-icon>
                            </span>
                            {{tr.Children?tr.TypeName:tr.ItemName}}
                          </span>
                        </vs-td>
                        <!-- <vs-td>
                <p>{{ tr.ItemTypeID }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.ItemTypeName }}</p>
                        </vs-td>-->
                        <vs-td>
                          <p>{{ tr.ItemPrice }}</p>
                        </vs-td>
                        <vs-td>
                          <p v-if="tr.IsMandatory!=null">{{ tr.IsMandatory?'是':'否' }}</p>
                        </vs-td>
                        <vs-td>
                          <p>{{ tr.MarriageName}}</p>
                        </vs-td>
                        <vs-td>
                          <p>{{ tr.GenderName }}</p>
                        </vs-td>
                        <vs-td>
                          <p>{{ tr.Sort }}</p>
                        </vs-td>
                        <vs-td>
                          <p>{{ tr.IsLocked?'是':'否' }}</p>
                        </vs-td>
                        <vs-td>
                          <p>{{ tr.Remark }}</p>
                        </vs-td>
                        <vs-td>
                          <p>{{ tr.ModifyName }}</p>
                        </vs-td>
                        <vs-td>
                          <p>{{ tr.ModifyTime | formatDate }}</p>
                        </vs-td>
                        <vs-td class="whitespace-no-wrap">
                          <vs-button
                            v-if="!tr.Children"
                            color="primary"
                            size="small"
                            type="border"
                            @click="editData(tr)"
                          >编辑</vs-button>
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
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import ItemDataViewSidebar from "./ItemDataViewSidebar";
import ProjectShow from "./Show";
import { getItems } from "@/http/package.js";
import { clone } from "@/common/utils/data/clone";

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
    ItemDataViewSidebar,
    ProjectShow
  },
  data() {
    return {
      isCheckedAll: false,
      checkedGroup: [{ ID: "9028739748891713536" }],

      items: [],
      initItems: [],

      //Page
      itemsPerPage: 2,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,
      //currentItems: 0,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},

      itemNameInput: "",

      isPop: true
    };
  },
  computed: {
    // isCheckedAll() {
    //   let s=this.currentItems.length;
    //   let s1=this.currentClickedItems.length;
    //   console.log("s:",s)
    //   console.log("s1:",s1)
    //   return s==s1
    //   //return this.currentItems.count == this.isCheckAllFunc();
    // },
    currentItems() {
      return this.initItems.filter(f => !f.Children);
    }
    // currentClickedItems() {
    //   return this.initItems.filter(f => !f.Children && f.isChecked);
    // }
  },
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        itemName: this.itemNameInput,
        mecid: userInfo.mecID
      };

      getItems(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.items = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          if (this.items) {
            //this.dataLength = this.Length(this.items);

            this.initItemsData(this.items, 0, null);
            this.addIsChecked();

            //this.initData(this.items, 1, null);
            //this.checkedGroup = this.renderCheck(this.items);
            // if (this.checkedGroup.length == this.dataLength) {
            //   this.checks = true;
            // } else {
            //   this.checks = false;
            // }
          }
        }
      });
    },
    addNewData() {
      this.sidebarData = {
        title: "添加项目",
        mark: "add"
      };
      this.toggleDataSidebar(true);
    },
    editData(data) {
      this.sidebarData = data;
      this.sidebarData.title = "修改项目";
      this.sidebarData.mark = "edit";
      this.toggleDataSidebar(true);
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
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
          this.checkedGroup.push(tr);
        } else {
          this.delItem(tr);
        }
      }
      let checkedCount = this.initItems.filter(f => !f.Children && f.isChecked)
        .length;
      let count = this.initItems.filter(f => !f.Children).length;

      this.isCheckedAll = checkedCount == count ? true : false;
    },
    handleCheckAll() {
      if (!this.initItems.length > 0) return;
      this.isCheckedAll = !this.isCheckedAll;
      this.initItems.map((item, index) => {
        item.isChecked = this.isCheckedAll;
      });
    },
    delItem(item) {
      if (this.checkedGroup.length > 0) {
        this.checkedGroup.map((item, index) => {
          if (item.ID === item.ID) {
            this.checkedGroup.splice(index, 1);
          }
        });
      }
    },
    /*分页请求后返回新数据的时候，该每一项设置属性 isChecked 为 false，但是当数组内部有保存的数据时，
    且该保存的数据id和请求返回回来的id相同的话，就把该项选中，比如我勾选了第一页中的某一项，会把
    该项的id保存到数组内部去，当切换到第二页的时候，那么再返回到第一页的时候，会获取该id是否与数组的
    id是否相同，如果相同的话，就把该项数据选中*/
    addIsChecked() {
      if (this.initItems.length > 0) {
        this.initItems.map((item, index) => {
          if (this.checkedGroup.length > 0) {
            this.checkedGroup.map((checkedItem, index) => {
              if (item.ID === checkedItem.ID) item.isChecked = true;
            });
          }
        });
      }
    },
    // 数据处理 增加自定义属性监听
    initData(items, level, parent) {
      // let spaceHtml = "";
      // for (var i = 1; i < level; i++) {
      //   spaceHtml += "<i class='ms-tree-space'></i>";
      // }
      if (!items) {
        return;
      }
      let projects = null;
      if (this.isSelected) {
        projects = sessionStorage.getItem("SelectedProjects")
          ? JSON.parse(sessionStorage.getItem("SelectedProjects"))
          : [];
      }
      items.map((item, index) => {
        item = Object.assign({}, item, {
          parent: parent,
          level: level
          //spaceHtml: spaceHtml
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
    }
  },
  created() {
    this.isPop = this.packageId ? true : false;
  },
  mounted() {
    this.loadData();
  },
  watch: {
    currentPage() {
      this.loadData();
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/extraComponents/tree.scss";

button.btn-async {
  background: rgba(var(--vs-warning), 0.15);
}

button.btn-delete {
  background: rgba(var(--vs-danger), 0.15);
}
</style>
