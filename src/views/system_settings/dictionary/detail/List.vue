<template>
  <div class="data-list-container">
    <vs-popup :title="title" :active.sync="popupActive">
      <dictionary-edit
        v-if="popupActive"
        @closePop="closePop"
        @loadData="loadData"
        :dictionaryID="dictionaryID"
        :key="timer"
        :mark="mark"
      />
    </vs-popup>

    <!-- <vx-card ref="filterCard" title class="user-list-filters mb-8">
      <vs-row vs-align="center">
        <label class="vx-col label-name px-2">项目类型名称</label>
        <vs-input
          placeholder
          v-model="singleNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />
        <vs-button class="vx-col" color="primary" type="border" @click="loadData">查询</vs-button>
      </vs-row>
    </vx-card> -->

    <div class="vx-card p-6">
      <vx-table
        ref="table"
        :items="dictionaryDetails"
        :totalItems="totalItems"
        :pageSize="10"
        @loadData="loadData"
      >
        <template slot="header">
          <vs-button color="primary" type="border" class="mb-4 mr-4" @click="addNewData">添加</vs-button>
        </template>
        <template slot="thead-header">
          <vs-th>展示值</vs-th>
          <vs-th>字典值</vs-th>
          <vs-th>状态</vs-th>
          <vs-th>排序</vs-th>
          <vs-th>修改人</vs-th>
          <vs-th>修改时间</vs-th>
          <vs-th>操作</vs-th>
        </template>
        <template slot="thead-content" slot-scope="item">
          <vs-td>
            <p>{{ item.tr.Name }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Code }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.IsLocked?'是':'否' }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.Remark }}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.ModifyName}}</p>
          </vs-td>
          <vs-td>
            <p>{{ item.tr.ModifyTime | formatDate }}</p>
          </vs-td>
          <vs-td class="whitespace-no-wrap">
            <span
              class="text-primary"
              size="small"
              type="border"
              @click.stop="editData(item.tr.ID)"
            >编辑</span>
            <span
              class="text-primary ml-2"
              size="small"
              type="border"
              @click.stop="editData(item.tr.ID)"
            >删除</span>
          </vs-td>
        </template>
      </vx-table>
    </div>
  </div>
</template>

<script>
import DictionaryEdit from "./Edit";

import { getSysDictionaryDetails } from "@/http/dictionary.js";

export default {
  components: {
    DictionaryEdit,
  },
  props: {
    dictionaryID: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      //Page
      dictionaryDetails: [],
      singleNameInput: null,
      totalItems: 0,

      // Pop
      title: null,
      popupActive: false,
      timer: "",
      mark: null,
    };
  },
  computed: {},
  methods: {
    loadData() {
      let para = {
        id: this.dictionaryID,
      };
      getSysDictionaryDetails(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("dics:", data);
          this.dictionaryDetails = data;
          this.totalItems = data.TotalItems;
        }
      });
    },
    //#region 弹窗
    addNewData() {
      this.dictionaryID = null;
      this.popupActive = true;
      this.title = "添加项目单项信息";
      this.mark = "add";
      this.handleLoad();
    },
    editData(id) {
      this.dictionaryID = id;
      this.popupActive = true;
      this.title = "修改项目单项信息";
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
  },
  mounted() {
    this.loadData();
  },
  watch: {
    currentPage() {
      this.loadData();
    },
  },
};
</script>

<style lang="scss">
</style>
