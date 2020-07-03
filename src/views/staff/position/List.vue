<template>
  <div class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive">
      <unit-edit
        @closePop="closePop"
        @loadData="loadData"
        :positionId="positionId"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">职位名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="positionNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />

        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vs-table ref="table" stripe :data="types">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <vs-th>编号</vs-th>
          <vs-th>职位名称</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>备注</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>创建时间</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p>{{ indextr+1 }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PositionName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Sort }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Remark }}</p>
              </vs-td>
              <vs-td>
                <p class="product-category">{{ tr.ModifyName}}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.ModifyTime | formatDate }}</p>
              </vs-td>
              <!-- <vs-td class="whitespace-no-wrap">
                <span
                  class="text-primary"
                  size="small"
                  type="border"
                  @click.stop="editData(tr.ID)"
                >编辑</span>
              </vs-td>-->

              <template slot="expand">
                <div class="w-full">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center justify-start">
                      <p class="px-2">职位</p>
                      <vs-input v-model="tr.PositionName" class="inputx" name="'职位名称'" />
                    </div>

                    <div class="flex items-center justify-start">
                      <p class="px-2">排序</p>
                      <vs-input v-model="tr.Sort" class="inputx" placeholder />
                    </div>
                    <div class="flex items-center justify-start">
                      <p class="px-2">备注</p>
                      <vs-input v-model="tr.Remark" class="inputx" placeholder />
                    </div>
                    <div class="flex">
                      <vs-button type="border" size="small" class="mr-2" @click="save(tr)">保存</vs-button>
                    </div>
                  </div>
                </div>
              </template>
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
  </div>
</template>

<script>
import UnitEdit from "./Edit";
import { getPositions, editPosition } from "@/http/staff.js";
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

      //filter
      positionNameInput: null,

      // Pop
      title: null,
      popupActive: false,
      positionId: null,
      timer: "",
      mark: null
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        companyId: userInfo.companyID,
        positionName: this.positionNameInput
      };
      getPositions(para).then(res => {
        console.log(3);
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("职位：", data);
          this.types = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    //#region 弹窗
    addNewData() {
      this.positionId = null;
      this.popupActive = true;
      this.title = "添加职位信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.positionId = null;
      this.popupActive = true;
      this.title = "修改职位信息";
      this.mark = "edit";
      this.handleLoad();
    },
    handleLoad() {
      this.timer = new Date().getTime();
    },
    closePop() {
      this.popupActive = false;
    },
    //#endregion
    save(tr) {
      let para = {
        id: tr.ID,
        positionName: tr.PositionName,
        sort: tr.Sort,
        remark: tr.Remark
      };
      console.log(para)
      editPosition(para).then(res => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "Success",
            text: res.message,
            color: "success"
          });
          this.loadData();
        }
      });
    },

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
