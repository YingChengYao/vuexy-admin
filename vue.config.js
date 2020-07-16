const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname) 设置绝对路径
}

module.exports = {
  publicPath: "/",
  transpileDependencies: ["vue-echarts", "resize-detector"],
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("views", resolve("./src/views"))
      .set("assets", resolve("./src/assets"))
      .set("components", resolve("./src/components"));
    //...可以继续自定义别名
    //set 第一个参数：设置的别名；第二个参数：原来默认的路径
  },
  outputDir: "dist", //build输出目录
  assetsDir: "assets", //静态资源目录（js, css, img）
  lintOnSave: false, //是否开启eslint
  devServer: {
    open: true, //是否自动弹出浏览器页面
    host: "localhost",
    port: "8080",
    https: false, //是否使用https协议
    hotOnly: false, //是否开启热更新
    proxy: {
      "/api": {
        target: "http://manage.qrtj.cn", //API服务器的地址
        //target: "http://localhost:8081",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
