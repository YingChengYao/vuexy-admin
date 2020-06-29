import axios from "axios";
import router from "@/router/router";
import { getToken } from "@/common/utils/auth/token";
import vue from "@/main.js";

const request = axios.create({
  baseURL: "http://manage.qrtj.cn",
  //baseURL: "http://localhost:5000/",
  timeout: 5000
});

//http request 拦截器
request.interceptors.request.use(
  config => {
    //this.$vs.loading();
    let curTime = new Date();
    let accessExpiration = window.localStorage.getItem("AccessExpiration");
    let refreshExpiration = window.localStorage.getItem("RefreshExpiration");

    let accesstime = new Date(Date.parse(accessExpiration));
    let refreshtime = new Date(Date.parse(refreshExpiration));

    const token = getToken();
    if (token && curTime > accesstime && curTime < refreshtime) {
      //重新请求token  TODO
    } else if (token && curTime > accesstime && curTime > refreshtime) {
      //跳转到登录页 TODO this无$router
      router.push({
        path: "/pages/login"
        //query: { redirect: router.currentRoute.fullPath }
      });
    } else if (token && curTime < accesstime && curTime < refreshtime) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = "Bearer " + token;
    }

    // if (config.method === "get") {
    //   var querystring = require("querystring");

    //   config.data = querystring.encode(config.data);
    // }

    // if (config.method === "post") {
    //   config.data = JSON.stringify(config.data);
    // }
    config.data = JSON.stringify(config.data);
    config.headers = {
      "Content-Type": "application/json"
    };
    return config;
  },
  error => {
    vue.$vs.notify({
      title: "Error",
      text: error.message,
      iconPack: "feather",
      icon: "icon-alert-circle",
      color: "danger"
    });
    return Promise.reject(error);
  }
);

//http response 拦截器
request.interceptors.response.use(
  response => {
    const data = response.data;
    if(!data.resultType && data.resultType != 0){
      return data;//TODO 路由MOCK使用，后期拿掉
    }
    if (data.resultType != 0) {
      vue.$vs.notify({
        title: "Error",
        text: data.message,
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "danger"
      });
    }

    return data;
    //TODO 401处理
  },
  error => {
    // this.$vs.loading.close();
    vue.$vs.notify({
      title: "Error",
      text: error.message,
      iconPack: "feather",
      icon: "icon-alert-circle",
      color: "danger"
    });
    //TODO 401处理
    return Promise.reject(error);
  }
);

export default request;
