<template>
  <div>
    <vs-table ref="table" :data="items" stripe>
      <!-- <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
          <vs-button
            v-if="!isPop"
            color="primary"
            type="border"
            class="mb-4 mr-4"
            @click="addNewData"
          >添加</vs-button>
        </div>
      </div>-->

      <template slot="thead">
        <th class="td-check" v-if="multipleCheck">
          <span class="con-td-check">
            <vs-checkbox :checked="isCheckedAll" @change="handleCheckAll()" size="small" />
          </span>
        </th>
        <vs-th>编号</vs-th>
        <slot name="cloumn"></slot>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td v-if="multipleCheck" class="td-check">
              <vs-checkbox :checked="tr.isChecked" @change="handleCheckbox(tr)" size="small" />
            </vs-td>
            <vs-td>
              <p>{{ indextr+1 }}</p>
            </vs-td>
            <slot name="row" :tr="tr"></slot>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>

    <div class="flex">
      <slot></slot>
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
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    multipleCheck: {
      type: Boolean,
      default: true
    },
    isCheckField: {
      type: String,
      default: "ID"
    },
    isPop: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    //checked
    isCheckedAll: false,
    checkedGroup: [],
    //Page
    itemsPerPage: 2,
    currentPage: 1,
    totalPage: 0,
    descriptionItems: [10, 20, 50, 100],
    totalItems: 0
  }),
  watch: {
    currentPage() {
      //this.$parent.loadData();
      this.$emit("loadData");
    }
  },
  methods: {
    loadData() {},
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.currentPage = 1;
      //this.$parent.loadData();
      this.$emit("loadData");
    },
    //#region 自定义checked
    handleCheckbox(tr) {
      if (tr) {
        tr.isChecked = !tr.isChecked;

        if (tr.isChecked) {
          this.checkedGroup.push(tr);
        } else {
          this.delChecked(tr);
        }
      }
      this.handleCheckboxAll();
    },
    handleCheckboxAll() {
      let checkedCount = this.items.filter(f => f.isChecked).length;
      let count = this.items.length;
      this.isCheckedAll = checkedCount == count ? true : false;
    },
    handleCheckAll() {
      this.isCheckedAll = !this.isCheckedAll;
      if (!this.items.length > 0) return;
      let val = this.isCheckedAll;
      this.items.map((item, index) => {
        item.isChecked = val;
        this.changeCheckbox(item);
      });
    },
    changeCheckbox(tr) {
      if (tr && tr.isChecked) {
        this.checkedGroup.push(tr);
      } else {
        this.delChecked(tr);
      }
    },
    delChecked(tr) {
      if (this.checkedGroup.length > 0) {
        this.checkedGroup.map((item, index) => {
          if (item[this.isCheckField] === tr[this.isCheckField]) {
            this.checkedGroup.splice(index, 1);
          }
        });
      }
    },
    /*分页请求后返回新数据的时候，该每一项设置属性 isChecked 为 false，但是当数组内部有保存的数据时，
    且该保存的数据和请求返回回来的相同的话，就把该项选中，比如我勾选了第一页中的某一项，会把
    该项的id保存到数组内部去，当切换到第二页的时候，那么再返回到第一页的时候，会获取该id是否与数组的
    id是否相同，如果相同的话，就把该项数据选中*/
    initCheckedItems() {
      if (this.items.length > 0) {
        this.items.map((item, index) => {
          if (this.checkedGroup.length > 0) {
            this.checkedGroup.map((checkedItem, index) => {
              if (item[this.isCheckField] === checkedItem[this.isCheckField]) {
                item.isChecked = true;
              }
            });
          }
        });
        this.handleCheckboxAll();
      }
    }
    //#endregion
  }
};
</script>
<style scoped>
</style>
