<template>
  <div class>
    <table class="table table-bordered table-hover table-striped projects">
      <tr>
        <td style="width:20px"></td>
        <td style="width:350px">模块名称</td>
        <td>按钮权限</td>
      </tr>
      <tr v-for="(item,index) in treeData" v-show="item.open" :key="index">
        <td>{{index+1}}</td>
        <td>
          <span v-bind:style="'margin-left:'+ (item.Levels)*20 +'px'">
            <span @@click="toggle(item)" v-if="item.HasChildren" style="width:18px">
              <!-- <img src="@/assets/icon/left.png" alt="" style="width:18px"> -->
              <i v-bind:class="item.childopen?'fa fa-minus-square':'fa fa-plus-square'" style="width:18px"></i>
              <!-- <i v-bind:class="item.childopen?'keyboard_arrow_down':'keyboard_arrow_down'"></i> -->
            </span>
            <!-- <label
              @@click.stop
              @@dblclick.stop
              class="custom-control custom-checkbox"
              style="margin-bottom:0px;"
            >
              <input
                v-model="Modules"
                class="custom-control-input"
                @@change="checkdChange(item)"
                type="checkbox"
                :value="item.ID"
              />
              <span class="custom-control-indicator"></span>
            </label> -->
            {{item.Name}}
          </span>
        </td>
        <td>
          <label
            class="custom-control custom-checkbox"
            style="margin-bottom:0px;"
            v-for="(item1,index1) in item.Permissions" :key="index1"
          >
            <input
              v-model="Permissions"
              class="custom-control-input"
              type="checkbox"
              :value="item1.PermissionID"
            />
            <span class="custom-control-indicator"></span>
            <span class="custom-control-description">{{item1.PermissionName}}</span>
          </label>
        </td>
      </tr>
    </table>
  </div>
</template>

<script src="https://use.fontawesome.com/fa2a982bdc.js"></script>
<script>
export default {
  name: "",
  data() {
    return {
      treeData: [
        {
          ID: 1,
          Name: "sss1",
          open: true,
          Levels: 0,
          HasChildren: true,
          childopen: true,
          Permissions: [
            {
              PermissionID: 1,
              PermissionName: "新增"
            }
          ]
        },
        {
          ID: 2,
          Name: "sss2",
          open: false,
          Levels: 0,
          HasChildren: false,
          childopen: false,
          Permissions: [
            {
              PermissionID: 1,
              PermissionName: "新增"
            }
          ],
          ParentId:1
        },
        {
          ID: 3,
          Name: "sss3",
          open: true,
          Levels: 0,
          HasChildren: false,
          childopen: false,
          Permissions: [
            {
              PermissionID: 1,
              PermissionName: "新增"
            }
          ]
        }
      ],
      Modules:"",
      Permissions:"",
      PageOpera:[]
    };
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    toggle: function(data) {
      if (data.HasChildren) {
        data.childopen = !data.childopen;
        $.each(PageOperatreeData, function(index, item) {
          if (item.ParentId == data.ID) {
            item.open = !item.open;
          }
        });
      }
    },
    checkdChange: function(data) {
      var fatherID = [];
      fatherID = data.Path.replace("/" + data.ID + "/", "").split("/");
      var childID = [];
      PageOpera.treeData.forEach(function(item) {
        if (item.Path.indexOf(data.Path) > -1) {
          if (item.ID != data.ID) childID.push(item.ID);
        }
      });

      if (PageOpera.Modules.indexOf(data.ID) > -1) {
        fatherID.forEach(function(item) {
          if (childID.indexOf(item) < 0 && item.length > 0) childID.push(item);
        });
        childID.forEach(function(item) {
          if (PageOpera.Modules.indexOf(item) < 0) PageOpera.Modules.push(item);
        });
      } else {
        childID.forEach(function(item) {
          var idx = PageOpera.Modules.indexOf(item);
          if (idx > -1) PageOpera.Modules.splice(idx, 1);
        });
      }
      return;
    }
  }
};
</script>
<style lang='sass' scoped>
</style>
