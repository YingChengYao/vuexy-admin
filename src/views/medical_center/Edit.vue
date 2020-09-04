<template>
  <div>
    <vx-card title>
      <div class="vx-row">
        <!-- 体检中心名称 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="体检中心名称"
            v-model="data_local.MecName"
            class="w-full"
            name="体检中心名称"
            v-validate="'required'"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('体检中心名称')"
          >{{ errors.first('体检中心名称') }}</span>
        </div>
        <!-- 体检中心编码 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="体检中心编码"
            v-model="data_local.MecCode"
            class="w-full"
            name="体检中心编码"
            v-validate="'required'"
            :disabled="mark=='edit'"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('体检中心编码')"
          >{{ errors.first('体检中心编码') }}</span>
        </div>
        <!-- 体检中心等级 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-input--label">体检中心等级</label>
          <v-select
            v-model="data_local.MecGrade"
            label="Name"
            value="Value"
            :options="gradeOptions"
            :reduce="m => m.Value"
            name="体检中心等级"
            v-validate="'required'"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('体检中心等级')"
          >{{ errors.first('体检中心等级') }}</span>
        </div>
        <!-- 体检中心性质 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-input--label">体检中心性质</label>
          <v-select
            v-model="data_local.MecNature"
            label="Name"
            value="Value"
            :options="natureOptions"
            :reduce="m => m.Value"
            name="体检中心性质"
            v-validate="'required'"
          />

          <span
            class="text-danger text-sm"
            v-show="errors.has('体检中心性质')"
          >{{ errors.first('体检中心性质') }}</span>
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
        <!-- 联系人手机 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="联系人手机"
            v-model="data_local.Mobile"
            class="w-full"
            name="联系人手机"
            v-validate="'required|mobile'"
          />
          <span class="text-danger text-sm" v-show="errors.has('联系人手机')">{{ errors.first('联系人手机') }}</span>
        </div>
        <!-- 电话 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="电话"
            v-model="data_local.Tel"
            class="w-full"
            name="电话"
            v-validate="'phone'"
          />
          <span class="text-danger text-sm" v-show="errors.has('电话')">{{ errors.first('电话') }}</span>
        </div>
        <!-- 排序 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-input
            label="排序"
            v-model="data_local.Sort"
            class="w-full"
            name="排序"
            v-validate="'numeric'"
          />
          <span class="text-danger text-sm" v-show="errors.has('排序')">{{ errors.first('排序') }}</span>
        </div>

        <!-- 所在省 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-select--label">所在省</label>
          <v-select
            label="Name"
            value="Code"
            v-model="data_local.Province"
            :options="provinceOptions"
            @input="loadCityData"
            :clearable="false"
            name="所在省"
            v-validate="'required'"
          />
          <span class="text-danger text-sm" v-show="errors.has('所在省')">{{ errors.first('所在省') }}</span>
        </div>
        <!-- 所在市 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <label class="vs-select--label">所在市</label>
          <v-select
            ref="city"
            label="Name"
            value="Code"
            v-model="data_local.City"
            @input="loadCountyData()"
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
            label="Name"
            value="Code"
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

        <!-- 描述 -->
        <div class="vx-col w-full mt-4" style="height:40rem">
          <label class="vx-col label-name vs-input--label">描述</label>
          <quill-editor v-model="data_local.Remark" style="height:35rem;"></quill-editor>
        </div>
      </div>

      <!-- Save & Reset Button -->
      <div class="vx-row mt-8">
        <div class="vx-col w-full">
          <div class="flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" @click="save_changes" v-preventClick>保存</vs-button>
            <vs-button class="ml-4 mt-2" type="border" color="warning" @click="cancel">取消</vs-button>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

import {
  addMedicalCenter,
  editMedicalCenter,
  getMedicalCenterDetail,
} from "@/http/medical_center.js";
import {
  getMedicalCenterGradeDataSource,
  getMedicalCenterNatureDataSource,
  getProvinceDataSource,
  getCityDataSource,
  getCountyDataSource,
} from "@/http/data_source.js";

export default {
  name: "",
  components: {
    quillEditor,
  },
  props: {
    mark: {
      type: String,
      default: null,
    },
    medicalCenterID: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      data_local: {},
      gradeOptions: [],
      natureOptions: [],
      provinceOptions: [],
      cityOptions: [],
      countyOptions: [],
    };
  },
  computed: {},
  created() {
    this.loadMedicalCenterGrade();
    this.loadMedicalCenterNature();
    this.loadData();
    this.loadProvinceData();
  },
  mounted() {},
  methods: {
    loadData() {
      if (!this.medicalCenterID) return;

      let para = {
        mecid: this.medicalCenterID,
      };
      getMedicalCenterDetail(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.data_local = data;
          console.log("dataID:", data);
        }
      });
    },
    //省市区数据加载
    loadProvinceData() {
      getProvinceDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.provinceOptions = data;
          console.log("省:", data);
        }
      });
    },
    loadCityData() {
      debugger;
      this.$refs.city.clearSelection();
      this.$refs.county.clearSelection();
      let para = {
        code: this.data_local.Province.Code,
      };
      getCityDataSource(para).then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.cityOptions = data;
        }
      });
    },
    loadCountyData() {
      if (!this.data_local.City) return;
      this.countyOptions = [];
      this.$refs.county.clearSelection();
      let para = {
        code: this.data_local.City.Code,
      };
      getCountyDataSource(para).then((res) => {
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
            mecName: this.data_local.MecName,
            mecGrade: this.data_local.MecGrade,
            mecNature: this.data_local.MecNature,
            contact: this.data_local.Contact,
            tel: this.data_local.Tel,
            mobile: this.data_local.Mobile,
            sort: this.data_local.Sort,
            remark: this.data_local.Remark,
            province: this.data_local.Province.Code,
            city: this.data_local.City.Code,
            county: this.data_local.County.Code,
            street: this.data_local.Street,
          };

          if (this.mark === "add") {
            para.MecCode = this.data_local.MecCode;
            addMedicalCenter(para).then((res) => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "成功",
                  text: res.message,
                  color: "success",
                });
                this.$emit("loadData");
                this.cancel();
              }
            });
          } else if (this.mark === "edit") {
            para.ID = this.data_local.ID;
            editMedicalCenter(para).then((res) => {
              if (res.resultType == 0) {
                this.$vs.notify({
                  title: "成功",
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
    loadMedicalCenterGrade() {
      getMedicalCenterGradeDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.gradeOptions = data;
          if (this.gradeOptions.length > 0) {
            this.data_local.MecGrade = this.gradeOptions[0].Value;
          }
        }
      });
    },
    loadMedicalCenterNature() {
      getMedicalCenterNatureDataSource().then((res) => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.natureOptions = data;
          console.log("natureOptions:", this.natureOptions);
          if (this.natureOptions.length > 0) {
            console.log(this.natureOptions[0].Value);
            this.data_local.MecNature = this.natureOptions[0].Value;
          }
        }
      });
    },
  },
};
</script>
<style lang='sass' scoped>
</style>
