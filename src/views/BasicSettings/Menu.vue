<template>
  <vx-card title="菜单管理">
    <vs-table v-model="selected" stripe pagination max-items="11" :data="users">
      <template slot="thead">
        <vs-th>Email</vs-th>
        <vs-th>Name</vs-th>
        <vs-th>Website</vs-th>
        <vs-th>Nro</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="tr.email">
            {{tr.email}}
          </vs-td>
          <vs-td :data="tr.username">{{tr.name}}</vs-td>
          <vs-td :data="tr.id">{{tr.website}}</vs-td>
          <vs-td :data="tr.id">{{tr.id}}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </vx-card>


  <!-- <Table :columns="columns" :data="users"></Table> -->
</template>

<script>
export default {
  data() {
    return {
      selected: [],
      users: [
        {
          id: 1,
          name: "Leanne Graham",
          username: "Bret",
          email: "Sincere@april.biz",
          website: "hildegard.org",
          hasChildren: true,
          childopen: true,
          children: [
            {
              id: 11,
              name: "11Ervin Howell",
              username: "11Antonette",
              email: "Shanna@melissa.tv",
              website: "anastasia.net"
            }
          ]
        },
        {
          id: 2,
          name: "Ervin Howell",
          username: "Antonette",
          email: "Shanna@melissa.tv",
          website: "anastasia.net"
        },
        {
          id: 3,
          name: "Clementine Bauch",
          username: "Samantha",
          email: "Nathan@yesenia.net",
          website: "ramiro.info"
        },
        {
          id: 4,
          name: "Patricia Lebsack",
          username: "Karianne",
          email: "Julianne.OConner@kory.org",
          website: "kale.biz"
        },
        {
          id: 5,
          name: "Chelsey Dietrich",
          username: "Kamren",
          email: "Lucio_Hettinger@annie.ca",
          website: "demarco.info"
        },
        {
          id: 6,
          name: "Mrs. Dennis Schulist",
          username: "Leopoldo_Corkery",
          email: "Karley_Dach@jasper.info",
          website: "ola.org"
        },
        {
          id: 7,
          name: "Kurtis Weissnat",
          username: "Elwyn.Skiles",
          email: "Telly.Hoeger@billy.biz",
          website: "elvis.io"
        },
        {
          id: 8,
          name: "Nicholas Runolfsdottir V",
          username: "Maxime_Nienow",
          email: "Sherwood@rosamond.me",
          website: "jacynthe.com"
        },
        {
          id: 9,
          name: "Glenna Reichert",
          username: "Delphine",
          email: "Chaim_McDermott@dana.io",
          website: "conrad.com"
        },
        {
          id: 10,
          name: "Clementina DuBuque",
          username: "Moriah.Stanton",
          email: "Rey.Padberg@karina.biz",
          website: "ambrose.net"
        }
      ],
      colums: [
        {
          title: "序号",
          key: "id"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "详情",
          key: "note"
        }
      ]
    };
  },
  methods: {
    handleSelected(tr) {
      this.$vs.notify({
        title: `Selected ${tr.name}`,
        text: `Email: ${tr.email}`
      });
    },
    toggle(data) {
      if (data.children) {
        alert(0);
      }
    }
  },
  computed: {
    // tableColumns() {
    //   let renderCols = Object.assign([], this.columns); //复制一份columns
    //   //设置render
    //   let expandRender = {
    //     type: "expand",
    //     width: 50, //展开列的宽度（就是那个箭头符号）
    //     render: (h, params) => {
    //       //复制属性 如果vue中没有props，可以直接设置不用assign，这一步也不需要，直接在return中props里面写就行了
    //       let props = Object.assign({}, this.$props, {
    //         searchable: false,
    //         showHeader: false,
    //         highlightRow: true,
    //         type: "child"
    //       });
    //       //如果row中有children属性，就设置data为该children
    //       if ("children" in params.row) {
    //         props.data = params.row.children;
    //       }
    //       return h("Table", {
    //         props: { ...props },
    //         on: {
    //           //这里设置重写的on方法
    //         }
    //       });
    //     }
    //   };
    //   renderCols = [expandRender, ...renderCols];
    //   return renderCols;
    // }
  }
};
</script>
