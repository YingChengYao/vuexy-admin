<template>
  <div id="" class="data-list-container">
    <data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
    />

    <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <div class="vx-row">
        <label class="vx-col label-name">用户名</label>
        <div class="vx-col md:w-1/6 sm:w-1/2 w-full">
          <vs-input placeholder="Placeholder" v-model="nameInput" />
        </div>
        <vs-button
          radius
          color="primary"
          type="border"
          icon-pack="feather"
          icon="icon-search"
          @click="loadData"
        ></vs-button>
      </div>
    </vx-card>

    <div class="vx-card p-6">
      <vs-table ref="table" multiple v-model="selected" :data="users">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container">
            <div
              class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
              @click="addNewData"
              v-if="!hasPerm('system:post:add')"
            >
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">添加</span>
            </div>
          </div>
        </div>

        <template slot="thead">
          <vs-th sort-key="id">ID</vs-th>
          <vs-th sort-key="user_name">用户名</vs-th>
          <vs-th sort-key="id_number">身份证</vs-th>
          <vs-th sort-key="mobile">手机号</vs-th>
          <vs-th sort-key="integral">积分</vs-th>
          <vs-th sort-key="money">金额</vs-th>
          <vs-th sort-key="create_time">创建时间</vs-th>
          <vs-th>操作</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p class="product-name font-medium truncate">{{ tr.ID }}</p>
              </vs-td>
              <vs-td>
                <p class="product-name font-medium truncate">{{ tr.UserName }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.IdNumber }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Mobile }}</p>
              </vs-td>
              <vs-td>
                <p class="product-category">{{ tr.Integral}}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.Money }}</p>
              </vs-td>
              <vs-td>
                <p>{{ tr.CreateTime | formatDate }}</p>
              </vs-td>
              <vs-td class="whitespace-no-wrap">
                <feather-icon
                  icon="EditIcon"
                  svgClasses="w-5 h-5 hover:text-primary stroke-current"
                  @click.stop="editData(tr.ID)"
                />
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
  </div>
</template>

<script>
import DataViewSidebar from "./DataViewSidebar.vue";
import { getUsers } from "@/http/member.js";
import UserEdit from "./UserEdit.vue";
export default {
  components: {
    DataViewSidebar,
    UserEdit
  },
  data() {
    return {
      selected: [],
      users: [],
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
        pageSize: this.itemsPerPage
      };

      getUsers(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.users = data.Items;
          this.totalPage = data.TotalPages;
          this.totalItems = data.TotalItems;
        }
      });
    },
    addNewData() {
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },
    editData(data) {
      this.$router.push(`/member-user-edit/${data}`).catch(() => {});
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
    changePageMaxItems(index) {
      this.itemsPerPage = this.descriptionItems[index];
      this.loadData();
    }
  },
  created() {
    console.log("路由：", this.$router);
    console.log("路由1：", this.$store.state.permission.routes);
  },
  mounted() {
    this.isMounted = true;
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

  .label-name {
    line-height: 38px;
  }
}
</style>
