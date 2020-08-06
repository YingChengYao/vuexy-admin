<template>
  <div class="data-list-container">
    <vs-popup fullscreen :title="title" :active.sync="popupActive">
      <unit-edit
        v-if="popupActive"
        @closePop="closePop"
        @loadData="loadData"
        :medicalCenterID="medicalCenterID"
        :medicalCenterData="medicalCenterData"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card class="mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">体检中心名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="MedicalCenterNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />

        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card>

    <div class="vx-card p-6">
      <vx-table
        ref="table"
        v-model="selected"
        :items="medicalCenters"
        :totalItems="totalItems"
        :pageSize="10"
        :multipleCheck="multipleCheck"
        @loadData="loadData"
      >
        <template slot="header">
          <vs-button
            v-if="!isPlanPop"
            color="primary"
            type="border"
            class="mb-4 mr-4"
            @click="addNewData"
          >添加</vs-button>
        </template>
        <template slot="thead-header">
          <vs-th>体检中心名称</vs-th>
          <vs-th>体检中心编号</vs-th>
          <vs-th>级别</vs-th>
          <vs-th>性质</vs-th>
          <vs-th>辖区</vs-th>
          <vs-th>联系人</vs-th>
          <vs-th>手机号</vs-th>
          <vs-th>电话</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>创建时间</vs-th>
          <vs-th>操作</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.MecName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.MecCode }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.MecGradeName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.MecnNatureName }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.County }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Contact }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Mobile }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Tel }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Sort }}</p>
          </vs-td>
          <vs-td>
            <p class="product-category">{{ item.tr.ModifyName}}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.ModifyTime | formatDate }}</p>
          </vs-td>
          <vs-td class="whitespace-no-wrap">
            <span class="text-primary" size="small" type="border" @click.stop="editData(item.tr)">编辑</span>
          </vs-td>
        </template>
        <template slot="paginationright">
          <slot name="paginationright"></slot>
        </template>
      </vx-table>
    </div>
  </div>
</template>

<script>
import UnitEdit from "./Edit";
import { getMedicalCenters } from "@/http/medical_center.js";
export default {
  components: {
    UnitEdit,
  },
  props: {
    multipleCheck: {
      type: Boolean,
      default: false,
    },
    isPlanPop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //Page
      medicalCenters: [],
      totalItems: 0,
      selected: [],

      //filter
      MedicalCenterNameInput: null,

      // Pop
      title: null,
      popupActive: false,
      medicalCenterID: null,
      medicalCenterData: null,
      timer: "",
      mark: null,
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.$refs.table.currentPage,
        pageSize: this.$refs.table.itemsPerPage,
        companyId: userInfo.companyID,
        mecName: this.MedicalCenterNameInput,
        mecName: this.MedicalCenterNameInput,
      };
      getMedicalCenters(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("体检中心：", data);
          this.medicalCenters = data.Items;
          this.totalItems = data.TotalItems;
        }
      });
    },
    loadSelectedData(data) {
      this.selected = data;
      this.$refs.table.initCheckedItems(this.selected);
    },
    //#region 弹窗
    addNewData() {
      this.medicalCenterID = null;
      this.popupActive = true;
      this.title = "添加体检中心信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(tr) {
      this.medicalCenterID = tr.ID;
      this.popupActive = true;
      this.title = "修改体检中心信息";
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
        remark: tr.Remark,
      };
      editPosition(para).then((res) => {
        if (res.resultType == 0) {
          this.$vs.notify({
            title: "Success",
            text: res.message,
            color: "success",
          });
          this.loadData();
        }
      });
    },
    //#endregion
  },
  created() {},
  mounted() {
    this.loadData();
  },
  watch: {
    selected() {
      console.log("this.selected1:", this.selected);
      // this.$emit("checkHandle", this.selected);
    },
  },
};
</script>

<style lang="scss">
</style>
