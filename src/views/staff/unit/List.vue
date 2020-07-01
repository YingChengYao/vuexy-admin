<template>
  <div class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive">
      <unit-edit
        @closePop="closePop"
        @loadData="loadData"
        :unitId="unitId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <div class="vx-card p-6">
      <vs-table ref="table" stripe :data="types">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <vs-th>编号</vs-th>
          <vs-th>项目单项名称</vs-th>
          <vs-th>是否作为项目使用</vs-th>
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
              <vs-td :data="tr.SingleName">
                <p>{{ tr.SingleName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.IsOptional?'是':'否' }}</p>
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
    </div>
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
import UnitEdit from "./Edit";
import { getEmployeeUnitls } from "@/http/staff.js";
export default {
  components: {
    UnitEdit
  },
  data() {
    return {
      //Page
      types: [],
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,

      // Pop
      title: null,
      popupActive: false,
      unitId: null,
      timer: "",
      mark: null
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log("12:", userInfo);

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        id: userInfo.uid
      };
      console.log("1:", para);
      getEmployeeUnitls(para).then(res => {
          console.log(3)
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("单位：", data);
          this.types = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    //#region 弹窗
    addNewData() {
      this.unitId = null;
      this.popupActive = true;
      this.title = "添加职工单位";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.$router
        .push({ name: "project_item_edit", params: { mark: "edit", id: id } })
        .catch(() => {});
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },
    //#endregion

    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.currentPage = 1;
      this.loadData();
    }
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
</style>
