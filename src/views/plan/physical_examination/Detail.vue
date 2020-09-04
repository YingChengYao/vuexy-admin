<template>
  <div class>
    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">职工名称</label>
        <!-- <vs-input
          placeholder
          v-model="searchInfo.SingleName"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        /> -->
        <vs-button class="vx-col" color="primary" type="border" @click="getTableData">查询</vs-button>
      </vs-row>
    </vx-card>
    <div class="vx-card p-6">
      <qr-table
        ref="table"
        v-model="selected"
        :items="tableData"
        :cloumns="cloumns"
        :operates="operates"
      >
        <template slot="header">
          <!-- <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button> -->
        </template>
      </qr-table>
      <div class="flex mt-4">
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
  </div>
</template>

<script>
import infoList from "@/components/mixins/infoList";
import { getPhysicalExaminationDetail } from "@/http/plan.js";
import { formatTimeToStr } from "@/common/utils/data/date";
export default {
  name: "",
  mixins: [infoList],
  props: {
    planId: {
      type: String,
      default: null,
    },
    mark: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      //table
      searchInfo: {},
      selected: [],
      listApi: getPhysicalExaminationDetail,
      cloumns: [
        { headerName: "职工名称", field: "EmployeeName" },
        { headerName: "性别", field: "GenderName" },
        { headerName: "身份证", field: "IdNo" },
        { headerName: "手机号", field: "Mobile" },
        { headerName: "排序", field: "Sort" },
        { headerName: "修改人", field: "ModifyName" },
        {
          headerName: "修改时间",
          field: "ModifyTime",
          formatter: (value) => {
            if (value) return formatTimeToStr(value);
          },
        },
      ],
      operates: {
        list: [
          // {
          //   title: "查看",
          //   show: true,
          //   method: (index, row) => {
          //     this.viewData(row.ID);
          //   },
          // },
        ],
      },
    };
  },
  components: {},
  created() {
    this.searchInfo.planId = this.planId;
    this.getTableData();
  },
  mounted() {},
  methods: {},
};
</script>
<style lang='sass' scoped>
</style>
