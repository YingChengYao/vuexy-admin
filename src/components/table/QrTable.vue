<template>
  <div>
    <vs-table ref="table" :data="items" stripe>
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
          <slot name="header"></slot>
        </div>
      </div>

      <template slot="thead">
        <th class="td-check" v-if="multipleCheck">
          <span class="con-td-check">
            <vs-checkbox :checked="isCheckedAll" @change="handleCheckAll()" size="small" />
          </span>
        </th>
        <vs-th v-if="showIndex">序号</vs-th>

        <vs-th :key="index" v-for="(item, index) in cloumns">{{item.headerName}}</vs-th>

        <vs-th v-if="operates.list.filter(x=>x.show).length>0">操作</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" v-show="!tr.isHide">
            <vs-td v-if="multipleCheck" class="td-check">
              <vs-checkbox
                v-if="!tr.noUseTrCheckBox"
                :checked="tr.isChecked"
                @change="handleCheckbox(tr)"
                size="small"
              />
            </vs-td>

            <vs-td v-if="showIndex" style="width:60px">
              <p>{{ indextr+1 }}</p>
            </vs-td>

            <vs-td :key="index" v-for="(item, index) in cloumns">
              <!-- <table-cell v-if="item.render" :row="tr" :column="item" :index="index"></table-cell> -->

              <span v-if="item.expand" :style="'margin-left:'+ (tr.level)*20 +'px'">
                <span @click.stop="toggle(tr)" v-if="tr.children || tr.hasChildren">
                  <vs-icon
                    :icon-pack="tr.isExpand?'iconfont icon-shangxiazuoyouTriangle11':'iconfont icon-shangxiazuoyouTriangle12'"
                  ></vs-icon>
                </span>
                {{item.formatter?item.formatter(tr[item.field],tr):tr[item.field]}}
              </span>
              <span v-else>{{item.formatter?item.formatter(tr[item.field],tr):tr[item.field]}}</span>
            </vs-td>

            <vs-td v-if="operates.list.filter(x=>x.show).length>0" class="whitespace-no-wrap">
              <span
                :key="key"
                v-for="(btn, key) in operates.list"
                v-show="btn.show"
                class="text-primary mr-2"
                size="small"
                type="border"
                @click.stop="btn.method(key,tr)"
              >{{btn.title}}</span>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>
<script>
export default {
  name: "qr-table",
  props: {
    value: {},
    items: {
      type: Array,
      required: true,
    },
    multipleCheck: {
      type: Boolean,
      default: false,
    },
    checkField: {
      type: String,
      default: "ID",
    },
    showIndex: {
      type: Boolean,
      default: true,
    },
    cloumns: {
      type: Array,
      required: true,
    },
    operates: {
      type: Object,
      default: () => {
        return {
          list: [],
        };
      },
    },
  },
  data: () => ({
    //checked
    isCheckedAll: false,
  }),
  computed: {},
  created() {},
  watch: {
    items() {
      if (this.multipleCheck) {
        this.initCheckedItems();
      }
    },
  },
  methods: {
    //#region 自定义checked
    handleCheckbox(tr) {
      if (this.multipleCheck && !tr.noUseTrCheckBox) {
        tr.isChecked = !tr.isChecked;
        this.changeCheckbox(tr);
        this.handleCheckboxAll();
      }
    },
    handleCheckboxAll() {
      let checkedCount = this.items.filter(
        (f) => f.isChecked && !f.noUseTrCheckBox
      ).length;
      let count = this.items.filter((f) => !f.noUseTrCheckBox).length;
      this.isCheckedAll = checkedCount == count ? true : false;
    },
    handleCheckAll() {
      this.isCheckedAll = !this.isCheckedAll;
      if (!this.items.length > 0) return;
      let isCheckedAll = this.isCheckedAll;

      let datas = [];
      datas = this.items.filter((f) => {
        return f.isChecked != isCheckedAll;
      });

      datas.map((item, index) => {
        item.isChecked = isCheckedAll;
        this.changeCheckbox(item);
      });
    },
    changeCheckbox(tr) {
      if (tr.noUseTrCheckBox) return;
      let val = this.value;
      if (tr.isChecked) {
        let isExist =
          val.filter((v) => {
            return v[this.checkField] == tr[this.checkField];
          }).length > 0;
        if (!isExist) val.push(tr);
      } else {
        let index = val.findIndex(
          (i) => i[this.checkField] == tr[this.checkField]
        );
        if (index < 0) return;
        val.splice(index, 1);
      }
    },
    /*分页请求后返回新数据的时候，该每一项设置属性 isChecked 为 false，但是当数组内部有保存的数据时，
    且该保存的数据和请求返回回来的相同的话，就把该项选中，比如我勾选了第一页中的某一项，会把
    该项的id保存到数组内部去，当切换到第二页的时候，那么再返回到第一页的时候，会获取该id是否与数组的
    id是否相同，如果相同的话，就把该项数据选中*/
    initCheckedItems(datas) {
      if (!this.multipleCheck) return;
      if (this.items.length > 0) {
        this.items.map((item, index) => {
          if (Array.isArray(datas) && datas.length > 0) {
            let val = datas.find(
              (t) => t[this.checkField] === item[this.checkField]
            );
            item.isChecked = !val ? false : true;
          } else if (Array.isArray(this.value) && this.value.length > 0) {
            let val = this.value.find(
              (t) => t[this.checkField] === item[this.checkField]
            );
            item.isChecked = !val ? false : true;
          }
        });
        this.handleCheckboxAll();
      }
    },
    //#endregion

    //#region expand
    toggle: function (m) {
      debugger;
      if (m.children || m.hasChildren) {
        this.toggleExpand(m.ID, m.isExpand);
        m.isExpand = !m.isExpand;
      }
    },
    toggleExpand(ID, isHide) {
      this.items.map((i) => {
        if (i.parent == ID) {
          i.isHide = isHide;
          if (i.children || i.hasChildren) {
            this.toggleExpand(i.ID, isHide);
          }
        }
      });
    },
    //#endregion
  },
};
</script>
<style scoped>
</style>
