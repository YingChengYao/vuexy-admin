<template>
  <div id="user-edit-tab-info">
    <vx-card title="基本信息">
      <div class="vx-row">
        <div class="vx-col md:w-1/3 w-full">
          <label class="label-name px-2">计划名称</label>
          <vs-input
            class="w-full"
            v-model="data_local.PlanName"
            v-validate="'required'"
            name="计划名称"
          />
          <span class="text-danger text-sm" v-show="errors.has('计划名称')">{{ errors.first('计划名称') }}</span>
        </div>
        <div class="vx-col md:w-1/3 w-full">
          <label class="label-name px-2">开始日期</label>
          <datepicker label="开始日期" format="yyyy-MM-dd" placeholder v-model="data_local.StartTime"></datepicker>
          <!-- <span class="text-danger text-sm" v-show="errors.has('开始日期')">{{ errors.first('开始日期') }}</span> -->
        </div>
        <div class="vx-col md:w-1/3 w-full">
          <label class="label-name px-2">结束日期</label>
          <datepicker label="结束日期" format="yyyy-MM-dd" placeholder v-model="data_local.EndTime"></datepicker>

          <!-- <span class="text-danger text-sm" v-show="errors.has('结束日期')">{{ errors.first('结束日期') }}</span> -->
        </div>
        <div class="vx-col w-full">
          <div class="mt-4">
            <label class="vs-input--label">选择体检中心</label>
            <v-select
              multiple
              :closeOnSelect="false"
              v-model="data_local.MecIDs"
              label="Name"
              :options="physicalExaminationCenterOptions"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
          </div>
        </div>

        <div class="vx-col w-full">
          <div class="mt-4">
            <vs-input
              label="备注"
              v-model="data_local.CompanyName"
              class="w-full"
              name="备注"
              v-validate="'required'"
            />
            <span class="text-danger text-sm" v-show="errors.has('备注')">{{ errors.first('备注') }}</span>
          </div>
        </div>
      </div>

      <vs-row vs-align="center" class="mt-4">
        <label class="vx-col label-name px-2">标准</label>
        <!-- <vs-input
          placeholder="Placeholder"
          v-model="unitNameInput"
          class="vx-col md:w-1/6 sm:w-1/2 w-full px-2"
        />-->

        <vs-button class="vx-col" color="primary" type="border" @click="">添加</vs-button>
        <div class="px-2">
          <vs-chip transparent closable color="dark" @click="isDeleted=true" v-if="!isDeleted">1000</vs-chip>
          <vs-chip transparent closable color="dark">1100</vs-chip>
          <vs-chip transparent closable color="dark">1050</vs-chip>
        </div>
      </vs-row>

      <vs-row class="mt-4"></vs-row>
      <vs-row class="mt-4">
        <div class="vx-col md:w-1/2 w-full">
          <!-- <table class="dataTabble">
            <thead>
              <tr>
                <th width="110">栏目名称</th>
                <th width="200">发布时间</th>
                <th width="160">公告数量</th>
                <th width="160">操作</th>
              </tr>
            </thead>
            <draggable v-model="tablelist" element="tbody" :move="getdata" @update="datadragEnd">
              <tr v-for="(item,id) in tablelist" :key="id">
                <td>{{item.name}}</td>
                <td>{{item.time}}</td>
                <td>{{item.num}}</td>
                <td>
                  <div class="tabopa">
                    <a @click="dialogFormVisible = true" style="cursor:pointer">添加</a>
                    <a @click="open2">删除</a>
                  </div>
                </td>
              </tr>
            </draggable>
          </table>-->

          <!-- <vs-table ref="table" stripe :data="types">
            <template slot="thead">
              <vs-th>编号</vs-th>
              <vs-th>职位名称</vs-th>
              <vs-th>排序</vs-th>
              <vs-th>备注</vs-th>
            </template>

            <template slot-scope="{data}">
              <tbody>
                <draggable v-model="types" element="tbody" group="people" class="p-2 cursor-move">
                  <vs-tr :key="indextr" v-for="(tr, indextr) in types">
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
                  </vs-tr>
                </draggable>
              </tbody>
            </template>
          </vs-table>-->

          <vs-list>
            <vs-list-header title="People Group 1" color="primary"></vs-list-header>

            <draggable :list="types" group="people" class="p-2 cursor-move">
              <vs-list-item
                v-for="(listItem, index) in types"
                :key="index"
                :title="listItem.PositionName"
                :subtitle="listItem.PositionName"
              >
                <vs-avatar slot="avatar" :text="types.PositionName" />
              </vs-list-item>
            </draggable>
          </vs-list>
          <!-- <vs-list>
            <vs-list-header title="全部职工" color="primary"></vs-list-header>

            <draggable :list="types" group="people" class="p-2 cursor-move">
              <vs-list-item
                v-for="(item, index) in types"
                :key="index"
                :title="item.PositionName"
                :subtitle="item.PositionName"
              >
                <div>{{item.PositionName}}-{{item.Sort}}</div>
              </vs-list-item>
            </draggable>
          </vs-list>-->
        </div>
        <div class="vx-col md:w-1/2 w-full">
          <!-- <vs-table ref="table" stripe :data="types2">
            <template slot="thead">
              <vs-th>编号</vs-th>
              <vs-th>职位名称</vs-th>
              <vs-th>排序</vs-th>
              <vs-th>备注</vs-th>
            </template>

            <template slot-scope="{data}">
                <draggable v-model="types2" element="tbody" group="people" class="p-2 cursor-move">
                  <vs-tr :key="indextr" v-for="(tr, indextr) in types2">
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
                  </vs-tr>
                </draggable>
            </template>
          </vs-table>-->

          <vs-list class="mt-5">
            <vs-list-header title="People Group 2" color="primary"></vs-list-header>

            <draggable :list="types2" group="people" class="p-2 cursor-move">
              <vs-list-item
                v-for="(listItem, index) in types2"
                :key="index"
                :title="listItem.PositionName"
                :subtitle="listItem.PositionName"
              >
                <vs-avatar slot="avatar" :text="listItem.PositionName" />
              </vs-list-item>
            </draggable>
          </vs-list>
          <!-- <vs-list>
            <vs-list-header title="全部职工" color="primary"></vs-list-header>

            <draggable :list="types2" group="people" class="p-2 cursor-move">
              <vs-list-item
                v-for="(item, index) in types2"
                :key="index"
                :title="item.PositionName"
                :subtitle="item.PositionName"
              >
                <div>{{item.PositionName}}-{{item.Sort}}</div>
              </vs-list-item>
            </draggable>
          </vs-list>-->
        </div>
      </vs-row>

      <!-- Save & Reset Button -->
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" @click="save_changes">保存</vs-button>
            <vs-button class="ml-4 mt-2" type="border" color="warning" @click="cancel">取消</vs-button>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from "vue-select";
