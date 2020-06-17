<template>
  <div id="data-list-list-view" class="data-list-container">
    <!-- <data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
    />-->

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <div class="vx-row">
        <label class="vx-col label-name">用户名</label>
        <div class="vx-col md:w-1/6 sm:w-1/2 w-full">
          <vs-input placeholder="Placeholder" v-model="nameInput" />
        </div>
        <vs-button radius color="primary" type="border" icon-pack="feather" icon="icon-search" @click="loadData"></vs-button>
      </div>
    </vx-card>

    <vs-table ref="table" multiple v-model="selected" :data="integrals">
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container">
          <vs-dropdown vs-trigger-click class="dd-actions cursor-pointer mr-4 mb-4">
            <div
              class="p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-lg font-medium w-32 w-full"
            >
              <span class="mr-2">Actions</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>

            <vs-dropdown-menu>
              <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Delete</span>
                </span>
              </vs-dropdown-item>

              <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="ArchiveIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Archive</span>
                </span>
              </vs-dropdown-item>

              <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="FileIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Print</span>
                </span>
              </vs-dropdown-item>

              <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="SaveIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Another Action</span>
                </span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>

          <div
            class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="addNewData"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">添加</span>
          </div>
        </div>
      </div>

      <template slot="thead">
        <vs-th sort-key="id" v-show="false">ID</vs-th>
        <vs-th sort-key="name">用户名</vs-th>
        <vs-th sort-key="integral">积分</vs-th>
        <vs-th sort-key="remark">备注</vs-th>
        <vs-th sort-key="modify_time">修改时间</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td v-show="false">
              <p class="product-name font-medium truncate">{{ tr.UserID }}</p>
            </vs-td>
            <vs-td>
              <p class="product-name font-medium truncate">{{ tr.UserName }}</p>
            </vs-td>
            <vs-td>
              <p class="product-category">{{ tr.Integral}}</p>
            </vs-td>
            <vs-td>
              <p>{{ tr.Remark }}</p>
            </vs-td>
            <vs-td>
              <p>{{ tr.ModifyTime | formatDate }}</p>
            </vs-td>
            <vs-td class="whitespace-no-wrap">
              <feather-icon
                icon="EditIcon"
                svgClasses="w-5 h-5 hover:text-primary stroke-current"
                @click.stop="editData(tr)"
              />
              <feather-icon
                icon="TrashIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                @click.stop="deleteData(tr.id)"
              />
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
    ></vs-pagination>
  </div>
</template>

<script>
//import DataViewSidebar from "./DataViewSidebar.vue";
import { getIntegrals } from "@/http/member.js";
import vSelect from "vue-select";
export default {
  components: {
    //DataViewSidebar
    vSelect
  },
  data() {
    return {
      selected: [],
      integrals: [],
      isMounted: false,

      //Page
      itemsPerPage: 4,
      currentPage: 1,
      totalPage: 0,
      descriptionItems: [4, 10, 15, 20],
      totalItems: 0,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},

      nameInput: ""
    };
  },
  computed: {},
  methods: {
    loadData() {
      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        userName: this.nameInput
      };

      getIntegrals(para).then(res => {
        this.integrals = res.Items;
        this.totalPage = res.TotalPages;
        this.totalItems = res.TotalItems;
      });
    },
    addNewData() {
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },
    deleteData(id) {
      this.$store.dispatch("dataList/removeItem", id).catch(err => {
        console.error(err);
      });
    },
    editData(data) {
      // this.sidebarData = JSON.parse(JSON.stringify(this.blankData))
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    getOrderStatusColor(status) {
      if (status === "on_hold") return "warning";
      if (status === "delivered") return "success";
      if (status === "canceled") return "danger";
      return "primary";
    },
    getPopularityColor(num) {
      if (num > 90) return "success";
      if (num > 70) return "primary";
      if (num >= 50) return "warning";
      if (num < 50) return "danger";
      return "primary";
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.loadData();
    }
  },
  created() {},
  mounted() {
    this.isMounted = true;
    this.loadData();
  },
  watch: {
    currentPage() {
      this.loadData();
    },
    itemsPerPage() {
      this.loadData();
    }
  }
};
</script>

<style lang="scss">
#data-list-list-view {
  .vs-con-table {
    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .product-name {
      max-width: 23rem;
    }

    .vs-table--header {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
        td {
          padding: 20px;
          &:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          &:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
        }
        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check {
        padding: 0 15px !important;
      }
      tr {
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }

  .label-name{
    line-height: 38px;
  }
}
</style>
