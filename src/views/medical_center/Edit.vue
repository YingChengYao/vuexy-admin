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
          <vs-select
            label="体检中心等级"
            v-model="data_local.MecGrade"
            class="w-full select-large"
            name="体检中心等级"
            v-validate="'required'"
          >
            <vs-select-item
              v-for="(item,index) in gradeOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>
          <span
            class="text-danger text-sm"
            v-show="errors.has('体检中心等级')"
          >{{ errors.first('体检中心等级') }}</span>
        </div>
        <!-- 体检中心性质 -->
        <div class="vx-col md:w-1/2 w-full mt-4">
          <vs-select
            label="体检中心性质"
            v-model="data_local.MecNature"
            class="w-full select-large"
            name="体检中心性质"
            v-validate="'required'"
          >
            <vs-select-item
              v-for="(item,index) in natureOptions"
              :key="index"
              :value="item.Value"
              :text="item.Name"
              class="w-full"
            />
          </vs-select>
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
            v-validate="'required|phone'"
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
        <div class="vx-col md:w-1/2 w-full mt-4"></div>

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
            <vs-button class="ml-auto mt-2" @click="save_changes">保存</vs-button>
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

import { addMedicalCenter, editMedicalCenter } from "@/http/medical_center.js";
import {
  getMedicalCenterGradeDataSource,
  getMedicalCenterNatureDataSource
} from "@/http/data_source.js";

export default {
  name: "",
  components: {
    quillEditor
  },
  props: {
    mark: {
      type: String,
      default: null
    },
    medicalCenterData: {
      type: Object,
      default: {}
    },
    medicalCenterId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      data_local: {},
      gradeOptions: [],
      natureOptions: []
    };
  },
  computed: {},
  created() {
    this.loadMedicalCenterGrade();
    this.loadMedicalCenterNature();
    this.medicalCenterId ? this.loadData() : this.initData();
  },
  mounted() {},
  methods: {
    initData() {
      this.data_local = {};
    },
    loadData() {
      if (!this.medicalCenterData) return;
      this.data_local = this.medicalCenterData;
      console.log(this.medicalCenterData);
      //   let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      //   let para = {
      //     mecid: userInfo.mecID,
      //     id: this.projectItemId
      //   };
      //   getProjectItemDetails(para).then(res => {
      //     if (res.resultType == 0) {
      //       const data = JSON.parse(res.message);
      //       this.data_local = data;
      //     }
      //   });
    },
    save_changes() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));

          let para = {
            MecName: this.data_local.MecName,
            MecGrade: this.data_local.MecGrade,
            MecNature: this.data_local.MecNature,
            Contact: this.data_local.Contact,
            Tel: this.data_local.Tel,
            Mobile: this.data_local.Mobile,
            sort: this.data_local.Sort,
            remark: this.data_local.Remark
          };

          if (this.mark === "add") {
            para.MecCode = this.data_local.MecCode;
            addMedicalCenter(para).then(res => {
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
          } else if (this.mark === "edit") {
            para.ID = this.data_local.ID;
            editMedicalCenter(para).then(res => {
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
      this.$emit("closePop", false);
    },
    loadMedicalCenterGrade() {
      getMedicalCenterGradeDataSource().then(res => {
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
      getMedicalCenterNatureDataSource().then(res => {
        if (res.resultType == 0) {
          const data = JSON.parse(res.message);
          this.natureOptions = data;
          if (this.natureOptions.length > 0) {
            this.data_local.MecNature = this.natureOptions[0].Value;
          }
        }
      });
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
