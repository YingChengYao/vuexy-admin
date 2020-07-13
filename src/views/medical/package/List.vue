<template>
  <div id class="data-list-container">
    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">套餐名称</label>
        <vs-input
          placeholder="Placeholder"
          v-model="packageNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <label class="vx-col label-name px-2">是否锁定</label>
        <vs-select
          v-model="isLockedSelect"
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
      <vs-table ref="table" :data="items" stripe>
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
            <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
          </div>
        </div>

        <template slot="thead">
          <vs-th>编号</vs-th>
          <vs-th>套餐名称</vs-th>
          <vs-th>套餐价格</vs-th>
          <vs-th>折扣</vs-th>
          <vs-th>折扣价</vs-th>
          <vs-th>婚姻状态</vs-th>
          <vs-th>性别</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>是否锁定</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>修改时间</vs-th>
          <vs-th>操作</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p>{{ indextr+1 }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PackageName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.PackagePrice }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Discount }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.DiscountPrice }}</p>
              </vs-td>
              <vs-td>
                <vs-chip
                  transparent
                  :color="getMarriageColor(tr.Marriage)"
                  v-if="!tr.Children"
                >{{ tr.MarriageName}}</vs-chip>
              </vs-td>
              <vs-td>
                <vs-chip
                  transparent
                  :color="getGenderColor(tr.Gender)"
                  v-if="!tr.Children"
                >{{ tr.GenderName}}</vs-chip>
              </vs-td>
              <vs-td>
                <p>{{ tr.Sort }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.IsLocked?'是':'否' }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.ModifyName }}</p>
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
                <span
                  class="text-primary px-2"
                  size="small"
                  type="border"
                  @click.stop="deployProject(tr.ID)"
                >项目配置</span>
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
import { getPackages } from "@/http/package.js";
export default {
  components: {},
  data() {
    return {
      items: [],
      isLockedSelectOptions: [
        {
          name: "请选择",
          value: null
        },
        {
          name: "否",
          value: false
        },
        {
          name: "是",
          value: true
        }
      ],

      //filter
      packageNameInput: "",
      isLockedSelect: false,

      //Page
      itemsPerPage: 10,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [10, 20, 50, 100],
      totalItems: 0,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {}
    };
  },
  computed: {},
  methods: {
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        mecid: userInfo.mecID,
        packageName: this.packageNameInput,
        isLocked: this.isLockedSelect
      };

      getPackages(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.items = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
          console.log("套餐列表：", this.items);
        }
      });
    },
    addNewData() {
      this.$router
        .push({ name: "package_edit", params: { mark: "add" } })
        .catch(() => {});
    },
    editData(data) {
      this.$router
        .push({ name: "package_edit", params: { id: data, mark: "edit" } })
        .catch(() => {});
    },
    getMarriageColor(status) {
      if (status === 0) return "primary";
      if (status === 1) return "success";
      if (status === 2) return "danger";
      return "primary";
    },
    getGenderColor(status) {
      console.log("status:", status);
      if (status === 0) return "primary";
      if (status === 1) return "success";
      if (status === 2) return "danger";
      return "primary";
    },
    deployProject(data) {
      this.$router.push(`/deploy_project/${data}`).catch(() => {});
    },
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.loadData();
    }
  },
  created() {},
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
