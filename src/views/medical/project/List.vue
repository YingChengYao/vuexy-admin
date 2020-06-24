<template>
  <div id class="data-list-container">
    <item-data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      @loadData="loadData"
      :data="sidebarData"
    />

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">项目名称</label>
        <div class="vx-col md:w-1/6 sm:w-1/2 w-full">
          <vs-input placeholder="Placeholder" v-model="itemNameInput" />
        </div>
        <vs-button
          radius
          color="primary"
          type="border"
          icon-pack="feather"
          icon="icon-search"
          @click="loadData"
        ></vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vs-table v-model="selected" :data="initItems" @selected="handleSelected" multiple stripe>
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button
              color="primary"
              type="border"
              class="mb-4 mr-4"
              @click="addNewData"
              v-show="!isPop"
            >添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <vs-th></vs-th>
          <vs-th sort-key="id" v-show="false">ID</vs-th>
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
            <vs-tr :data="tr" :style="tr.Children?'pointer-events: none;':''" :key="indextr" v-for="(tr, indextr) in data" v-show="tr.isShow">
              <vs-td v-show="false">
                <p>{{ tr.ID }}</p>
              </vs-td>
              <vs-td></vs-td>
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
                  <label
                    @@click.stop
                    @@dblclick.stop
                    class="custom-control custom-checkbox"
                    style="margin-bottom:0px;"
                  >
                    <!-- <input
                      v-model="Modules"
                      class="custom-control-input"
                      @@change="checkdChange(tr)"
                      type="checkbox"
                      :value="tr.ID"
                    />-->
                    <span class="custom-control-indicator"></span>
                  </label>
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
                  @click="loadData"
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
</template>

<script>
import ItemDataViewSidebar from "./ItemDataViewSidebar";
// import ItemType from "./ItemType";
import { getItems } from "@/http/package.js";
import { clone } from "@/common/utils/data/clone";
export default {
  props: {
    packageId: {
      type: String,
      default: null
    }
  },
  components: {
    ItemDataViewSidebar
    // ItemType
  },
  data() {
    return {
      selected: [],
      items: [],
      initItems: [],
      isMounted: false,

      //Page
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},

      itemNameInput: "",

      isPop: false
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
        mecid: userInfo.mecID
      };

      getItems(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("项目：", data);
          this.items = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          if (this.items) {
            debugger;
            //this.dataLength = this.Length(this.items);

            this.initItemsData(this.items, 0, null);
            //this.initData(this.items, 1, null);
            //this.checkGroup = this.renderCheck(this.items);
            // if (this.checkGroup.length == this.dataLength) {
            //   this.checks = true;
            // } else {
            //   this.checks = false;
            // }
            console.log("initItems222:", this.initItems);
          }
        }
        console.log("initItems111:", this.initItems);
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
    handleSelected(tr) {
      // this.$vs.notify({
      //   title: `Selected ${tr.ItemName}`,
      //   text: `Email: ${tr.ItemName}`
      // })
      console.log(this.selected)
    },
    // 数据处理 增加自定义属性监听
    initData(items, level, parent) {
      let spaceHtml = "";
      for (var i = 1; i < level; i++) {
        spaceHtml += "<i class='ms-tree-space'></i>";
      }
      if (!items) {
        return;
      }
      items.map((item, index) => {
        debugger;
        item = Object.assign({}, item, {
          parent: parent,
          level: level,
          spaceHtml: spaceHtml
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
        // item = Object.assign({}, item, {
        //   load: item.isExpand ? true : false
        // });

        this.initItems.push(item);

        if (item.Children) {
          this.initData(item.Children, level + 1, item.ID);
        }
      });

      console.log("initItems3334:", this.initItems);
    },
    // 深度拷贝函数
    deepCopy(data) {
      debugger;
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
    this.isMounted = true;
    this.loadData();
    if (this.items) {
      debugger;
      //this.dataLength = this.Length(this.items);

      this.initItemsData(this.items, 1, null);
      //this.initData(this.items, 1, null);
      //this.checkGroup = this.renderCheck(this.items);
      // if (this.checkGroup.length == this.dataLength) {
      //   this.checks = true;
      // } else {
      //   this.checks = false;
      // }
    }
  },
  watch: {
    currentPage() {
      this.loadData();
    },
    // packageId() {
    //   console.log("this.packageId:", this.packageId);
      
    // }
    // items() {
    //   if (this.items) {
    //     //this.dataLength = this.Length(this.items);
    //     this.initData(clone(this.items), 1, null);
    //     //this.checkGroup = this.renderCheck(this.items);
    //     // if (this.checkGroup.length == this.dataLength) {
    //     //   this.checks = true;
    //     // } else {
    //     //   this.checks = false;
    //     // }
    //   }
    // }
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