import Datepicker from "vuejs-datepicker";
import draggable from "vuedraggable";
import PositionList from "../staff/position/List";

import {
  getProjectTypeDataSource,
  getMaritalDataSource,
  getGenderDataSource
} from "@/http/data_source.js";
import {
  addProjectItem,
  editProjectItem,
  getProjectItemDetails
} from "@/http/package.js";
import { getPositions, editPosition } from "@/http/staff.js";

export default {
  name: "",
  components: {
    vSelect,
    Datepicker,
    draggable,
    PositionList,
  },
  props: {
    projectItemId: {
      type: String,
      default: null
    },
    mark: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      //id: null,
      //mark: null,
      list1: [
        {
          name: "Paz Joya",
          email: "girliness@spotlike.co.uk"
        },
        {
          name: "Sunshine Cose",
          email: "executrixship@equisized.edu"
        },
        {
          name: "Alba Dobbin",
          email: "bidding@demibob.or"
        },
        {
          name: "Marlin Hinchee",
          email: "preholding@scuffly.co.uk"
        }
      ],
      list2: [
        {
          name: "Leia Atienza",
          email: "unmeasurableness@interlamellar.co.uk"
        },
        {
          name: "Lashawna Vaudrainm",
          email: "soaking@khubber.com"
        },
        {
          name: "Liliana Henscheid",
          email: "lecideine@turndown.org"
        },
        {
          name: "Keven Kolter",
          email: "nontenure@anglicanum.co.uk"
        }
      ],

      types: [
        {
          CompanyID: 3467685114320249000,
          ID: "6642233481866518528",
          IsLocked: false,
          ModifyId: null,
          ModifyTime: "2020-07-04T01:14:59",
          PositionName: "4",
          Remark: "4",
          Sort: 4
        },
        {
          CompanyID: 3467685114320249000,
          ID: "6642267790065278976",
          IsLocked: false,
          ModifyId: null,
          ModifyTime: "2020-07-04T01:14:51",
          PositionName: "3",
          Remark: "3",
          Sort: 3
        }
      ],
      types2: [
        // {
        //   CompanyID: 3467685114320249000,
        //   ID: "6642267790065278976",
        //   IsLocked: false,
        //   ModifyId: null,
        //   ModifyTime: "2020-07-04T01:14:51",
        //   PositionName: "2",
        //   Remark: "2",
        //   Sort: 2
        // }
      ],
      isDeleted: false,
      tablelist: [
        { id: 1, name: "活动消息1", time: "2018-08-25 14：54", num: "1000" },
        { id: 2, name: "公司消息2", time: "2018-08-25 14：54", num: "200" },
        { id: 3, name: "个人消息3", time: "2018-08-25 14：54", num: "30000" },
        { id: 4, name: "客户消息4", time: "2018-08-25 14：54", num: "40" }
      ],
      data_local: {},
      marriageOptions: [],
      genderOptions: [],
      physicalExaminationCenterOptions: [
        {
          Name: "鄞州医院",
          Value: 1
        },
        {
          Name: "彰基体检中心",
          Value: 2
        }
      ]
    };
  },
  computed: {},
  created() {
    //this.initData();
    this.loadMaritalStatus();
    this.loadGender();
    this.loadItemTypeData();
    this.loadData();
  },
  mounted() {},
  methods: {
    //拖动中与拖动结束
    getdata(evt) {
      console.log(evt.draggedContext.element.id);
    },
    datadragEnd(evt) {
      console.log("拖动前的索引 :" + evt.oldIndex);
      console.log("拖动后的索引 :" + evt.newIndex);
      console.log(this.tags);
    },
    loadData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        pageIndex: this.currentPage,
        pageSize: this.itemsPerPage,
        companyId: userInfo.companyID
      };
      getPositions(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("职位：", data);
          //this.types = data.Items;
          // this.types2 = data.Items;
          // this.totalPage = data.TotalPages;
          // this.totalItems = data.TotalItems;
        }
      });

      // console.log(this.projectItemId);
      // if (!this.projectItemId) return;
      // let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      // let para = {
      //   mecid: userInfo.mecID,
      //   id: this.projectItemId
      // };
      // getProjectItemDetails(para).then(res => {
      //   if (res.resultType == 0) {
      //     const data = JSON.parse(res.message);
      //     this.data_local = data;
      //   }
      // });
    },
    save_changes() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));

          let para = {
            singleName: this.data_local.SingleName,
            sort: this.data_local.Sort,
            remark: this.data_local.Remark,
            mecid: userInfo.mecID,
            isOptional: this.data_local.IsOptional
          };

          if (this.data_local.IsOptional) {
            para.singlePrice = this.data_local.SinglePrice;
            para.marriage = this.data_local.Marriage;
            para.gender = this.data_local.Gender;
            para.itemTypeID =
              this.data_local.ItemTypeID != null
                ? this.data_local.ItemTypeID.Value
                : null;
          }
          if (this.mark === "add") {
            addProjectItem(para).then(res => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success"
                });
                this.$emit("loadData");
                this.cancel();
              }
            });
          } else if (this.mark == "edit") {
            para.ID = this.projectItemId;
            para.isLocked = this.data_local.IsLocked;
            editProjectItem(para).then(res => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success"
                });
                this.$emit("loadData");
                this.cancel();
              }
            });
          }
        }
      });
    },
    cancel() {
      //this.$router.push("/project_item").catch(() => {});
      this.$emit("closePop", false);
    },
    loadMaritalStatus() {
      getMaritalDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.marriageOptions = data;
        }
      });
    },
    loadGender() {
      getGenderDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.genderOptions = data;
          console.log("性别：", data);
        }
      });
    },
    loadItemTypeData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        mecid: userInfo.mecID
      };
      getProjectTypeDataSource(para).then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.projectTypeStatus = data;
        }
      });
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
