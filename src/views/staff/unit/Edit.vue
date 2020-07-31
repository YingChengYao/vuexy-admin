<template>
  <div id="user-edit-tab-info">
    <vx-card title>
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-select label="父级单位" v-model="data_local.ParentID" class="w-full select-large">
            <vs-select-item
              :style="'margin-left:'+ (item.level)*10 +'px'"
              v-for="(item,index) in unitOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <!-- 组织机构代码 -->
          <vs-input
            label="组织机构代码"
            v-model="data_local.CompanyCode"
            class="w-full"
            name="组织机构代码"
            v-validate="'required'"
            :disabled="mark=='edit'"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('组织机构代码')"
          >{{ errors.first('组织机构代码') }}</span>
        </div>

        <!-- 单位名称 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="单位名称"
            v-model="data_local.CompanyName"
            class="w-full"
            name="单位名称"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('单位名称')">{{ errors.first('单位名称') }}</span>
        </div>
        <!-- 联系人 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="联系人"
            v-model="data_local.Contact"
            class="w-full"
            name="联系人"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('联系人')">{{ errors.first('联系人') }}</span>
        </div>

        <!-- 联系电话 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="联系电话"
            v-model="data_local.Tel"
            class="w-full"
            name="联系电话"
            v-validate="'required|phone'"
          />
          <span class="text-danger text-sm" v-show="errors.has('联系电话')">{{ errors.first('联系电话') }}</span>
        </div>
        <!-- 手机号 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="手机号"
            v-model="data_local.Mobile"
            class="w-full"
            name="手机号"
            v-validate="'required|mobile'"
          />
          <span class="text-danger text-sm" v-show="errors.has('手机号')">{{ errors.first('手机号') }}</span>
        </div>

        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-select--label">所在省</label>
          <v-select
            label="ProvinceName"
            value="ProvinceCode"
            v-model="data_local.Province"
            :options="provinceOptions"
            @input="loadCityData(data_local.Province)"
            :clearable="false"
            name="所在省"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('所在省')">{{ errors.first('所在省') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-select--label">所在市</label>
          <v-select
            ref="city"
            label="CityName"
            value="CityCode"
            v-model="data_local.City"
            @input="loadCountyData(data_local.City)"
            :options="cityOptions"
            :clearable="false"
            name="所在市"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('所在市')">{{ errors.first('所在市') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-select--label">所在区</label>
          <v-select
            ref="county"
            label="CountyName"
            value="CountyCode"
            v-model="data_local.County"
            :options="countyOptions"
            :clearable="false"
            name="所在区"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('所在区')">{{ errors.first('所在区') }}</span>
        </div>
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="街道"
            v-model="data_local.Street"
            class="w-full"
            name="街道"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('街道')">{{ errors.first('街道') }}</span>
        </div>

        <!-- 排序 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input label="排序" v-model="data_local.Sort" class="w-full" />
        </div>
        <!-- 备注 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input label="备注" v-model="data_local.Remark" class="w-full" />
        </div>

        <!-- 所属行业 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-select label="所属行业" v-model="data_local.Industry" class="w-full select-large">
            <vs-select-item
              v-for="(item,index) in industryOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>
        </div>
      </div>

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

import { composeTree } from "@/common/utils/data/array.js";
import {
  getIndustryDataSource,
  getSubordinateUnitDataSource,
  getProvinceDataSource,
  getCityDataSource,
  getCountyDataSource,
} from "@/http/data_source.js";
import {
  addEmployeeUnit,
  editEmployeeUnit,
  getEmployeeUnitDetail,
} from "@/http/staff.js";

export default {
  name: "",
  components: {
    vSelect,
  },
  props: {
    unitId: {
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
      data_local: {},
      industryOptions: [],
      unitOptions: [],
      provinceOptions: [],
      cityOptions: [],
      countyOptions: [],
    };
  },
  computed: {},
  created() {
    this.loadIndustryData();
    this.loadSubordinateUnitData();
    this.loadProvinceData();
    this.loadData();
  },
  mounted() {},
  methods: {
    loadData() {
      if (!this.unitId) return;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      let para = {
        companyid: this.unitId,
      };
      getEmployeeUnitDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log("data:", data);
          this.data_local = data;
        }
      });
    },
    //行业下拉数据加载
    loadIndustryData() {
      getIndustryDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.industryOptions = data;
        }
      });
    },
    //子级单位数据加载
    loadSubordinateUnitData() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let para = {
        companyId: "6750305733891072000", //userInfo.companyID,
      };
      getSubordinateUnitDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          console.log(data);
          this.unitOptions = [];
          let b = composeTree(data, "Value", "ParentID");
          this.initSubordinateUnitData(b, 0, null);
        }
      });
    },
    initSubordinateUnitData(items, level, parent) {
      if (!Array.isArray(items)) {
        return;
      }
      items.map((item, index) => {
        item = Object.assign({}, item, {
          parent: parent,
          level: level,
        });
        if (item.children != undefined && item.children.length > 0) {
          item = Object.assign({}, item, {
            isExpand: true,
          });
        }
        if (typeof item.isChecked == "undefined") {
          item = Object.assign({}, item, {
            isChecked: false,
          });
        }
        if (typeof item.isShow == "undefined") {
          item = Object.assign({}, item, {
            isShow: true,
          });
        }
        this.unitOptions.push(item);

        this.initSubordinateUnitData(item.children, level + 1, item.Value);
      });
    },
    //省市区数据加载
    loadProvinceData() {
      getProvinceDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.provinceOptions = data;
        }
      });
    },
    loadCityData(data) {
      if (!data) return;
      this.cityOptions = [];
      this.$refs.city.clearSelection();
      this.countyOptions = [];
      this.$refs.county.clearSelection();
      getCityDataSource(data).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.cityOptions = data;
        }
      });
    },
    loadCountyData(data) {
      if (!data) return;
      this.countyOptions = [];
      this.$refs.county.clearSelection();
      getCountyDataSource(data).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.countyOptions = data;
        }
      });
    },
    save_changes() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));

          let para = {
            parentID: this.data_local.ParentID,
            companyName: this.data_local.CompanyName,
            contact: this.data_local.Contact,
            tel: this.data_local.Tel,
            mobile: this.data_local.Mobile,
            sort: this.data_local.Sort,
            industry: this.data_local.Industry,
            province: this.data_local.Province.ProvinceCode,
            city: this.data_local.City.CityCode,
            county: this.data_local.County.CountyCode,
            street: this.data_local.Street,
            remark: this.data_local.Remark,
          };

          if (this.mark === "add") {
            para.companyCode = this.data_local.CompanyCode;
            addEmployeeUnit(para).then((res) => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success",
                });
                this.$emit("loadData");
                this.cancel();
              }
            });
          } else if (this.mark == "edit") {
            para.ID = this.unitId;
            para.isLocked = this.data_local.IsLocked;
            editEmployeeUnit(para).then((res) => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "Success",
                  text: res.message,
                  color: "success",
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
      this.$emit("closePop", false);
    },
  },
};
</script>
<style lang='sass' scoped>
</style>
