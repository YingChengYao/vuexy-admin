<template>
  <div class="data-list-container">
    <vs-popup fullscreen :title="title" :active.sync="popupActive">
      <unit-edit
        v-if="popupActive"
        @closePop="closePop"
        @loadData="loadData"
        :medicalCenterId="medicalCenterId"
        :medicalCenterData="medicalCenterData"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
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
      <vs-table ref="table" stripe :data="medicalCenters">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between" v-if="!isPlanPop">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <th class="td-check" v-if="multipleCheck">
            <span class="con-td-check">
              <vs-checkbox :checked="isCheckedAll" @change="handleCheckAll()" size="small" />
            </span>
          </th>
          <vs-th>编号</vs-th>
          <vs-th>体检中心名称</vs-th>
          <vs-th>体检中心编号</vs-th>
          <vs-th>联系人</vs-th>
          <vs-th>手机号</vs-th>
          <vs-th>电话</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>创建时间</vs-th>
          <vs-th>操作</vs-th>
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
              <vs-td>
                <p>{{ tr.MecName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.MecCode }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Contact }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Mobile }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Tel }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Sort }}</p>
              </vs-td>
              <vs-td>
                <p class="product-category">{{ tr.ModifyName}}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.ModifyTime | formatDate }}</p>
              </vs-td>
              <vs-td class="whitespace-no-wrap">
                <span class="text-primary" size="small" type="border" @click.stop="editData(tr)">编辑</span>
              </vs-td>
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
  </div>
</template>

<script>
import UnitEdit from "./Edit";
import { getMedicalCenters } from "@/http/medical_center.js";
export default {
  components: {
    UnitEdit
  },
  props: {
    multipleCheck: {
      type: Boolean,
      default: false
    },
    isPlanPop:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //Page
      medicalCenters: [],
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,

      //filter
      MedicalCenterNameInput: null,

      // Pop
      title: null,
      popupActive: false,
      medicalCenterId: null,
      medicalCenterData: null,
      timer: "",
      mark: null,

      checkedGroup: [],
      isCheckField: "ID",
      isCheckedAll: false
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
        mecName: this.MedicalCenterNameInput,
        mecName: this.MedicalCenterNameInput
      };
      getMedicalCenters(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.medicalCenters = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          this.addIsChecked();
        }
      });
    },
    //#region 弹窗
    addNewData() {
      this.medicalCenterId = null;
      this.popupActive = true;
      this.title = "添加职位信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(tr) {
      this.medicalCenterId = tr.ID;
      this.medicalCenterData = tr;
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
      let checkedCount = this.medicalCenters.filter(f => f.isChecked).length;
      let count = this.medicalCenters.length;
      this.isCheckedAll = checkedCount == count ? true : false;
    },
    handleCheckAll() {
      if (!this.medicalCenters.length > 0) return;
      this.isCheckedAll = !this.isCheckedAll;
      let val = this.isCheckedAll;
      this.medicalCenters.map((item, index) => {
        item.isChecked = val;
        this.changeCheckbox(item);
      });
    },
    changeCheckbox(tr) {
      if (tr) {
        if (tr.isChecked) {
          this.checkedGroup.push(tr);
        } else {
          this.delChecked(tr);
        }
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
    addIsChecked() {
      if (this.medicalCenters.length > 0) {
        this.medicalCenters.map((item, index) => {
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
