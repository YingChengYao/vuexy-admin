<template>
  <div class>
    <vs-table ref="table" :data="rowData" stripe>
      <!-- <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container header-left">
          <vs-button
            v-if="!isSelectedPop"
            color="primary"
            type="border"
            class="mb-4 mr-4"
            @click="addNewData"
          >添加</vs-button>
        </div>
      </div>-->

      <template slot="thead">
        <vs-th v-if="showIndex">编号</vs-th>
        <vs-th :key="index" v-for="(item,index) in cloumns">{{item.title}}</vs-th>
        <!-- <th class="td-check">
          <span class="con-td-check">
            <vs-checkbox
              :checked="isCheckedAll"
              @change="handleCheckAll()"
              v-if="isSelectedPop"
              size="small"
            />
          </span>
        </th>-->
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td v-if="showIndex">
              <p>{{ indextr+1 }}</p>
            </vs-td>
            <vs-td :key="index" v-for="(item,index) in cloumns">{{tr[item.field]}}</vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    cloumns: {
      type: Array,
      required: true
    },
    rowData: {
      type: Object,
      default: null
    },
    showIndex: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  components: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='sass' scoped>
</style>
